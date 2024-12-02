# Kana Homework Helper

Kana Homework Helper is a web application that assists users in learning and practicing Japanese kana (hiragana and katakana). It allows users to upload images of their handwritten kana homework and receive instant feedback, follow-up exercises, and practice word suggestions.

## Features

- Upload images of handwritten kana homework
- Analyze uploaded images using OpenAI's Vision API
- Provide detailed feedback on writing
- Suggest follow-up exercises
- Generate practice words based on the characters used in the homework

## Technologies Used

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [Vite](https://vitejs.dev/) - Frontend build tool
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Next.js](https://nextjs.org/) - React framework for server-side rendering and API routes
- [OpenAI API](https://openai.com/api/) - For image analysis and feedback generation

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- An OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kana-practice-helper.git
   cd kana-practice-helper
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload Image**: Click the upload button or drag and drop an image of your handwritten kana homework
2. **Enter API Key**: On first use, enter your OpenAI API key when prompted
3. **View Feedback**: The app will analyze your handwriting and provide:
   - General feedback on your writing
   - Specific corrections for any miswritten characters
   - Example words and sentences using the characters in your homework
   - Practice suggestions and mnemonic devices

## Contributing

I welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to:
- Set up the development environment
- Run tests
- Submit pull requests
- Report issues

## License

Copyright © 2024 [Oliver Steele](https://github.com/osteele)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the Vision API
- The React and Vite communities for excellent tools and documentation
- All contributors who help improve this project
