export const maxRegexPatternLength = 200;

const nestedQuantifierPattern =
  /\((?:\?:)?(?:[^()\\]|\\.)*(?:[+*?]|\{\d+,?\d*\})(?:[^()\\]|\\.)*\)(?:[+*?]|\{\d+,?\d*\})/;

const quantifiedAlternationPattern = /\((?:\?:)?([^()]*\|[^()]*)\)(?:[+*?]|\{\d+,?\d*\})/g;

const hasOverlappingAlternation = (pattern) => {
  let match;
  quantifiedAlternationPattern.lastIndex = 0;
  try {
    while ((match = quantifiedAlternationPattern.exec(pattern))) {
      const alternatives = match[1]
        .split("|")
        .map((item) => item.replace(/\\(.)/g, "$1"))
        .filter(Boolean);
      for (let index = 0; index < alternatives.length; index++) {
        for (let compare = index + 1; compare < alternatives.length; compare++) {
          const left = alternatives[index];
          const right = alternatives[compare];
          if (left.startsWith(right) || right.startsWith(left)) return true;
        }
      }
    }
  } finally {
    quantifiedAlternationPattern.lastIndex = 0;
  }
  return false;
};

export const unsafeRegexReason = (pattern) => {
  if (pattern.length > maxRegexPatternLength) {
    return `pattern is longer than ${maxRegexPatternLength} characters`;
  }
  if (hasOverlappingAlternation(pattern)) {
    return "pattern contains overlapping alternation";
  }
  if (nestedQuantifierPattern.test(pattern)) {
    return "pattern contains nested quantifiers";
  }
  return null;
};

export const assertSafeRegexPattern = (pattern, key = "pattern") => {
  const reason = unsafeRegexReason(pattern);
  if (reason) throw new Error(`${key} contains an unsafe regular expression: ${reason}`);
};

export const compileSafeRegex = (pattern, key = "pattern") => {
  assertSafeRegexPattern(pattern, key);
  return new RegExp(pattern);
};
