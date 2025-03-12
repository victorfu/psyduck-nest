export function getPackageVersion() {
  const pkg = require("../package.json") as { version: string };
  return {
    version: pkg.version,
  };
}

export function filterUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as T;
}

export function trimObject<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ]),
  ) as T;
}

export function filterUndefinedAndTrim<T extends object>(obj: T): T {
  return trimObject(filterUndefined(obj));
}
