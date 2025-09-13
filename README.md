# PhishAware - Educational Phishing Awareness Platform

⚠️ **FOR EDUCATIONAL USE ONLY** - This platform is designed exclusively for cybersecurity awareness training and must not be used for real phishing attacks.

## Overview

PhishAware is a comprehensive educational platform for phishing awareness training and simulation campaigns. Built with React, TypeScript, and Tailwind CSS, it provides organizations and educational institutions with tools to improve cybersecurity awareness through ethical simulation training.

## Features

### 🎯 Interactive Phishing Test
- **10-Question Quiz** - Sequential email scenarios testing phishing detection skills
- **Real-time Feedback** - Immediate explanations for each answer with learning points  
- **Progress Tracking** - Visual progress indicators with color-coded results
- **Detailed Results** - Comprehensive score breakdown and question review
- **Keyboard Shortcuts** - Press 'F' for Phishing, 'L' for Legitimate for faster testing
- **Mobile Responsive** - Optimized for all devices with touch-friendly interface
- **Accessibility** - Full keyboard navigation and screen reader support
- **No Data Collection** - Results stored locally only, no external tracking

### Public Pages
- **Landing Page** - Hero section with platform overview
- **How It Works** - 3-step process explanation
- **Features** - Comprehensive feature breakdown
- **Interactive Demo** - Safe simulation experience
- **Phishing Test** - 10-question interactive quiz with immediate feedback
- **Pricing** - Transparent pricing plans
- **Resources** - Knowledge base and training materials
- **Authentication** - Login/signup with mock authentication

### Dashboard (Protected Routes)
- **Campaign Management** - Create and manage phishing simulations
- **Real-time Analytics** - Comprehensive reporting and metrics
- **User Management** - Team and organization management
- **Detailed Reports** - Campaign performance analysis

### Design System
- **Modern UI** - Professional teal/orange color scheme
- **Responsive Design** - Mobile-first approach
- **Semantic Tokens** - Consistent design system
- **Accessible Components** - WCAG compliant interface

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Context + Hooks
- **Build Tool**: Vite
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <your-git-url>
cd phishaware

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Phishing Test

Access the interactive phishing awareness test at `/phishing-test`:

- **No Authentication Required** - Direct access for demo purposes
- **10 Realistic Email Scenarios** - Mix of legitimate and phishing attempts
- **Immediate Feedback** - Learn from each question with detailed explanations
- **Keyboard Shortcuts** - 'F' for Phishing, 'L' for Legitimate
- **Results Review** - Comprehensive breakdown of all answers

### Demo Accounts

For testing purposes, use these demo credentials:

- **Regular User**: any email/password combination
- **Admin Access**: Use email containing "admin" (e.g., admin@example.com)

## Development Commands

```bash
# Development server
npm run dev

# Type checking
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build for production
npm run build

# Deploy dist/ folder to Netlify
```

### Other Platforms
The application builds to static files in the `dist/` directory and can be deployed to any static hosting service.

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Navbar, Footer, Dashboard)
│   ├── quiz/            # Phishing test components
│   └── ui/              # shadcn/ui components
├── contexts/            # React contexts (Auth)
├── data/                # Mock data (emails.json)
├── hooks/               # Custom hooks
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   └── dashboard/       # Protected dashboard pages
├── types/               # TypeScript type definitions
├── assets/              # Images and static assets
└── lib/                 # Utilities and configurations
```

## Mock Data Structure

### Email Quiz Schema
```json
{
  "id": "number",
  "subject": "string",
  "sender": "string",
  "senderName": "string", 
  "to": "string",
  "timestamp": "string",
  "body": "string",
  "isPhish": "boolean",
  "explanation": "string",
  "hasAttachment": "boolean",
  "hasLink": "boolean"
}
```

### Quiz Result Schema
```json
{
  "score": "number",
  "totalQuestions": "number", 
  "percentage": "number",
  "classification": "string",
  "answers": "QuizAnswer[]",
  "completedAt": "Date"
}
```

### Campaign Schema
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "status": "draft|scheduled|active|completed",
  "template": "string",
  "recipients": "number",
  "startDate": "string",
  "endDate": "string",
  "stats": {
    "sent": "number",
    "opened": "number", 
    "clicked": "number",
    "reported": "number"
  }
}
```

### User Schema
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "admin|user",
  "organization": "string"
}
```

## Security & Ethics

### Educational Purpose
- Platform designed for awareness training only
- All simulations clearly marked as educational
- No real security risks or malicious content
- Comprehensive ethical use guidelines

### Data Protection
- Mock authentication system (no real data collection)
- Quiz results stored in memory only (not persisted)
- No external API calls in demo mode
- No tracking or analytics on quiz responses
- GDPR-compliant design patterns

### Ethical Guidelines
- Obtain explicit consent before conducting awareness training
- Clearly label all content as educational/demo material
- Never use for actual phishing or malicious purposes
- Respect local laws and organizational policies
- Provide opt-out mechanisms for participants

## Backend Integration Options

### Supabase Integration (Recommended)
To persist quiz results and add user accounts:

1. Click the green Supabase button in Lovable interface
2. Create tables for users, quiz_results, and quiz_answers
3. Add Row Level Security (RLS) policies
4. Update components to use Supabase client

### Firebase Alternative
```bash
npm install firebase
# Configure in src/lib/firebase.ts
# Update components to use Firebase Firestore
```

## Contributing

This is an educational demonstration project. For production use:

1. Implement real authentication system
2. Add backend API integration  
3. Include comprehensive testing suite
4. Add monitoring and analytics
5. Implement proper security measures
6. Add content management for quiz questions

## License

This project is for educational demonstration purposes. See terms of service for usage guidelines.

## Support

For questions about this demo or educational cybersecurity training:
- Email: support@phishaware.com
- Documentation: Available in the Resources section

---

**Remember**: This platform is for educational use only. Always ensure proper consent and clear communication when conducting any form of security awareness training.