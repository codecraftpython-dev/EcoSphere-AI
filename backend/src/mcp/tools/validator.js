/**
 * Input Security Validation Tool
 * Exposes methods to validate and sanitize user inputs for sustainability analysis.
 */
export function validateInput(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    return {
      valid: false,
      error: "Input must be a non-empty string.",
      sanitizedInput: ""
    };
  }

  const trimmed = userInput.trim();

  // Length constraints
  if (trimmed.length < 10) {
    return {
      valid: false,
      error: "The problem description is too short. Please provide at least 10 characters detailing the environmental issue.",
      sanitizedInput: trimmed
    };
  }

  if (trimmed.length > 2000) {
    return {
      valid: false,
      error: "The problem description exceeds the maximum limit of 2000 characters.",
      sanitizedInput: trimmed.slice(0, 2000)
    };
  }

  // Security pattern matching for potential script/HTML injections
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const tagRegex = /<[^>]*>/g;
  const hasScript = scriptRegex.test(trimmed);
  const hasTags = tagRegex.test(trimmed);

  if (hasScript) {
    return {
      valid: false,
      error: "Security Alert: Input contains forbidden script tags.",
      sanitizedInput: ""
    };
  }

  // Sanitize by escaping simple HTML characters
  let sanitized = trimmed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

  return {
    valid: true,
    error: null,
    sanitizedInput: sanitized
  };
}

export default {
  validateInput
};
