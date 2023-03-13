import {FormControl, FormErrorMessage, FormLabel, Input, InputProps, Textarea} from "@chakra-ui/react";
import React, {InputHTMLAttributes, } from "react";
import {useField} from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    name: string;
    label: string;
    textarea?: boolean
}
export const InputFiled: React.FC<InputFieldProps> = ({
    label,
    textarea,
    size:_,
    ...props
}) => {

    const [field, {error}] = useField(props);
    return (
    <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
        { textarea ? <Textarea {...field} {...props} id={field.name}/> : <Input {...field} {...props} id={field.name}/>}
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
    </FormControl>
    )
}
