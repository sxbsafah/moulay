import { ChargilyClient } from "@chargily/chargily-pay";


if (!process.env.CHARGILY_API_KEY) {
  throw new Error("CHARGILY_API_KEY is not defined in environment variables");
}

const client = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY,
  mode: "test",
});


export default client;