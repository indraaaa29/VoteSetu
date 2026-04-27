# VoteSetu — Civic Information Assistant

A document-first civic assistant that helps users understand the Indian election process through structured documents and an intelligent chatbot interface.

![VoteSetu Banner](https://img.shields.io/badge/Status-Operational-green?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 🌟 Features

- **Document-Based Information System**: Structured guides on voting processes, eligibility, and required documentation.
- **AI-Powered Chatbot**: Real-time voter query resolution using Google Gemini API.
- **Voice Interaction**: Integrated Web Speech API for real-time voice-to-text transcription.
- **Multilingual Support**: Instant switching between English and Hindi for all UI elements and documents.
- **Verified Responses**: Hybrid intent-matching system ensures critical information is always sourced from official data.
- **Mobile-Responsive UI**: Clean, minimal, government-style design optimized for all devices.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Library**: React.js
- **Language**: TypeScript
- **AI Engine**: Google Gemini API
- **Voice**: Web Speech API
- **i18n**: Custom Structured Translation System

---

## 📁 Project Structure

```text
/app        - Application routes, pages, and API handlers
/components - Reusable React components (Nav, Checklist, etc.)
/lib        - Core logic, AI helpers, and context providers
/locales    - Translation files (en.json, hi.json)
/public     - Static assets and icons
/styles     - Global CSS and design tokens
```

---

## 🚀 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/indraaaa29/VoteSetu.git
cd VoteSetu
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_google_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📱 Screenshots

### Home Page
![Home Page Placeholder]

### Document Viewer
![Document Viewer Placeholder]

### AI Chatbot
![Chatbot Placeholder]

---

## 🛡️ Environment Safety

All sensitive keys are managed via environment variables. Ensure `.env.local` is added to your `.gitignore` before committing any changes.

---

## 🔮 Future Improvements

- **Real-Time Data**: Integration with official election APIs for live candidate and result data.
- **Advanced Reasoning**: Enhanced AI prompting for handling complex civic dilemmas.
- **Regional Support**: Expanding to support more Indian regional languages.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
