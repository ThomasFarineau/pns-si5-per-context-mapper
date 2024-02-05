import * as path from "path";
import * as fs from "fs";

import * as dotenv from "dotenv";


dotenv.config();

const envDevPath = path.resolve(process.cwd(), '.env.dev');

if (fs.existsSync(envDevPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envDevPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}
