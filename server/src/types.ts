import {EntityManager, Connection, IDatabaseDriver} from "@mikro-orm/core";
import { Request, Response } from "express";
import Redis from "ioredis";

declare module 'express-session' {
    interface SessionData {
        userId: number;
    }
}

export type myContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
    req: Request;
    res: Response,
    redis: Redis,
    payload?: { userId: string };
}
