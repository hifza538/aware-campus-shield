# PhishAware - Educational Phishing Awareness Platform

⚠️ **FOR EDUCATIONAL USE ONLY** - This platform is designed exclusively for cybersecurity awareness training and must not be used for real phishing attacks.

## Overview

PhishAware is a comprehensive educational platform for phishing awareness training and simulation campaigns. Built with React, TypeScript, and Tailwind CSS, it provides organizations and educational institutions with tools to improve cybersecurity awareness through ethical simulation training.

## Features

### Public Pages
- **Landing Page** - Hero section with platform overview
- **How It Works** - 3-step process explanation
- **Features** - Comprehensive feature breakdown
- **Interactive Demo** - Safe simulation experience
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
│   └── ui/              # shadcn/ui components
├── contexts/            # React contexts (Auth)
├── hooks/               # Custom hooks
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   └── dashboard/       # Protected dashboard pages
├── assets/              # Images and static assets
└── lib/                 # Utilities and configurations
```

## Mock Data Structure

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
- Local storage for demo purposes only
- No external API calls in demo mode
- GDPR-compliant design patterns

## Contributing

This is an educational demonstration project. For production use:

1. Implement real authentication system
2. Add backend API integration
3. Include comprehensive testing suite
4. Add monitoring and analytics
5. Implement proper security measures

## License

This project is for educational demonstration purposes. See terms of service for usage guidelines.

## Support

For questions about this demo or educational cybersecurity training:
- Email: support@phishaware.com
- Documentation: Available in the Resources section

---

**Remember**: This platform is for educational use only. Always ensure proper consent and clear communication when conducting any form of security awareness training.