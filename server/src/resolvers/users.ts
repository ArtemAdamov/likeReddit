import {Arg, Ctx, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root} from "type-graphql"
import * as argon2 from "argon2";
import {myContext} from "../types";
import {User} from "../../entities/User";
import {COOKIE_NAME, FORGER_PASS_PREFIX} from "../../entities/constants";
import {UsernamePasswordInput} from "../utils/userInput";
import {validateUser} from "../utils/validateUser";
import {sendEmail} from "../utils/sendEmails";
import {v4} from "uuid";
@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}
@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable:true})
    errors?: FieldError[]
    @Field(() => User, {nullable:true} )
    user?: User
    @Field()
    accessToken?: string;
}

@Resolver(User)
export class UsersResolver {
    @FieldResolver(() => String)
    email(
        @Root() user: User,
        @Ctx()  {req}: myContext
    ) {
        if (req.session.userId === user.id) {
             return user.email
        }
        return "";
    }
    @Query(() => User, { nullable: true })
    me(@Ctx() {  req }: myContext) {
        if (!req.session.userId) {
            return null;
        }
        return User.findOne({where: {id: req.session.userId}})
    }
    @Mutation(() => UserResponse )
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {  myDataSource }: myContext
    ): Promise<UserResponse> {
        const errors = validateUser(options);
        if (errors) {
            return {errors}
        }
        const hashed = await argon2.hash(options.password)
        let user;
        try {

            const result = await myDataSource
                .createQueryBuilder()
                .insert()
                .into(User)
                .values([
                    {
                        username: options.username,
                        email: options.email,
                        password: hashed
                    },
                ])
                .returning('*')
                .execute();
            user = result.raw[0];
        } catch (err) {
            if (err.detail.includes('already exist')) {
                return {
                    errors: [{
                        field: "username",
                        message: "username is already taken"
                    }]
                }
            } else {
                return {
                    errors: [{
                        field: "database",
                        message: err.message
                    }]
                }
            }
        }
        return {user};
    }
    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail')  usernameOrEmail: string,
        @Arg('password')  password: string,
        @Ctx() { req }: myContext
    ) {
        const user = await User.findOne(
            usernameOrEmail.includes('@') ? {where: {email: usernameOrEmail}} : { where: {username: usernameOrEmail}})
        if (!user) {
            return {
                errors: [{
                    field: "usernameOrEmail",
                    message: "username does not exist"
                }]
            }
        }
        const verify = await argon2.verify(user.password, password);
        if (!verify) {
            return {
                errors: [{
                    field: "password",
                    message: "password is incorrect"
                }]
            }
        }
        req.session.userId = user.id;
        return {
            user
        };
    }
    @Mutation(() => Boolean)
    logout(@Ctx() {req, res}: myContext) {
        return new Promise((resolve) =>
            req.session.destroy((err) => {
                if (err) {
                    console.log(err)
                    resolve(false)
                    return
                }
                res.clearCookie(COOKIE_NAME);
                resolve(true);
            })
        );
    }
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { redis} : myContext
    ) {
        const user = await User.findOne({where: {email}});
        if (!user) {
            return true
        }
        const token = v4();

        await redis.set(FORGER_PASS_PREFIX + token, user.id,'EX', 1000 * 60 * 60 * 24 * 3)

        await sendEmail(email, `<a href="http://localhost:3001/change-password/${token}">reset password<a>`)
        return true
    }
    @Mutation(() => UserResponse)
    async changePassword (
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() { req, redis} : myContext
    ): Promise<UserResponse> {
        if (newPassword.length < 2) {
            return {
                errors: [{
                    field: "newPassword",
                    message: "password should be greater than two"
                }]
        }}
        const userId = await redis.get(FORGER_PASS_PREFIX + token);
        if (!userId) {
            return {
                errors: [{
                    field: "token",
                    message: "token expired"
                }]
            }
        }
        const user = await User.findOne({ where: {id: parseInt(userId)}})
        if (!user) {
            return {
                errors: [{
                    field: "token",
                    message: "user no longer exist"
                }]
            }
        }
        await User.update({id: parseInt(userId)}, {password: await argon2.hash(newPassword)})
        await redis.del(FORGER_PASS_PREFIX + token)
        req.session.userId = user.id;
        return {user}
    }
}