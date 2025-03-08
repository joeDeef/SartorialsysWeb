import fs from "fs";
import path from "path";
import YAML from "yaml";

const combineYamlFiles = (dir) => {
  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".yml"));
  const combinedSpec = { paths: {}, components: { schemas: {} } };

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const spec = YAML.parse(fileContent);

    Object.assign(combinedSpec.paths, spec.paths);

    combinedSpec.components.schemas = {
      ...combinedSpec.components.schemas,
      ...spec.components?.schemas,
    };
  });

  return combinedSpec;
};

export default combineYamlFiles;
