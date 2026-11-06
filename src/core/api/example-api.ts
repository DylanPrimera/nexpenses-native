import axios from "axios";

/** Public JSONPlaceholder instance — no auth, safe for the demo feature. */
export const exampleApi = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});
