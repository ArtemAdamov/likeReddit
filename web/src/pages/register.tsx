import React from "react";
import { Field, Form, Formik } from 'formik';
import {Button, Container, FormControl, FormErrorMessage, FormLabel, Input} from "@chakra-ui/react";
import {Wrapper} from "../components/Wrapper";
import {InputFiled} from "../components/InputFileds";
import {useMutation} from "urql";
import {useRegisterMutation} from "../generated/graphql";
import {toErrorMap} from "../utils/toErrorMap";
import {useRouter} from "next/router";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";


interface registerProps {

}

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();
    return (
        <Wrapper variant={"small"}>
            <Formik
                initialValues={{email: "", username: "", password: ""}}
                onSubmit={ async (values, {setErrors}) => {
                    const response = await register(
                        {
                            "options": {
                                "email": values.email,
                                "username": values.username,
                                "password": values.password
                            }
                        })
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors));
                    } else if(response.data?.register.user) {
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
                        <Field name='email' validate={''}>
                            {({field, form}) => (
                                <InputFiled name={"email"} placeholder={"email"} label={'email'} />
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
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(Register)