import "reflect-metadata";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {UsersResolver} from "./resolvers/users";
import {PostsResolver} from "./resolvers/posts";
import {__prod__, COOKIE_NAME, PostgreDbUserPassword} from "../entities/constants";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import Redis from "ioredis";

import {DataSource} from "typeorm";
import {Post} from "../entities/Post";
import {User} from "../entities/User";
// import {sendEmail} from "./utils/sendEmails";

const main = async () => {
    // sendEmail('hello there')
    const app = express();
    const myDataSource = new DataSource({
        type: "postgres",
        database: "pgcryptos",
        username: "postgres",
        password: PostgreDbUserPassword,
        synchronize: true,
        logging: true,
        entities: [Post, User]
    })

    await myDataSource.initialize()

    app.set("trust proxy", 1);
    app.use(
        cors({
            origin: 'http://localhost:3001',
            // origin: 'https://studio.apollographql.com',
            credentials: true,
        })
    );

    const RedisStore = connectRedis(session);
    const redis = new Redis()

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                // sameSite: "lax", // csrf
                sameSite: "none", // csrf
                // secure: __prod__, // cookie only works in https
                secure: false, // cookie only works in https
            },
            saveUninitialized: false,
            secret: 'process.env.SESSION_SECRET',
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UsersResolver, PostsResolver],
            validate: false,

        }),
        context: ({req, res}) => ({ myDataSource, req, res, redis})
    })

    await apolloServer.start();
    apolloServer.applyMiddleware({
        // // to work with graqhl apollo
        // app, cors: {
        //     origin: 'https://studio.apollographql.com',
        //     credentials: true,
        // }
        app, cors: false
    })

    app.listen(3000, () => {
        console.log('server started on port 3000')
    })
};
main().catch(err => {
    console.error(err)
});
