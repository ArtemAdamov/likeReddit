import {NavBar} from "../components/NavBar";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import {Wrapper} from "../components/Wrapper";


const Index = () => (
    <Wrapper>
      <NavBar/>
      <div>Welcome</div>
    </Wrapper>
)

export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
