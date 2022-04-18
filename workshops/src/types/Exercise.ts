export interface Exercise {
  id: string;
  sequenceNumber: number;
  title: string;
  titlePl?: string;
  category: string;
  categoryPl?: string;
  timeMinutes: number;
  description: string;
  descriptionPl: string;
  hint?: string;
  hintPl?: string;
  solution?: string;
  solutionExplanation?: string;
  solutionExplanationPl?: string;
  testFilter?: string; // dotnet test --filter value (e.g., "FullyQualifiedName~Exercise1")
  relatedFiles?: string[];
  externalLink?: string; // Link to external resource (e.g., Miro board)
  externalLinkLabel?: string;
  externalLinkLabelPl?: string;
}

export interface DotnetTestResult {
  name: string;
  passed: boolean;
  message: string;
}

export interface TestRunResult {
  passed: boolean;
  exitCode: number;
  output: string;
  testResults: DotnetTestResult[];
  error?: string;
}
