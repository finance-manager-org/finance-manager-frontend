# Finance Manager – Frontend

This repository contains the frontend application for the Finance Manager project, developed with **React**, **TypeScript**, **TailwindCSS**, and **Vite**.  
The frontend provides the user interface for authentication, transaction management, account tracking, reporting, and data visualization.

## Branching strategy (Git Flow)
- `main`: stable production-ready code
- `develop`: integration branch for upcoming features
- `feature/*`: branches for new features
- `release/*`: branches for release preparation
- `hotfix/*`: branches for urgent production fixes

## Tech stack
- React 18.3
- TypeScript
- TailwindCSS
- React Router DOM (routing)
- Radix UI (component library)
- Lucide React (icons)
- Sonner (toast notifications)
- Zod (validation schemas)
- Recharts (data visualization)
- Vite (build tool)

## Implemented Features

### Authentication System (HU10, HU11, HU12)
The application includes a complete authentication system with the following pages:

#### 1. Sign Up (`/signup`) - HU10
- Full registration form with real-time validation
- Required fields:
  - First Name (letters only, min 2 characters)
  - Last Name (letters only, min 2 characters)
  - Age (numeric, ≥ 13 years)
  - Email (RFC 5322 format)
  - Password (≥ 8 chars, uppercase, lowercase, number, special char)
  - Confirm Password (must match)
- Register button disabled until all validations pass
- Error messages with ARIA live regions for accessibility
- Success toast and redirect to login after registration

#### 2. Login (`/login`) - HU11
- Login form with real-time validation
- Required fields:
  - Email (RFC 5322 format)
  - Password
- "Forgot password?" link
- Login button disabled until validations pass
- Welcome message and redirect to dashboard after successful login
- Error handling for invalid credentials

#### 3. Forgot Password (`/forgot-password`) - HU12
- Single email field to request password reset
- Sends reset link valid for 1 hour
- Success message with instructions
- Option to resend to different email
- Generic response for security (doesn't reveal if email exists)

#### 4. Reset Password (`/reset?token=xyz`) - HU12
- Token validation on page load
- New password form with real-time validation
- Password requirements helper text
- Invalid/expired token error handling
- Success message and redirect to login after reset

#### 5. Dashboard (`/dashboard`) - Placeholder
- Welcome message after successful login
- Logout functionality
- Placeholder cards for future features
- Navigation to home page

## Available Routes

- `/` - Landing page with features and CTAs
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password recovery request
- `/reset?token=xyz` - Password reset form
- `/dashboard` - User dashboard (placeholder)

## Validation Rules

### Password
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*()_+-=[]{};':"\\|,.<>/?)

### Email
- RFC 5322 format validation
- Basic format: `user@domain.com`

### Age
- Numeric only
- Minimum 13 years
- Maximum 120 years

### Names
- Letters only (including accented characters: á, é, í, ó, ú, ñ, ü)
- Minimum 2 characters
- Spaces allowed

## Backend Integration (TODO)

The authentication pages are ready for backend integration. Update the following endpoints when available:

```typescript
// Signup
POST /api/auth/signup
Body: { firstName, lastName, age, email, password }
Response: { id, message }

// Login
POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, name, email } }

// Forgot Password
POST /api/auth/forgot-password
Body: { email }
Response: { message }

// Reset Password
POST /api/auth/reset-password
Body: { token, password }
Response: { message }

// Validate Reset Token
GET /api/auth/validate-reset-token?token=xyz
Response: { valid: boolean }
```

## Development

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for production
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components (buttons, cards, inputs, etc.)
│   ├── Benefits.tsx
│   ├── CTA.tsx
│   ├── Features.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── HowItWorks.tsx
├── lib/
│   └── validations.ts  # Validation helper functions
├── pages/
│   ├── Dashboard.tsx
│   ├── ForgotPassword.tsx
│   ├── Login.tsx
│   ├── ResetPassword.tsx
│   └── Signup.tsx
├── App.tsx        # Main app component with routing
├── main.tsx       # Application entry point
└── index.css      # Global styles
```

## DevOps focus
- Continuous Integration with GitHub Actions
- Continuous Deployment with Vercel/Render
- Monitoring with UptimeRobot/Healthchecks.io

## Accessibility

All forms include:
- ARIA labels for screen readers
- `aria-live` regions for error announcements
- `aria-invalid` for invalid fields
- `aria-describedby` linking fields to error messages
- Proper keyboard navigation
- Focus management

## Notes

- All authentication flows are currently mocked (no backend integration yet)
- Tokens are not yet persisted (localStorage or HttpOnly cookies)
- Protected routes are not yet implemented
- Form submissions simulate API calls with timeouts
- Success/error messages are shown via Sonner toast notifications
