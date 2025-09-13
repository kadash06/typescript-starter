### TypeScript Code to Programmatically Run Jest Tests and Verify Type Safety

Below is a clean, working TypeScript script that programmatically verifies TypeScript type errors are resolved (by compiling the code) and then runs Jest tests to ensure they pass successfully. This script uses the TypeScript Compiler API to check for compilation errors and Jest's programmatic runner to execute tests.

#### Prerequisites
- Install dependencies: `npm install typescript jest @types/jest ts-jest`
- Ensure you have a `tsconfig.json` for TypeScript compilation.
- Have some test files set up (e.g., in a `__tests__` directory or with `.test.ts` files).
- This script assumes you're running it from the root of a TypeScript project with Jest configured (e.g., via `jest.config.js` or `tsconfig.json`).

#### Key Components
- **Type Error Verification**: Uses TypeScript's compiler API to parse and compile your code, checking for type errors without emitting files.
- **Jest Test Execution**: Runs Jest programmatically if no type errors are found, then checks the test results.
- **Error Handling**: Logs issues if type errors exist or tests fail.

#### Script: `verifyAndRunTests.ts`
```typescript
import * as ts from 'typescript';
import * as jest from 'jest';
import * as path from 'path';
import { promises as fs } from 'fs';

/**
 * Verifies TypeScript compilation for type errors.
 * @param tsconfigPath Path to tsconfig.json (default: './tsconfig.json')
 * @returns Promise<boolean> - true if no type errors, false otherwise.
 */
async function checkTypeErrors(tsconfigPath: string = './tsconfig.json'): Promise<boolean> {
  try {
    const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    if (config.error) {
      console.error('Error reading tsconfig.json:', config.error.messageText);
      return false;
    }

    const parsedConfig = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(tsconfigPath));
    if (parsedConfig.errors.length > 0) {
      console.error('Errors in tsconfig.json:', parsedConfig.errors.map(e => e.messageText).join('\n'));
      return false;
    }

    const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
    const diagnostics = ts.getPreEmitDiagnostics(program);

    if (diagnostics.length > 0) {
      console.error('TypeScript compilation errors:');
      diagnostics.forEach(diag => {
        const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
        if (diag.file) {
          const { line, character } = diag.file.getLineAndCharacterOfPosition(diag.start!);
          console.error(`${diag.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
          console.error(message);
        }
      });
      return false;
    }

    console.log('✅ No TypeScript type errors found.');
    return true;
  } catch (error) {
    console.error('Error checking type errors:', error);
    return false;
  }
}

/**
 * Runs Jest tests programmatically and checks if they pass.
 * @param jestConfigPath Path to Jest config (default: './jest.config.js')
 * @returns Promise<boolean> - true if tests pass, false otherwise.
 */
async function runJestTests(jestConfigPath: string = './jest.config.js'): Promise<boolean> {
  try {
    // Check if jest config exists
    await fs.access(jestConfigPath);

    // Run Jest programmatically
    const argv = ['--config', jestConfigPath, '--passWithNoTests'];
    const { results } = await jest.runCLI({ _: argv, $0: 'jest' }, [process.cwd()]);

    if (results.numFailedTestSuites > 0 || results.numFailedTests > 0) {
      console.error(`❌ Jest tests failed: ${results.numFailedTests} failed tests in ${results.numFailedTestSuites} suites.`);
      return false;
    }

    console.log(`✅ All Jest tests passed: ${results.numPassedTests} tests in ${results.numPassedTestSuites} suites.`);
    return true;
  } catch (error) {
    console.error('Error running Jest tests:', error);
    return false;
  }
}

/**
 * Main function to verify types and run tests.
 */
async function main() {
  console.log('🔍 Verifying TypeScript type errors...');
  const typesOk = await checkTypeErrors();

  if (!typesOk) {
    console.log('🚫 Aborting due to type errors.');
    process.exit(1);
  }

  console.log('🧪 Running Jest tests...');
  const testsOk = await runJestTests();

  if (testsOk) {
    console.log('🎉 Success: Type errors resolved and all tests passed!');
  } else {
    console.log('🚫 Tests failed.');
    process.exit(1);
  }
}

// Run the script
main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
```

#### Usage
1. Save the script as `verifyAndRunTests.ts` in your project root.
2. Compile and run it: `npx ts-node verifyAndRunTests.ts` (assuming `ts-node` is installed).
3. If type errors exist, it will log them and abort. If types are clean, it will run Jest and report test results.

#### Example Output
- If types are clean and tests pass:  
  ```
  🔍 Verifying TypeScript type errors...
  ✅ No TypeScript type errors found.
  🧪 Running Jest tests...
  ✅ All Jest tests passed: 5 tests in 2 suites.
  🎉 Success: Type errors resolved and all tests passed!
  ```
- If type errors exist: Logs specific errors and exits.
- If tests fail: Logs failure details and exits.

This code is self-contained, handles errors gracefully, and ensures the process only proceeds if type safety is verified. Adjust paths if your setup differs (e.g., custom `tsconfig.json` or Jest config locations). For a full project setup, add sample tests in `__tests__/example.test.ts` to test it.