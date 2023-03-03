import {UsernamePasswordInput} from "./userInput";

export const validateUser = (options: UsernamePasswordInput) => {
    if (!options.email.includes('@')) {
        return [{
                field: "email",
                message: "email is invalid"
            }]
    }
    if (options.username.includes('@')) {
        return [{
            field: "username",
            message: "username cannot include @"
        }]

    }
    if (options.username.length < 2) {
        return [{
            field: "username",
            message: "username is too short"
        }]
    }
    return null
}