export const implementationTaskFor = (rule, owner, effort) => ({
  summary: rule.recommendation,
  owner,
  effort,
  acceptanceCriteria: [
    `The ${rule.id} finding is no longer triggered for the affected evidence.`,
    "Updated evidence remains crawlable, visible, and aligned with the cited guidance.",
  ],
});
