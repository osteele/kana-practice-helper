# Contributing to Kana Homework Helper

Thank you for your interest in contributing to Kana Homework Helper! This document provides guidelines and information for contributors.

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/osteele/kana-practice-helper.git
   cd kana-practice-helper
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run lint` - Run ESLint
- `bun run test` - Run tests

## Project Structure

```
kana-practice-helper/
├── docs/               # Documentation files
├── src/               # Source code
│   ├── components/    # React components
│   ├── services/      # External service integrations
│   └── utils/         # Utility functions
├── public/            # Static assets
└── tests/             # Test files
```

## Technical Documentation

### Caching System

The app includes a caching system to reduce API calls and improve response times. See [docs/caching.md](docs/caching.md) for details on:
- How the cache works
- Disabling the cache
- Cache invalidation

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## Pull Request Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
   - Write meaningful commit messages
   - Add tests if applicable
   - Update documentation as needed
4. Run tests and linting
   ```bash
   bun run test
   bun run lint
   ```
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request with a clear title and description
   - Describe what changes were made
   - Reference any related issues
   - Include screenshots for UI changes

## Reporting Issues

When reporting issues, please include:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser and OS information

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
