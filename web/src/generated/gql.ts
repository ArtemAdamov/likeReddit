/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment UserRegular on User {\n  id\n  username\n}": types.UserRegularFragmentDoc,
    "query Me {\n  me {\n    ...UserRegular\n  }\n}": types.MeDocument,
    "query Post($id: Int!) {\n  post(id: $id) {\n    id\n    title\n    text\n    createdAt\n    textSnippet\n    creator {\n      id\n      username\n    }\n  }\n}": types.PostDocument,
    "query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    hasMore\n    posts {\n      id\n      title\n      text\n      createdAt\n      textSnippet\n      creator {\n        id\n        username\n      }\n    }\n  }\n}": types.PostsDocument,
    "mutation changePassword($token: String!, $newPassword: String!) {\n  changePassword(token: $token, newPassword: $newPassword) {\n    errors {\n      message\n      field\n    }\n    user {\n      ...UserRegular\n    }\n  }\n}": types.ChangePasswordDocument,
    "mutation createPost($input: PostInput!) {\n  createPost(input: $input) {\n    text\n    title\n    creatorId\n  }\n}": types.CreatePostDocument,
    "mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}": types.ForgotPasswordDocument,
    "mutation Login($usernameOrEmail: String!, $password: String!) {\n  login(usernameOrEmail: $usernameOrEmail, password: $password) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...UserRegular\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation Register($options: UsernamePasswordInput!) {\n  register(options: $options) {\n    errors {\n      message\n      field\n    }\n    user {\n      ...UserRegular\n    }\n  }\n}": types.RegisterDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment UserRegular on User {\n  id\n  username\n}"): (typeof documents)["fragment UserRegular on User {\n  id\n  username\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    ...UserRegular\n  }\n}"): (typeof documents)["query Me {\n  me {\n    ...UserRegular\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Post($id: Int!) {\n  post(id: $id) {\n    id\n    title\n    text\n    createdAt\n    textSnippet\n    creator {\n      id\n      username\n    }\n  }\n}"): (typeof documents)["query Post($id: Int!) {\n  post(id: $id) {\n    id\n    title\n    text\n    createdAt\n    textSnippet\n    creator {\n      id\n      username\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    hasMore\n    posts {\n      id\n      title\n      text\n      createdAt\n      textSnippet\n      creator {\n        id\n        username\n      }\n    }\n  }\n}"): (typeof documents)["query Posts($limit: Int!, $cursor: String) {\n  posts(limit: $limit, cursor: $cursor) {\n    hasMore\n    posts {\n      id\n      title\n      text\n      createdAt\n      textSnippet\n      creator {\n        id\n        username\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation changePassword($token: String!, $newPassword: String!) {\n  changePassword(token: $token, newPassword: $newPassword) {\n    errors {\n      message\n      field\n    }\n    user {\n      ...UserRegular\n    }\n  }\n}"): (typeof documents)["mutation changePassword($token: String!, $newPassword: String!) {\n  changePassword(token: $token, newPassword: $newPassword) {\n    errors {\n      message\n      field\n    }\n    user {\n      ...UserRegular\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation createPost($input: PostInput!) {\n  createPost(input: $input) {\n    text\n    title\n    creatorId\n  }\n}"): (typeof documents)["mutation createPost($input: PostInput!) {\n  createPost(input: $input) {\n    text\n    title\n    creatorId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}"): (typeof documents)["mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($usernameOrEmail: String!, $password: String!) {\n  login(usernameOrEmail: $usernameOrEmail, password: $password) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...UserRegular\n    }\n  }\n}"): (typeof documents)["mutation Login($usernameOrEmail: String!, $password: String!) {\n  login(usernameOrEmail: $usernameOrEmail, password: $password) {\n    errors {\n      field\n      message\n    }\n    user {\n      ...UserRegular\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout\n}"): (typeof documents)["mutation Logout {\n  logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($options: UsernamePasswordInput!) {\n  register(options: $options) {\n    errors {\n      message\n      field\n    }\n    user {\n      ...UserRegular\n    }\n  }\n}"): (typeof documents)["mutation Register($options: UsernamePasswordInput!) {\n  register(options: $options) {\n    errors {\n      message\n      field\n    }\n    user {\n      ...UserRegular\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;