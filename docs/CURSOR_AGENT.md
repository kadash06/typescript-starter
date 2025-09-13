# TypeScript Starter

**TypeScript Starter** is a comprehensive project template and CLI tool designed to help developers quickly bootstrap new TypeScript projects with industry best practices and modern tooling.

## What This Repository Is

This repository serves dual purposes:

1. **CLI Tool**: A command-line interface that generates new TypeScript projects interactively
2. **Project Template**: A fully-featured starter template that demonstrates TypeScript best practices

## Key Features

- **Modern TypeScript**: Configured for ESNext features with both strict and flexible compiler options
- **Dual Build System**: Generates both CommonJS (`main`) and ES6 module (`module`) builds
- **Comprehensive Testing**: AVA test runner with NYC code coverage reporting
- **Code Quality**: ESLint with TypeScript support and Prettier for consistent formatting
- **Documentation**: TypeDoc for generating API documentation from TypeScript types
- **CI/CD Ready**: Pre-configured for CircleCI, Travis CI, and AppVeyor
- **Release Management**: Standard-version for automated changelog and versioning
- **Interactive CLI**: Guided project generation with sensible defaults

## Quick Start

```bash
npx typescript-starter
```

This launches an interactive CLI that helps you create a new TypeScript project with your preferred configuration.

## Project Structure

- `src/cli/` - CLI implementation for project generation
- `src/lib/` - Example library code demonstrating best practices
- `src/types/` - TypeScript type definitions
- `bin/` - Executable scripts
- `build/` - Compiled output (generated)

## Development

```bash
# Install dependencies
npm install

# Watch mode development
npm run watch:build  # Terminal 1
npm run watch:test   # Terminal 2

# Run tests
npm test

# Generate documentation
npm run doc

# Format and lint code
npm run fix
```

## Use Cases

Perfect for:
- Creating reusable TypeScript libraries
- Starting Node.js applications with TypeScript
- Setting up projects that need both browser and Node.js compatibility
- Teams wanting consistent TypeScript project structure and tooling

This starter emphasizes developer experience, code quality, and modern JavaScript ecosystem integration.