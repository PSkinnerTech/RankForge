const requiredProperties = {
  Organization: ["name", "url"],
  Product: ["name", "offers"],
  FAQPage: ["mainEntity"],
  Article: ["headline", "datePublished", "author"],
  BreadcrumbList: ["itemListElement"],
  Event: ["name", "startDate", "location"],
  VideoObject: ["name", "thumbnailUrl", "uploadDate"],
  SoftwareApplication: ["name", "applicationCategory", "operatingSystem"],
};

const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const structuredDataTypeNames = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value.map(String) : [String(value)];
};

export const structuredDataNodes = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(structuredDataNodes);
  if (typeof value !== "object") return [];

  const nodes = [value];
  if (value["@graph"]) nodes.push(...structuredDataNodes(value["@graph"]));
  return nodes;
};

export const validateStructuredData = (structuredData = []) => {
  const issues = [];

  for (const [blockIndex, block] of structuredData.entries()) {
    if (!block?.data) continue;

    for (const [nodeIndex, node] of structuredDataNodes(block.data).entries()) {
      for (const type of structuredDataTypeNames(node["@type"])) {
        const required = requiredProperties[type];
        if (!required) continue;

        const missing = required.filter((property) => !hasValue(node[property]));
        if (missing.length) {
          issues.push({
            type,
            missing,
            blockIndex,
            nodeIndex,
          });
        }
      }
    }
  }

  return issues;
};
