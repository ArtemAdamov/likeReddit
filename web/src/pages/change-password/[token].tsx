// @flow
import * as React from 'react';
import {NextPage} from 'next';
import {Field, Form, Formik} from "formik";
import {toErrorMap} from "../../utils/toErrorMap";
import {InputFiled} from "../../components/InputFileds";
import {Alert, AlertIcon, Button, Flex, Link} from "@chakra-ui/react";
import {Wrapper} from "../../components/Wrapper";
import {useChangePasswordMutation} from "../../generated/graphql";
import {useRouter} from "next/router";
import {useState} from "react";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../../utils/createUrqlClient";
import NextLink from "next/link";
const ChangePassword: NextPage<{token :string}> = ({token}) => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');
    return (
        <Wrapper variant={"small"}>
            <Formik
                initialValues={{newPassword: ""}}
                onSubmit={ async (values, {setErrors}) => {
                    const response = await changePassword({token: token, newPassword: values.newPassword})
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors);
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token)
                        }
                        setErrors(errorMap);
                    } else if(response.data?.changePassword.user) {
                        await router.push("/");
                    }
                }}
            >
                {(props) => (
                    <Form>
                        <Field name='newPassword' validate={''}>
                            {({field, form}) => (
                                <InputFiled name={"newPassword"} type={'password'} placeholder={"password"} label={'New password'} />
                            )}
                        </Field>
                        {tokenError ?
                            <Flex flexDirection={"column"}><Alert status='error' mt={4} h={"40px"} borderRadius={"5px"}>
                                <AlertIcon/>
                                {tokenError}
                            </Alert><NextLink href={"/forgot-password"}><Link>Forgot password again</Link></NextLink></Flex>
                            : null}
                        <Button
                            mt={4}
                            colorScheme='teal'
                            isLoading={props.isSubmitting}
                            type='submit'
                        >
                            change password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};
ChangePassword.getInitialProps = ({query}) => {
    return {
        token: query.token as string
    }
}
export default withUrqlClient(createUrqlClient)(ChangePassword);