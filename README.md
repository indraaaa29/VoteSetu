# VoteSetu — Civic Information Assistant

## Project Description
A document-first civic assistant that helps users understand the Indian election process through structured documents and an intelligent chatbot interface.

## Features
* Document-based information system
* AI-powered chatbot for voter queries
* Real-time voice-to-text interaction
* Language support (English + Hindi)
* Structured and verified responses
* Clean, minimal, government-style UI

## Tech Stack
* Next.js (App Router)
* React.js
* TypeScript
* Google Gemini API
* Web Speech API (voice input)
* Custom context-based i18n system

## Project Structure
* `/app`: Next.js App Router pages and API routes (e.g. `/app/chat`, `/app/documents`, `/app/api`).
* `/components`: Reusable React components (UI elements like `Nav`, `ConstituencySearch`, `DocumentChecklist`).
* `/lib`: Core business logic, configuration, utilities, and React context providers (e.g. `LanguageContext`).
* `/styles`: Global stylesheets and CSS modules.
* `/public`: Static assets.

## Setup Instructions

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd "VoteSetu"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_api_key
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```

## Deployment
* **Recommended**: Vercel
* Add your `GOOGLE_API_KEY` to the environment variables in your Vercel dashboard.

## Screenshots / Demo
*(Add placeholders for UI screenshots: Home, Chat, Documents)*
* [Home Screen Screenshot Placeholder]
* [Chat Interface Screenshot Placeholder]
* [Documents View Screenshot Placeholder]

## Future Improvements
* Better AI reasoning layer
* Real-time civic data integration
* Advanced personalization
