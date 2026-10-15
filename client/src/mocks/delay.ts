// Simulated network latency for mock-backed API functions
export const mockDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));
