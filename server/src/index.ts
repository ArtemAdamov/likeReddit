import {MikroORM} from "@mikro-orm/core";
import microOrmConfig from "./mikro-orm.config";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {UsersResolver} from "./resolvers/users";
import {PostsResolver} from "./resolvers/posts";
import {__prod__} from "../entities/constants";
import { verify } from "jsonwebtoken";
import {User} from "../entities/User";
import { sendRefreshToken } from "./auth/sendRefreshToken";
import { createAccessToken, createRefreshToken } from "./auth/auth";

// import cors from "cors";

const main = async () => {
    const orm = await MikroORM.init(microOrmConfig);
    await orm.getMigrator().up();
    const app = express();

    app.set("trust proxy", 1);
    // app.use(
    //     cors({
    //         // origin: 'http://localhost:3001',
    //         origin: 'https://studio.apollographql.com',
    //         credentials: true,
    //     })
    // );

    app.post("/refresh_token", async (req, res) => {
        const token = req.cookies.jid;
        if (!token) {
            return res.send({ ok: false, accessToken: "" });
        }

        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
        } catch (err) {
            console.log(err);
            return res.send({ ok: false, accessToken: "" });
        }

        // token is valid, and
        // we can send back an access token
        const user = await orm.em.fork().getRepository(User).findOne({id: payload.userId})

        if (!user) {
            return res.send({ ok: false, accessToken: "" });
        }

        sendRefreshToken(res, createRefreshToken(user));

        return res.send({ ok: true, accessToken: createAccessToken(user) });
    });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UsersResolver, PostsResolver],
            validate: false,

        }),
        context: ({req, res}) => ({em : orm.em.fork(), req, res})
    })

    await apolloServer.start();
    apolloServer.applyMiddleware({
        app, cors: {
            // origin: 'http://localhost:3001',
            origin: 'https://studio.apollographql.com',
            credentials: true,
        }
    })

    app.listen(3000, () => {
        console.log('server started on port 3000')
    })
};
main().catch(err => {
    console.error(err)
});
