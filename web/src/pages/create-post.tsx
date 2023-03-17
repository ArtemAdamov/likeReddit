// @flow
import React, {useEffect} from 'react';
import {Field, Form, Formik} from "formik";
import {toErrorMap} from "../utils/toErrorMap";
import {InputFiled} from "../components/InputFileds";
import {Button, Flex, Link} from "@chakra-ui/react";
import NextLink from "next/link";
import {Wrapper} from "../components/Wrapper";
import {withUrqlClient} from "next-urql";
import {createUrqlClient} from "../utils/createUrqlClient";
import {useCreatePostMutation, useMeQuery} from "../generated/graphql";
import {useRouter} from "next/router";
import {NavBar} from "../components/NavBar";

type Props = {

};
const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [{data, fetching}] = useMeQuery();
    useEffect(() => {
        if (!fetching && !data?.me) {
            router.replace("/login?next=" + router.pathname)
        }
    }, [fetching, data, router])
    const [, createPost] = useCreatePostMutation();
    return (
        <>
        <NavBar/>
        <Wrapper variant={"small"}>
            <Formik
                initialValues={{title: "", text: ""}}
                onSubmit={ async (values, {setErrors}) => {
                    const {error} = await createPost({input: values})
                    if (!error) {
                        await router.push("/");
                    }
                }}
            >
                {(props) => (
                    <Form>
                        <Field name='title' validate={''}>
                            {({field, form}) => (
                                <InputFiled name={"title"} placeholder={"title"} label={'title'} />
                            )}
                        </Field>
                        <Field name='text' validate={''}>
                            {({field, form}) => (
                                <InputFiled textarea name={"text"} type={'text'} placeholder={"text"} label={'text'} />
                            )}
                        </Field>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            isLoading={props.isSubmitting}
                            type='submit'
                        >
                            Create post
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
        </>
    );
};

export default withUrqlClient(createUrqlClient)(CreatePost)