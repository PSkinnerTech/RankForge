export const sourceFinding = ({ id, severity = "P1", message, evidence, recommendation, confidence = "high", details }) => ({
  id,
  severity,
  message,
  evidence,
  recommendation,
  confidence,
  ...(details ? { details } : {}),
});
