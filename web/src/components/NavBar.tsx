import React, {useEffect, useState} from "react";
import {Box, Button, Flex, Link} from "@chakra-ui/react";
import {useLogoutMutation, useMeQuery} from "../generated/graphql";
import {isServer} from "../utils/isServer";

interface NavBarProps {

}
export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{ fetching: logoutFetching}, logout] = useLogoutMutation();
    const [isServer, setIsServer] = useState(true);
    useEffect(() => setIsServer(false), []);
    const [{data, fetching}] = useMeQuery({pause: isServer});
    let body = null;
    if (fetching) {
    } else if (!data?.me) {
        body = (
            <Box ml={'auto'}>
                <Link href={'/login'} color='white' mr={'2'}>Login</Link>
                <Link href={'/register'} color='white'>Register</Link>
            </Box>
        )
    } else {
        body = (
                <Flex ml={'auto'}>{
                    data.me.username}
                    <Button onClick={() => {logout({},{});}} isLoading={logoutFetching} ml={'1'} variant={"link"}>logout</Button>
                </Flex>
            )
    }
    return (
        <Flex bg='blue' p={'4'}>
            {body}
        </Flex>
    );
}