
import React from "react";
import {Box, Flex, Link} from "@chakra-ui/react";
interface NavBarProps {

}
export const NavBar: React.FC<NavBarProps> = ({}) => {
    return (
        <Flex bg='blue' p={'4'}>
            <Box ml={'auto'}>
                <Link href={'/login'} color='white' mr={'2'}>Login</Link>
                <Link href={'/register'} color='white'>Register</Link>
            </Box>
        </Flex>
    );
}