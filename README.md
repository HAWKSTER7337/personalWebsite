# Personal Website

A React-based personal website built with Vite and configured for development in a devcontainer.

## Getting Started

### Using DevContainer (Recommended)

1. Open this project in VS Code
2. When prompted, click "Reopen in Container" or use the Command Palette (`Cmd+Shift+P`) and select "Dev Containers: Reopen in Container"
3. Wait for the container to build and install dependencies
4. The development server will automatically start on port 3000

### Manual Setup

If you prefer to run locally:

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Features

- Vite for fast development and building
- React 18 with modern hooks
- CSS with dark/light mode support
- ESLint and Prettier for code quality
- DevContainer for consistent development environment
- Responsive design

## Project Structure

```
├── .devcontainer/     # DevContainer configuration
├── src/              # Source code
│   ├── App.jsx       # Main App component
│   ├── App.css       # App styles
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles
├── index.html        # HTML template
├── package.json      # Dependencies and scripts
└── vite.config.js    # Vite configuration
```
