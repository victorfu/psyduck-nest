export function getPackageVersion() {
  const pkg = require("../package.json") as { version: string };
  return pkg.version;
}
