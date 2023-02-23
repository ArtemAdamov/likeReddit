import {Post} from "../entities/Post";
import {__prod__, PostgreDbUserPassword} from "../entities/constants";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';
import {User} from "../entities/User";

export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        glob: '!(*.d).{js,ts}',
    },
    dbName: "pgcrypto",
    password: PostgreDbUserPassword,
    entities: [Post, User],
    debug: !__prod__,
    type: "postgresql"
} as Parameters<typeof MikroORM.init>[0];