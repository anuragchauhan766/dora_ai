import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti.import("./src/config/env/client");
jiti.import("./src/config/env/server");

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/project',
                destination: '/dashboard',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
