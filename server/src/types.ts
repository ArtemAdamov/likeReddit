// import { Connection, IDatabaseDriver} from "@mikro-orm/core";
import { Request, Response } from "express";
import Redis from "ioredis";
import {DataSource} from "typeorm";
declare module 'express-session' {
    interface SessionData {
        userId: number;
    }
}

export type myContext = {
    // em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
    myDataSource: DataSource,
    req: Request;
    res: Response,
    redis: Redis,
    payload?: { userId: string };
}
