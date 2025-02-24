import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:4000/api/api-spec",
  output: {
    lint: "eslint",
    path: "src/api-client",
  },
  plugins: ["@tanstack/react-query", "@hey-api/client-fetch"],
});
