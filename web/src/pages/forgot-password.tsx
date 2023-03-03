import React, {useState} from 'react';
import {Field, Form, Formik} from "formik";
import {toErrorMap} from "../utils/toErrorMap";
import {InputFiled} from "../components/InputFileds";
import {Button, Flex, Link} from "@chakra-ui/react";
import NextLink from "next/link";
import {Wrapper} from "../components/Wrapper";
import {useRouter} from "next/router";
import {useChangePasswordMutation, useForgotPasswordMutation, useLoginMutation} from "../generated/graphql";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";

const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false);
    const [, forgotPassword] = useForgotPasswordMutation();
    return (
        <Wrapper variant={"small"}>
            <Formik
                initialValues={{email: ""}}
                onSubmit={ async (values) => {
                    await forgotPassword(
                        {
                            email: values.email
                        })
                    setComplete(true);
                }}
            >
                {({isSubmitting}) => complete ?
                    <Flex>If an account with that email exist, we sent you an email</Flex>
                    :(
                    <Form>
                        <Field name='email' validate={''}>
                            {() => (
                                <InputFiled name={"email"} placeholder={"email"} type={"email"} label={'Email'} />
                            )}
                        </Field>

                        <Button
                            mt={4}
                            colorScheme='teal'
                            isLoading={isSubmitting}
                            type='submit'
                        >
                            Forgot password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);