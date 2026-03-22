function validateInput(text) {
  if (!text || typeof text !== "string") {
    return "Input must be a non-empty string.";
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return "Input text cannot be empty.";
  }
  if (trimmed.length < 20) {
    return "Input text is too short to summarize (minimum 20 characters).";
  }
  if (trimmed.length > 10000) {
    return "Input text is too long (maximum 10,000 characters).";
  }
  return null; // null means valid
}

module.exports = { validateInput };