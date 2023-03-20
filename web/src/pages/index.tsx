import {NavBar} from "../components/NavBar";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import {Wrapper} from "../components/Wrapper";
import {usePostsQuery} from "../generated/graphql";
import {Box, Flex, Heading, Stack, Text, Link, Button} from "@chakra-ui/react";
import {useState} from "react";


const Index = () => {
    const [variables, setVariables] = useState({limit: 10, cursor: null});
    const [{data, fetching}] = usePostsQuery({
        variables
    })
    if (!fetching && !data) {
        return <div>Your query failed for some reason</div>
    }
    return (
        <Wrapper>
          <NavBar/>
            <Flex align={"center"}>
                <Heading>LikeReddit</Heading>
                <Link ml={"auto"}   href={"create-post"}>Create post</Link>
            </Flex>

            <br/>
            {!data && fetching? (
            <div>Loading..</div>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map((p) =>(
                        <Box p={5} key={p.id} shadow='md' borderWidth='1px'>
                            <Heading fontSize='xl'><Link href={"post/" + p.id}>{p.title}</Link></Heading>
                            <Text>posted by {p.creator.username}</Text>
                            <Text mt={4}>{p.textSnippet}</Text>
                        </Box>))
                    }
                </Stack>

            )
            }
            {data && data.posts.hasMore ? (<Button onClick={() => {
                setVariables({
                    limit: variables.limit,
                    cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                })
            }
                } isLoading={fetching} mt={5}>Load more</Button>)
                : null
            }
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
