import process from "process";

export const __prod__ = process.env.NODE_ENV === "production"
export const COOKIE_NAME = "redqNew"
export const FORGER_PASS_PREFIX = "forget-password:"
export const PostgreDbUserPassword = "0412";