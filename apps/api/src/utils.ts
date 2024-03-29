export function getPackageVersion() {
  const pkg = require("../package.json") as { version: string };
  return {
    version: pkg.version,
  };
}
