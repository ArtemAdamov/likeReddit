import {
    Resolver,
    Query,
    Mutation,
    Arg,
    InputType,
    Field,
    Ctx,
    UseMiddleware,
    Int,
    FieldResolver,
    Root, ObjectType
} from "type-graphql"
import {Post} from "../../entities/Post";
import {myContext} from "../types";
import {isAuth} from "../middleware/isAuth";

// @ObjectType()
// class PostResponse {
//     @Field()
//     errors?: string
//     @Field(() => Post, {nullable:true} )
//     post?: Post
// }
@InputType()
class PostInput {
    @Field()
    title: string
    @Field()
    text: string
}
@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[]
    @Field()
    hasMore: boolean
}
@Resolver(Post)
export class PostsResolver {
    @FieldResolver(() => String)
    textSnippet(
        @Root() root: Post
    ) {
       return root.text.slice(0, 50);
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', ()=> String, {nullable: true}) cursor: string | null,
        @Ctx() {  myDataSource }: myContext
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const replacements: any[] = [realLimitPlusOne];

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const posts = await myDataSource.query(
            `
    select p.*,
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
      ) creator
    from post p
    inner join public.user u on u.id = p."creatorId"
    ${cursor ? `where p."createdAt" < $2` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
            replacements
        );
        // const qb = myDataSource
        //     .getRepository(Post)
        //     .createQueryBuilder("posts")
        //     .innerJoinAndSelect(
        //         "posts.creator",
        //         "user",
        //         'user.id = posts."creatorId"'
        //     )
        //     .orderBy('posts."createdAt"', "DESC")
        //     .take(realLimitPlusOne)
        // if (cursor) {
        //     qb.where('posts."createdAt" < :cursor', {
        //         cursor: new Date(parseInt(cursor))
        //     })
        // }
        // const posts = await qb.getMany()
        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === realLimitPlusOne
        };
    }
    @Query(() => Post)
    post(
        @Arg("id", () => Int) id: number,
    ): Promise<Post | null> {
        return Post.findOne({where: {id}, relations: ["creator"]});
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() {req}: myContext
    ): Promise<Post| undefined> {
        // if (input.title.length < 3) {
        //     return {
        //         errors: "title is too short"
        //     };
        // }
        return  Post.create({
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