import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SCHEMA_URL = "https://app.dartai.com/api/v0/public/schema/";
const TOKEN = "dsa_7b01f2d4356279970db3ce3e798f9dfa01dc61f4cd119bbf6070beb47bcede8b";

async function inspect() {
    const response = await fetch(SCHEMA_URL, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
    });
    const text = await response.text();
    // Print from char 20000 onwards (guessing where components/schemas are)
    console.log(text.substring(20000, 35000));
}

inspect();
