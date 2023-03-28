import React from "react";
import { Field, Form, Formik } from 'formik';
import {Button, Flex, Link} from "@chakra-ui/react";
import {Wrapper} from "../components/Wrapper";
import {InputFiled} from "../components/InputFileds";
import {useLoginMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import NextLink from "next/link";

const Login: React.FC = ({}) => {
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
                        if (typeof router.query.next === "string") {
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
                        <Flex mt={4} >
                            <Link href={"/forgot-password"}>Forgot my password</Link>
                        </Flex>
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
