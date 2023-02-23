import process from "process";

export const __prod__ = process.env.NODE_ENV === "production"
export const PostgreDbUserPassword = "0412";