import { Redis } from "@upstash/redis";
import "dotenv/config";

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
	throw new Error("UPSTASH_REDIS_REST_TOKEN is not defined");
}

if (!process.env.UPSTASH_REDIS_REST_URL) {
	throw new Error("UPSTASH_REDIS_REST_URL is not defined");
}

export const client = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL,
	token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
