import {dedupExchange, Exchange, fetchExchange, ssrExchange} from "urql";
import {cacheExchange} from "@urql/exchange-graphcache";
import {betterUpdateQuery} from "./betterUpdateQuery";
import {LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation} from "../generated/graphql";
import { pipe, tap } from 'wonka';
import Router from "next/router";

export const errorExchange: Exchange = ({ forward }) => ops$ => {
    return pipe(
        forward(ops$),
        tap(result => {
            if (result.error?.message.includes("not auth")) {
                Router.replace("/login")
            }
        })
    );
};
export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:3000/graphql',
    exchanges: [dedupExchange, cacheExchange({
        updates: {
            Mutation: {
                logout: (parent, args, cache, info) => {
                    betterUpdateQuery<LogoutMutation,MeQuery>(
                        cache,
                        {query: MeDocument},
                        parent,
                        () => ({
                            me: null
                        })
                    );
                },
                login: (parent, args, cache, info) => {
                    betterUpdateQuery<LoginMutation,MeQuery>(
                        cache,
                        {query: MeDocument},
                        parent,
                        (result,query) => {
                            if (result.login.errors) {
                                return query
                            } else {
                                return {
                                    me: result.login.user}
                            }
                        })
                },
                register: (parent, args, cache, info) => {
                    betterUpdateQuery<RegisterMutation,MeQuery>(
                        cache,
                        {query: MeDocument},
                        parent,
                        (result,query) => {
                            if (result.register.errors) {
                                return query
                            } else {
                                return {
                                    me: result.register.user}
                            }
                        })
                }
            }
        }
    }), ssrExchange, errorExchange, fetchExchange],
    fetchOptions: {
        credentials: "include" as const
    }
})