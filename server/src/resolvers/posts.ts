import {Resolver, Query, Ctx, Mutation, Arg} from "type-graphql"
import {Post} from "../../entities/Post";
import {myContext} from "../types";

@Resolver()
export class PostsResolver {
    @Query(() => [Post])
    posts(
        @Ctx() {em}: myContext
    ): Promise<Post[]> {
        return em.find(Post, {})
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title", () => String) title: string,
        @Ctx() {em}: myContext
    ): Promise<Post | null> {
        const post = em.create(Post, {
            title,
            createdAt: "",
            updatedAt: ""
        })
        await em.persistAndFlush(post)
        return post;
    }

    @Mutation(() => Post, {nullable : true})
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String, {nullable : true}) title: string,
        @Ctx() {em}: myContext
    ): Promise<Post | null> {
        const post = await em.getRepository(Post).findOne({id})
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            post.title = title;
            await em.persistAndFlush(post)
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() {em}: myContext
    ): Promise<boolean> {
        try {
            await em.nativeDelete(Post, {id} );
        } catch {
            return false;
        }
        return true;
    }

}