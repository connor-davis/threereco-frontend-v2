// put this on your scripts folder
// invoke directly with node or add to package.json > scripts
import generator from "@proerd/swagger-ts-template";

async function run() {
  const apiDef = await fetch("http://localhost:4000/api/api-spec").then((r) =>
    r.json()
  );

  await generator.genPaths(apiDef, {
    output: "../src/common/api/swagger",
    moduleStyle: "esm",
  });

  console.log("okay");
}

run();
