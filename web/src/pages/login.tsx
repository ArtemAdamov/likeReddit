import React from "react";
import { Field, Form, Formik } from 'formik';
import {Button, Container, FormControl, FormErrorMessage, FormLabel, Input} from "@chakra-ui/react";
import {Wrapper} from "../components/Wrapper";
import {InputFiled} from "../components/InputFileds";
import {useMutation} from "urql";
import {useLoginMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";


interface loginProps {

}

const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant={"small"}>
            <Formik
                initialValues={{username: "", password: ""}}
                onSubmit={ async (values, {setErrors}) => {
                    const response = await login(
                        {
                            "options": {
                                "username": values.username,
                                "password": values.password
                            }
                        })
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if(response.data?.login.user) {
                        await router.push("/");
                    }
                }}
            >
                {(props) => (
                    <Form>
                        <Field name='name' validate={''}>
                            {({field, form}) => (
                                <InputFiled name={"username"} placeholder={"username"} label={'Username'} />
                            )}
                        </Field>
                        <Field name='password' validate={''}>
                            {({field, form}) => (
                                <InputFiled name={"password"} type={'password'} placeholder={"password"} label={'Password'} />
                            )}
                        </Field>

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

export default Login