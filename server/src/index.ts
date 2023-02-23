import {MikroORM} from "@mikro-orm/core";
import microOrmConfig from "./mikro-orm.config";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {UsersResolver} from "./resolvers/users";
import {PostsResolver} from "./resolvers/posts";
import {__prod__} from "../entities/constants";
import session from "express-session";
import connectRedis from "connect-redis";
// import cors from "cors";
import Redis from "ioredis";

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

    const RedisStore = connectRedis(session);
    const redisClient = new Redis()

    app.use(
        session({
            name: "redq",
            store: new RedisStore({
                client: redisClient,
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
