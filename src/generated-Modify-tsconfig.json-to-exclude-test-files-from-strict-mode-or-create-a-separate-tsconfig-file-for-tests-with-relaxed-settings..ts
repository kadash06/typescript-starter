### Option 1: Modify the Main `tsconfig.json` to Exclude Test Files

If your project already has a `tsconfig.json`, you can modify it to exclude test files (e.g., files in `src/**/*.test.ts` or `tests/` directories) from compilation entirely. This prevents them from being processed with strict mode, as they're not compiled at all. However, this approach doesn't relax settings for tests—it simply ignores them in the main config.

Here's an example of a modified `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["src/**/*.test.ts", "src/**/*.spec.ts", "tests/**/*", "node_modules"]
}
```

- **Explanation**: 
  - `strict: true` applies to all included files (e.g., `src/**/*`).
  - The `exclude` array lists patterns for test files, so they won't be compiled or checked with strict mode.
- **Usage**: Run `tsc` to compile only non-test files with strict mode. For tests, you'd need a separate config (see Option 2) or use a test runner like Jest that handles TypeScript separately.

### Option 2: Create a Separate `tsconfig.test.json` for Tests with Relaxed Settings

This is the recommended approach for excluding test files from strict mode while still compiling them with relaxed settings (e.g., `strict: false`). It uses TypeScript's config inheritance to extend the main config but override settings for tests.

First, ensure your main `tsconfig.json` is set up with strict mode (if not already):

```json
// tsconfig.json (main config)
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

Then, create a new file named `tsconfig.test.json` in the same directory:

```json
// tsconfig.test.json (for tests only)
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false,
    "noImplicitReturns": false,
    "outDir": "./dist-tests"
  },
  "include": ["src/**/*.test.ts", "src/**/*.spec.ts", "tests/**/*"],
  "exclude": ["src/**/*", "node_modules"]
}
```

- **Explanation**:
  - `extends: "./tsconfig.json"` inherits all settings from the main config.
  - Overrides `strict: false` and disables other strict-related options (e.g., `noImplicitAny`) for a more relaxed environment.
  - `include` specifies only test files, and `exclude` ensures non-test source files aren't compiled here.
  - `outDir: "./dist-tests"` separates test outputs to avoid conflicts.
- **Usage**:
  - Compile main code with strict mode: `tsc` (uses `tsconfig.json`).
  - Compile tests with relaxed settings: `tsc --project tsconfig.test.json`.
  - In your build scripts (e.g., in `package.json`), you can add commands like:
    ```json
    "scripts": {
      "build": "tsc",
      "build-tests": "tsc --project tsconfig.test.json"
    }
    ```
  - If using a test runner like Jest, configure it to use `tsconfig.test.json` for test files (e.g., in `jest.config.js`: `preset: 'ts-jest', globals: { 'ts-jest': { tsconfig: 'tsconfig.test.json' } }`).

This setup ensures test files are excluded from strict mode while keeping your main codebase strict. Test both configs with `tsc --noEmit` to check for errors without generating files. If you have a specific project structure or additional options, provide more details for further customization.