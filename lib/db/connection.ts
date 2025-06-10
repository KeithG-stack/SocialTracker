// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";
export async function getData() {
    const sql = neon(process.env.DATABASE_URL ||"postgresql://SocialTrack_owner:npg_E3u9fUoVqKLA@ep-silent-boat-a4myv38w-pooler.us-east-1.aws.neon.tech/better?sslmode=require"); 
    const data = await sql`SELECT * FROM users`;
    return data;
}