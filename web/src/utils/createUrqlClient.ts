import {dedupExchange, Exchange, fetchExchange, ssrExchange} from "urql";
import {cacheExchange, Resolver} from "@urql/exchange-graphcache";
import {betterUpdateQuery} from "./betterUpdateQuery";
import {LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation} from "../generated/graphql";
import { pipe, tap} from 'wonka';
import Router from "next/router";
import { stringifyVariables } from '@urql/core';

export const errorExchange: Exchange = ({ forward }) => ops$ => {
    return pipe(
        forward(ops$),
        tap(result => {
            console.log('Error exchanged')
            if (result.error?.message.includes("not auth")) {
                Router.replace("/login")
            }
        })
    );
};

export const cursorPagination = (): Resolver => {

    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;
        const allFields = cache.inspectFields(entityKey);
        const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }
        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
        const isInTheCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string, "posts");
        info.partial = !isInTheCache;
        let hasMore = true;
        const results: string[] =[];
        fieldInfos.forEach((fi) => {
            const key = cache.resolve(entityKey, fi.fieldKey) as string;
            const data = cache.resolve(key, 'posts') as string[];
            const _hasMore = cache.resolve(key, 'hasMore');
            if (!_hasMore) {
                hasMore = _hasMore as boolean;
            }
            results.push(...data)
        })
        return {
            __typename: "PaginatedPosts",
            hasMore: hasMore,
            posts: results
        };
    };
};
export const createUrqlClient = (ssrExchange: any) => ({
    url: process.env.NEXT_PUBLIC_API_URL as string,
    exchanges: [dedupExchange, cacheExchange({
        keys: {
            PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
              posts: cursorPagination()
          }
        },
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
    }), errorExchange, ssrExchange, fetchExchange],
    fetchOptions: {
        credentials: "include" as const
    }
})