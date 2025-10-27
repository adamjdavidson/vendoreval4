// Test just the TypeScript syntax without imports
type Test = {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  sourceType: 'brave' | 'exa';
  score?: number;
};

const testFunc = (vendorName: string, results: Test[]): string => {
  return `Testing ${vendorName} with ${results.length} results`;
};

console.log(testFunc('Test Vendor', []));
