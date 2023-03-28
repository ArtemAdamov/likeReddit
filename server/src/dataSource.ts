import {DataSource} from "typeorm";
import path from "path";
import {Post} from "../entities/Post";
import {User} from "../entities/User";
const myDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    // synchronize: true,
    logging: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [Post, User]
})
export default myDataSource;