import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import {Box, Flex, Heading} from "@chakra-ui/react";
import {useMeQuery, usePostQuery, usePostsQuery} from "../../generated/graphql";
import {useRouter} from "next/router";
import {Wrapper} from "../../components/Wrapper";
import {NavBar} from "../../components/NavBar";


const Post = ({}) => {
    const router = useRouter();
    const intId = typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
    const [{data, error, fetching}] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId
        }
    });
    if (fetching) {
        return (
            <Flex>
                <div>loading...</div>
            </Flex>
        );
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    if (!data?.post) {
        return (
            <Flex>
                <Box>could not find post</Box>
            </Flex>
        );
    }

    return (
        <Wrapper>
            <NavBar/>
            <Flex flexDirection={"column"}>
                <Heading mb={4} margin={"0 auto"}>{data.post.title}</Heading>
                <Box mb={4}>{data.post.text}</Box>
            </Flex>
        </Wrapper>

    );
};
export default withUrqlClient(createUrqlClient, {ssr: true})(Post)