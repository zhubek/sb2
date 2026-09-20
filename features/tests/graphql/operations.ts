export const attemptOperations = {
  list: "query ContentTestAttempts { contentTestAttempts }",
  save: "mutation SaveContentTestAttempt($input: JSON!) { saveContentTestAttempt(input: $input) }",
} as const;
