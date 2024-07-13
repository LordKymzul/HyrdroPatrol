/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        GOOGLEAPIKEY: process.env.GOOGLEAPIKEY,
        PYTHONSERVER: process.env.PYTHONSERVER,
        BASEURL: process.env.BASEURL,
        DRONEURL: process.env.DRONEURL,
        DATABASE_URL: process.env.DATABASE_URL,
        PATHURL: process.env.PATHURL,
        WEATHERAPIKEY: process.env.WEATHERAPIKEY
    }
};

export default nextConfig;
