import dotenv from "dotenv";

dotenv.config({ path: ".env" })
//test

export const GOOGLEAPIKEY = process.env.GOOGLEAPIKEY
export const PYTHONSERVER = process.env.PYTHONSERVER
export const BASEURL = process.env.BASEURL!
export const DRONEURL = process.env.DRONEURL!
export const PATHURL = process.env.PATHURL!