import React from "react";
import { Field, Form, Formik } from 'formik';
import {Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Input, Link} from "@chakra-ui/react";
import {Wrapper} from "../components/Wrapper";
import {InputFiled} from "../components/InputFileds";
import {useLoginMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import NextLink from "next/link";


interface loginProps {

}

const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant={"small"}>
            <Formik
                initialValues={{usernameOrEmail: "", password: ""}}
                onSubmit={ async (values, {setErrors}) => {
                    const response = await login(
                        {
                            usernameOrEmail: values.usernameOrEmail, password: values.password
                        })
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if(response.data?.login.user) {
                        console.log('Hell', router.query.next)
                        if (typeof router.query.next === "string") {
                            console.log('here')
                            await router.push(router.query.next)
                        }
                        await router.push("/");
                    }
                }}
            >
                {(props) => (
                    <Form>
                        <Field name='name' validate={''}>
                            {({field, form}) => (
                                <InputFiled name={"usernameOrEmail"} placeholder={"usernameOrEmail"} label={'username or Email'} />
                            )}
                        </Field>
                        <Field name='password' validate={''}>
                            {({field, form}) => (
                                <InputFiled name={"password"} type={'password'} placeholder={"password"} label={'Password'} />
                            )}
                        </Field>
                        <Flex mt={4} ><NextLink href={"/forgot-password"} ><Link>Forgot my
                            password</Link></NextLink></Flex>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            isLoading={props.isSubmitting}
                            type='submit'
                        >
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Login)