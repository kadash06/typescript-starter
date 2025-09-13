```typescript
// update-jest-config.ts
// This script updates the Jest configuration to use tsconfig.test.json
// and runs the tests to verify type errors are resolved.

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const jestConfigPath = path.join(process.cwd(), 'jest.config.js');
const tsconfigTestPath = './tsconfig.test.json';

// Read the current Jest config
let jestConfig: string;
try {
  jestConfig = fs.readFileSync(jestConfigPath, 'utf-8');
} catch (error) {
  console.error('Error reading jest.config.js:', error);
  process.exit(1);
}

// Check if it's already configured
if (jestConfig.includes('tsconfig.test.json')) {
  console.log('Jest config already points to tsconfig.test.json. Skipping update.');
} else {
  // Assuming the config uses ts-jest, update the globals section
  const updatedConfig = jestConfig.replace(
    /globals:\s*{\s*'ts-jest':\s*{[^}]*}/,
    `globals: { 'ts-jest': { tsconfig: '${tsconfigTestPath}' } }`
  );

  if (updatedConfig === jestConfig) {
    console.error('Could not find or update ts-jest globals in jest.config.js. Please ensure ts-jest is configured.');
    process.exit(1);
  }

  // Write the updated config
  try {
    fs.writeFileSync(jestConfigPath, updatedConfig, 'utf-8');
    console.log('Updated jest.config.js to use tsconfig.test.json');
  } catch (error) {
    console.error('Error writing jest.config.js:', error);
    process.exit(1);
  }
}

// Run the tests
try {
  console.log('Running Jest tests...');
  const output = execSync('npx jest', { encoding: 'utf-8', stdio: 'inherit' });
  console.log('Tests completed successfully. Type errors should be resolved.');
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}
```

### Instructions
1. Save the above code as `update-jest-config.ts` in your project root.
2. Ensure you have TypeScript installed globally or in your project (e.g., via `npm install -g typescript` or as a dev dependency).
3. Compile and run the script:
   ```
   npx tsc update-jest-config.ts --target es2015 --module commonjs --outDir . && node update-jest-config.js
   ```
   Or, if you have a build setup, integrate it accordingly.
4. This assumes:
   - You have `jest.config.js` with a `globals` section for `ts-jest`.
   - `tsconfig.test.json` exists in your project root.
   - Jest and ts-jest are installed.
5. After running, check the console output for test results. If no errors, type issues are likely resolved. If tests fail, inspect the output for TypeScript errors.