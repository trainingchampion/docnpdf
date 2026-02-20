
# DocnPDF Studio


## Overview

**DocnPDF Studio** is a comprehensive PDF management dashboard with AI-powered document analysis, conversion, and organization tools. Built with React and TypeScript, it offers a modern, user-friendly interface for handling all your document needs.

---

## Features

- 📄 PDF and Office document conversion (Word, Excel, PowerPoint, Images)
- 🔍 AI-powered document analysis and summarization
- 📝 Editing, annotation, and markup tools
- 🔒 Security features: password protection, encryption, unlocking
- 🗂️ Organize, merge, split, and rotate PDFs
- 🖊️ E-signature and workflow management
- 🧑‍💼 Team collaboration and user roles
- 🌍 Translation and quiz generation
- ☁️ Cloud sync and recent files dashboard

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/trainingchampion/docnpdf.git
   cd docnpdf/docnpdf
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env.local` file in the root directory.
   - Add your Gemini API key:
     ```sh
     GEMINI_API_KEY=your-gemini-api-key-here
     ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```
5. **Open your browser:**
   - Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

---

## Project Structure

- `components/` — All React UI components
- `services/` — API and backend service logic
- `constants.tsx` — App-wide constants and tool definitions
- `types.ts` — TypeScript types and interfaces
- `App.tsx` — Main application entry point
- `index.tsx` — React DOM bootstrap
- `vite.config.ts` — Vite configuration

---

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for bug fixes, new features, or improvements.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please open an issue on GitHub.
