import {EntityManager, Connection, IDatabaseDriver} from "@mikro-orm/core";
import { Request, Response } from "express";

export type myContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
    req: Request;
    res: Response,
    payload?: { userId: string };
}