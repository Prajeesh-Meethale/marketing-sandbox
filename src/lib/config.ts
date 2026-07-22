export type ExecutionMode = "development" | "production";

// For cost reasons during the sandbox phase, we hardcode to development mode 
// so the Gemini API is used as the ONLY execution provider.
export const executionMode: ExecutionMode = "development";
