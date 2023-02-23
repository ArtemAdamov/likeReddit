import {Resolver, Ctx, Mutation, Arg, InputType, Field, ObjectType ,Query} from "type-graphql"
import * as argon2 from "argon2";
import {myContext} from "../types";
import {User} from "../../entities/User";
import {createAccessToken, createRefreshToken} from "../auth/auth";
import {sendRefreshToken} from "../auth/sendRefreshToken";
import {verify} from "jsonwebtoken";

@InputType()
class UsernamePasswordInput {
    @Field(() => String)
    username: string
    @Field(() => String)
    password: string
}
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

@Resolver()
export class UsersResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() { em, req }: myContext) {
        const authorization = req.headers["authorization"];
        console.log(authorization)
        if (!authorization) {
            return null;
        }
        const token = authorization.split(" ")[1];
        const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        const user = await em.getRepository(User).findOne({username: payload.userId})
        if ( !user ) {
            console.log('err');
            return null;
        } else return { user }
    }
    @Mutation(() => UserResponse )
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: myContext
    ): Promise<UserResponse> {
        if (options.username.length < 2) {
            return {
                errors: [{
                    field: "username",
                    message: "username is too short"
                }]
            }
        }
        const hashed = await argon2.hash(options.password)
        const user = em.create(User, {
            username: options.username,
            password: hashed,
            createdAt: "",
            updatedAt: ""
        });
        try {
            await em.persistAndFlush(user);
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
        @Arg('options')  options: UsernamePasswordInput,
        @Ctx() {em, res}: myContext
    ) {
        const user = await em.getRepository(User).findOne({username: options.username})
        if (!user) {
            return {
                errors: [{
                    field: "username",
                    message: "username does not exist"
                }]
            }
        }
        const verify = await argon2.verify(user.password, options.password);
        if (!verify) {
            return {
                errors: [{
                    field: "password",
                    message: "password is incorrect"
                }]
            }
        }
        sendRefreshToken(res, createRefreshToken(user));
        return {
            accessToken: createAccessToken(user),
            user
        };
    }
}