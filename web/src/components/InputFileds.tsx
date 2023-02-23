import {FormControl, FormErrorMessage, FormLabel, Input, InputProps} from "@chakra-ui/react";
import React, {InputHTMLAttributes} from "react";
import {useField} from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;

}
export const InputFiled: React.FC<InputFieldProps> = ({
    label,
    size:_,
    ...props
}) => {
    const [field, {error}] = useField(props);
    return (
    <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
        <Input {...field} {...props} id={field.name}/>
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null }
    </FormControl>
    )
}
