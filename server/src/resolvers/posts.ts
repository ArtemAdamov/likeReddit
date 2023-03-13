import {Resolver, Query, Mutation, Arg, InputType, Field, Ctx, UseMiddleware} from "type-graphql"
import {Post} from "../../entities/Post";
import {myContext} from "../types";
import {isAuth} from "../middleware/isAuth";

@InputType()
class PostInput {
    @Field()
    title: string
    @Field()
    text: string
}
@Resolver()
export class PostsResolver {
    @Query(() => [Post])
    posts(): Promise<Post[]> {
        return Post.find()
    }

    @Query(() => Post)
    post(
        @Arg("id") id: number,
    ): Promise<Post | null> {
        return Post.findOne({where: {id}});
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() {req}: myContext
    ): Promise<Post | undefined> {
        return Post.create({
            ...input,
            creatorId: req.session.userId
        }).save();
    }

    @Mutation(() => Post, {nullable : true})
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String, {nullable : true}) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOne({where: {id}})
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            post.title = title;
            await Post.update({id}, {title});
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,
    ): Promise<boolean> {
        await Post.delete(id);
        return true;
    }

}