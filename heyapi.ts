export default {
  client: "@hey-api/client-fetch",
  input: "http://localhost:4000/api/api-spec",
  output: {
    lint: "eslint",
    path: "src/api-client",
  },
  plugins: ["@tanstack/react-query"],
};
