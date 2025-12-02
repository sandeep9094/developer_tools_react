# Developer Tools Hub

A comprehensive collection of client-side developer utilities built with React and TypeScript. All tools run entirely in your browser - no data is sent to any server, ensuring complete privacy and security.

## 🚀 Features

### JSON Tools
- **JSON Beautifier** - Format and prettify JSON data with syntax highlighting
- **JSON Data Generator** - Generate sample JSON data for testing
- **JSON Schema Validator** - Validate JSON against JSON Schema specifications

### Encoding & Decoding
- **Base32 Encode/Decode** - Encode and decode data using Base32 encoding
- **Base64 Encode/Decode** - Encode and decode data using Base64 encoding
- **JWT Token Encoder and Decoder** - Decode and inspect JWT tokens

### Text & Data Tools
- **Difference Checker** - Compare two texts and highlight differences
- **Regex Matcher** - Test and match regular expressions against text
- **Lorem Ipsum Generator** - Generate placeholder text for design and development
- **CLI Command Line Breaks** - Format long command-line commands with proper line breaks

### Security & Cryptography
- **Hash Generator** - Generate various hash values (MD5, SHA-1, SHA-256, SHA-512, etc.)
- **Password Generator** - Generate secure passwords and IDs

### Utilities
- **UUID Generator** - Generate ULID and UUID identifiers
- **QR Generator** - Generate QR codes from text or URLs
- **Color Picker** - Pick colors and get their hex, RGB, and HSL values

## 🛠️ Technologies Used

### Core Framework
- **React 19.2.0** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite 7.2.4** - Fast build tool and development server

### Styling
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **@tailwindcss/vite** - Tailwind CSS integration for Vite

### Key Dependencies
- **ajv** - JSON Schema validator
- **base32 / base32.js** - Base32 encoding/decoding
- **base64-js** - Base64 encoding/decoding
- **buffer** - Node.js Buffer polyfill for browser
- **diff** - Text difference computation
- **lorem-ipsum** - Lorem Ipsum text generation
- **nanoid** - Unique ID generation
- **qrcode.react** - QR code generation
- **ulid** - ULID generation
- **uuid** - UUID generation

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **@vitejs/plugin-react** - React plugin for Vite

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd developer_tools
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

## 🏗️ Build

To build for production:

```bash
npm run build
```

The production build will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## 🧪 Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## 🎨 Features

### Dark Mode
The application supports both light and dark themes with automatic system preference detection. Your theme preference is saved in localStorage.

### Client-Side Processing
All tools process data entirely in your browser. No data is ever sent to external servers, ensuring:
- **Privacy** - Your data never leaves your device
- **Security** - No risk of data interception
- **Speed** - Instant processing without network latency
- **Offline Support** - Works without an internet connection (after initial load)

### Modern UI/UX
- Clean, intuitive interface
- Responsive sidebar navigation
- Smooth transitions and animations
- Accessible design

## 📁 Project Structure

```
developer_tools/
├── src/
│   ├── components/          # React components for each tool
│   │   ├── Base32Encoding.tsx
│   │   ├── Base64Encoding.tsx
│   │   ├── CliCommandBreaks.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── DiffChecker.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HashingTool.tsx
│   │   ├── IdAndPasswordTool.tsx
│   │   ├── JsonBeautifier.tsx
│   │   ├── JsonDataGenerator.tsx
│   │   ├── JsonSchemaValidator.tsx
│   │   ├── JwtDecoder.tsx
│   │   ├── LoremIpsumGenerator.tsx
│   │   ├── MainScreen.tsx
│   │   ├── QrGenerator.tsx
│   │   ├── RegexMatcher.tsx
│   │   ├── Sidebar.tsx
│   │   └── UlidUuidGenerator.tsx
│   ├── types/               # TypeScript type definitions
│   │   ├── base32-js.d.ts
│   │   └── tools.ts
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is private and not licensed for public use.

## 🙏 Acknowledgments

Built with modern web technologies to provide developers with essential tools in one convenient location.

---

**Note**: This is a client-side application. All processing happens in your browser, ensuring your data remains private and secure.
