import {NavBar} from "../components/NavBar";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import {Wrapper} from "../components/Wrapper";
import Link from "next/link"


const Index = () => (
    <Wrapper>
      <NavBar/>
        <Link href={"create-post"}>Create post</Link>
    </Wrapper>
)

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
