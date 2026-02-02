# LinkAIIL Frontend - Complete Codebase Documentation

## 1. Project Overview

| Property          | Value                        |
| ----------------- | ---------------------------- |
| **Project Name**  | LinkAIIL                     |
| **Framework**     | Next.js 16.0.10 (App Router) |
| **React Version** | 19.2.0                       |
| **Language**      | TypeScript 5                 |
| **Version**       | 0.1.0 (Beta)                 |

### Purpose

This is the frontend for LinkAIIL, an AI agent creation and management platform that allows users to:

- Build, configure, deploy, and interact with AI agents
- Manage multiple AI agents with different configurations
- Monitor conversations across multiple channels
- Integrate with WhatsApp, Facebook, Telegram, Instagram, etc.
- Manage CRM customers and tasks

### Tech Stack

| Component          | Technology                  |
| ------------------ | --------------------------- |
| **Framework**      | Next.js 16 + React 19       |
| **Language**       | TypeScript 5                |
| **Styling**        | Tailwind CSS v4             |
| **Components**     | shadcn/ui + Radix UI        |
| **State**          | React Context + React Query |
| **Forms**          | React Hook Form + Zod       |
| **Authentication** | Firebase                    |
| **Animations**     | Framer Motion               |
| **Icons**          | Lucide, Huge Icons          |

---

## 2. Architecture

### Directory Structure

```
/src
├── app/                          # Next.js App Router (v16)
│   ├── (auth)/                  # Auth route group (login, signup, reset)
│   │   ├── login/
│   │   ├── create-account/
│   │   └── reset-password/
│   ├── (private)/               # Protected routes (requires authentication)
│   │   ├── dashboard/           # Analytics and metrics
│   │   ├── agents/              # Agent management
│   │   │   ├── dashboard/       # Agent details & configuration
│   │   │   └── train/           # Agent training interface
│   │   ├── conversations/       # (Placeholder - coming soon)
│   │   ├── inbox/               # Message inbox
│   │   ├── integrations/        # Channel integrations setup
│   │   ├── customers/           # CRM - Customer management
│   │   ├── files/               # File management
│   │   ├── actions/             # Workflow actions (N8N)
│   │   ├── profile/             # User profile settings
│   │   ├── insights-analytics/  # Advanced analytics
│   │   └── subcription/         # Subscription management
│   ├── get-started/             # Onboarding page
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global Tailwind styles
│
├── components/
│   ├── ui/                      # Base UI components (shadcn/ui)
│   ├── shared/                  # Reusable feature components
│   ├── container/               # Layout wrapper components
│   ├── dashboard/               # Dashboard-specific components
│   ├── agents/                  # Agent-specific components
│   ├── auth/                    # Authentication components
│   ├── landing/                 # Landing page sections
│   ├── ai-assistant/            # AI chatbot integration
│   ├── tour/                    # Product tour components
│   └── animations/              # Reusable animation components
│
├── providers/
│   ├── app-provider.tsx         # Root provider composition
│   ├── auth-provider.tsx        # Firebase auth context
│   ├── chat-provider.tsx        # Chat state context
│   ├── inbox-provider.tsx       # Inbox state context
│   └── theme-provider.tsx       # Dark/light theme context
│
├── hooks/
│   ├── api/                     # React Query hooks for API calls
│   │   ├── agent.ts
│   │   ├── conversation.ts
│   │   ├── message.ts
│   │   ├── customer.ts
│   │   ├── chatwoot/
│   │   └── crm/
│   └── custom/
│       ├── use-firebase.ts      # Firebase operations
│       ├── use-chat-socket.ts   # WebSocket chat
│       ├── use-mobile.ts        # Mobile detection
│       └── use-tour.ts          # Product tour state
│
├── services/
│   └── firebase.ts              # Firebase initialization & config
│
├── lib/
│   ├── api.ts                   # Axios instance with interceptors
│   ├── query-client.ts          # React Query configuration
│   ├── oauth.ts                 # OAuth utilities
│   └── utils.ts                 # Utility functions
│
├── types/                       # TypeScript type definitions
├── constants/                   # Configuration constants
└── assets/                      # Icons and images
```

### Design Patterns

1. **Provider Pattern**: Context providers for auth, chat, inbox, and theme
2. **Custom Hooks Pattern**: Extensive use of custom hooks for Firebase, API calls, and UI state
3. **React Query Pattern**: Centralized data fetching and caching
4. **Route Groups**: Protected `(private)` and public `(auth)` route organization
5. **Component Composition**: Reusable UI components built on Radix UI primitives

---

## 3. Pages & Routes

### Public Routes (No Authentication)

| Route             | Purpose                          |
| ----------------- | -------------------------------- |
| `/`               | Landing page with hero, features |
| `/login`          | Email/password & OAuth sign-in   |
| `/create-account` | Email/password registration      |
| `/reset-password` | Password recovery flow           |
| `/get-started`    | Onboarding for new users         |

### Protected Routes (Authentication Required)

| Route                     | Purpose                            | Status          |
| ------------------------- | ---------------------------------- | --------------- |
| `/dashboard`              | Analytics & metrics overview       | Active          |
| `/agents`                 | Agent management grid (CRUD)       | Active          |
| `/agents/dashboard/[_id]` | Individual agent details & config  | Active          |
| `/agents/train/[_id]`     | Agent training interface           | Active          |
| `/conversations`          | Message conversations              | **Coming Soon** |
| `/inbox`                  | Unified message inbox              | Active          |
| `/integrations`           | Channel setup (WhatsApp, FB, etc.) | Active          |
| `/customers`              | CRM - customer management          | Active          |
| `/customers/[_id]`        | Individual customer details        | Active          |
| `/files`                  | File management & uploads          | Active          |
| `/actions`                | Workflow/automation actions        | Active          |
| `/profile`                | User settings & account            | Active          |
| `/insights-analytics`     | Advanced analytics                 | Active          |
| `/subcription`            | Subscription management            | Active          |

### Route Protection

- **Layout Guard**: `/app/(private)/layout.tsx` checks `session.user`
- **Redirect**: Non-authenticated users -> `/login`
- **Anonymous Support**: Special handling for anonymous/guest users

---

## 4. Components

### UI Component Library (shadcn/ui)

| Component                                       | Purpose                       |
| ----------------------------------------------- | ----------------------------- |
| `button.tsx`                                    | Reusable button with variants |
| `input.tsx`                                     | Form input with styling       |
| `dialog.tsx`                                    | Modal/dialog wrapper          |
| `form.tsx`                                      | React Hook Form integration   |
| `avatar.tsx`                                    | User avatar with fallback     |
| `checkbox.tsx`, `radio-group.tsx`, `select.tsx` | Form inputs                   |
| `slider.tsx`                                    | Range slider                  |
| `switch.tsx`                                    | Toggle switch                 |
| `tabs.tsx`                                      | Tab navigation                |
| `tooltip.tsx`                                   | Hover tooltips                |
| `popover.tsx`                                   | Floating popover              |
| `sidebar.tsx`                                   | Navigation sidebar            |
| `table.tsx`                                     | Data table with sorting       |
| `chart.tsx`                                     | Chart wrapper                 |
| `3d-card.tsx`                                   | 3D perspective card effect    |
| `stepper.tsx`                                   | Multi-step form stepper       |
| `loading.tsx`                                   | Loading spinner/skeleton      |

### Feature Components

**Shared/Reusable**:

- `agent-card.tsx` - Agent list item card
- `agent-creation-modal.tsx` - Modal for creating new agents
- `pagination.tsx` - Pagination controls

**Dashboard**:

- `ecommerce-matrics.tsx` - KPI metric cards
- `monthly-sales-chat.tsx` - Sales trend chart
- `recent-chat.tsx` - Recent conversation list

**Layout**:

- `app-sidebar.tsx` - Main navigation sidebar
- `app-header.tsx` - Top header bar
- `landing-header.tsx` - Landing page header

---

## 5. State Management

### Context Providers

#### AuthProvider

```typescript
type AuthContextType = {
  session: {
    user: TLoginResponse | null;
    token: string | null;
    loading: boolean;
  };
  refreshSession: (updatedUser: TLoginResponse) => void;
  fetchUserData: () => Promise<void>;
  signOut: () => Promise<void>;
};
```

#### ChatProvider

```typescript
type TChatContextType = {
  pendingUserMessage: TSubmitChatPayload | null;
  setPendingUserMessage: Dispatch<SetStateAction<TSubmitChatPayload | null>>;
};
```

#### InboxProvider

```typescript
type InboxContextType = {
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  openConversation: (id: string) => void;
};
```

### React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 3000,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## 6. API Integration

### Axios Instance

- Base URL from environment
- Auto-attaches Firebase ID token
- Request/Response interceptors for auth

### API Endpoints

**Authentication**:

- `GET /auth/login` - Fetch current user
- `POST /auth/sync` - Sync anonymous user
- `POST /auth/merge` - Merge accounts

**Agents**:

- `GET /agent` - List all agents
- `GET /agent/{id}` - Get agent details
- `POST /agent` - Create agent
- `PUT /agent/{id}` - Update agent
- `DELETE /agent/{id}` - Delete agent

**Conversations**:

- `GET /conversation/playground` - Get test conversation
- `GET /conversation/chatwoot/{id}` - Get Chatwoot conversation

**Chatwoot**:

- `GET /chatwoot/conversations` - List conversations
- `GET /chatwoot/conversations/{id}/messages` - Get messages

### React Query Hooks Pattern

```typescript
export const useGetAllAgents = (params, options) => {
  return useQuery({
    queryKey: ["useGetAllAgents", params],
    queryFn: () => getAllAgents(params),
    ...options,
  });
};

// Mutation example
export const useCreateAgent = (options) => {
  return useMutation({
    mutationKey: ["useCreateAgent"],
    mutationFn: createAgent,
    ...options,
  });
};
```

---

## 7. Authentication

### Supported Auth Types

1. **Anonymous/Guest** - No credentials required
2. **Email/Password** - Traditional signup/login
3. **Google OAuth** - Sign in with Google
4. **Microsoft** - Configured (not in UI)

### Firebase Hook Methods

```typescript
signInAnonymously(); // Creates temporary session
googleSignIn(); // OAuth with Google
emailPasswordSignUp(); // Email registration
emailPasswordSignIn(); // Email login
sendPasswordReset(); // Password recovery
confirmPasswordReset(); // Reset with code
```

### Session Persistence

- Uses Firebase's `browserLocalPersistence`
- Persists across browser restarts
- Anonymous sessions persist for guest access

---

## 8. Styling

### Tailwind CSS v4

- PostCSS with `@tailwindcss/postcss`
- Custom theme in CSS variables
- Light/dark mode support

### Design System

**Colors** (Light Mode):

```css
--background: hsl(210 50% 99%);
--foreground: hsl(215 25% 15%);
--primary: hsl(215 30% 20%);
--accent: hsl(211 100% 50%);
--destructive: hsl(0 84% 60%);
```

**Typography**:

- Primary: Inter (system font)
- Display: Outfit (Google Font)

### Animation Libraries

- **Framer Motion**: Complex animations
- **Tailwind Animations**: Built-in animations
- **Lenis**: Smooth scrolling

---

## 9. Key Dependencies

### Core

| Package    | Version | Purpose         |
| ---------- | ------- | --------------- |
| next       | 16.0.10 | React framework |
| react      | 19.2.0  | UI library      |
| typescript | ^5      | Type checking   |

### Data & State

| Package               | Purpose        |
| --------------------- | -------------- |
| @tanstack/react-query | Server state   |
| @tanstack/react-table | Data tables    |
| axios                 | HTTP client    |
| firebase              | Authentication |

### UI

| Package                  | Purpose             |
| ------------------------ | ------------------- |
| @radix-ui/\*             | Unstyled primitives |
| tailwindcss              | Utility CSS         |
| class-variance-authority | Variant API         |
| lucide-react             | Icons               |
| framer-motion            | Animations          |

### Forms

| Package             | Purpose         |
| ------------------- | --------------- |
| react-hook-form     | Form state      |
| zod                 | Validation      |
| @hookform/resolvers | Form validation |

### Charts

| Package    | Purpose            |
| ---------- | ------------------ |
| apexcharts | Interactive charts |
| recharts   | React charts       |
| cobe       | 3D globe           |

---

## 10. Configuration

### Environment Variables

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# API
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_APP_URL

# Meta/WhatsApp
NEXT_PUBLIC_META_APP_ID
NEXT_PUBLIC_META_WA_CONFIG_ID
NEXT_PUBLIC_WHATSAPP_APP_ID
NEXT_PUBLIC_WHATSAPP_CONFIGURATION_ID

# Chatwoot
NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN
NEXT_PUBLIC_CHATWOOT_BASE_URL
```

### Next.js Config

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    unoptimized: true,
  },
  devIndicators: false,
  reactStrictMode: false,
};
```

---

## 11. Key Features

### 1. Agent Management

- Create AI agents with custom configurations
- Configure behavior (tone, language, message length, emojis)
- Assign tools and channels
- Deploy with webhook URLs
- Monitor setup progress (5-step onboarding)

### 2. Dashboard & Analytics

- Conversation count metrics
- Total messages tracking
- Subscription renewal tracking
- Monthly costs overview
- Agent health status

### 3. Channel Integration

- WhatsApp (Meta Business API)
- Facebook Messenger
- Instagram
- Telegram
- Email
- Twitter/X

### 4. CRM (Customer Management)

- Customer listing with search
- Customer details and history
- Conversation tracking
- Segmentation and tagging

### 5. Real-time Features

- WebSocket chat connection
- Live message notifications
- SSE for agent updates
- Polling for status changes

### 6. Product Tour

- Step-by-step guided walkthrough
- Context-aware help dialogs
- Persistent completion state

---

## 12. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 App Router                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Public Routes          Protected Routes                    │
│  ├─ /login             ├─ /dashboard                        │
│  ├─ /signup            ├─ /agents (CRUD)                    │
│  ├─ /reset-password    ├─ /inbox (real-time)               │
│  └─ /                  ├─ /integrations                     │
│                        ├─ /customers (CRM)                  │
│                        └─ /profile                          │
└─────────────────────────────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐         ┌────▼────┐        ┌────▼────┐
    │Providers│         │Components│       │ Hooks   │
    │────────│         │──────────│       │────────│
    │AuthProv.│        │UI Lib    │       │API Hooks│
    │ChatProv │        │Features  │       │Custom   │
    │ThemeProv│        │Landing   │       │Firebase │
    └────────┘         └──────────┘       └────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                    ┌────────▼────────┐
                    │  React Query    │
                    │  State Cache    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
         ┌────▼────┐              ┌────────▼──┐
         │Firebase │              │Backend API│
         │Auth     │              │(Axios)    │
         └─────────┘              └───────────┘
```

---

## 13. Summary

| Aspect             | Technology                  |
| ------------------ | --------------------------- |
| **Framework**      | Next.js 16 + React 19       |
| **Language**       | TypeScript 5                |
| **Styling**        | Tailwind CSS v4             |
| **Components**     | shadcn/ui + Radix UI        |
| **State**          | React Context + React Query |
| **Authentication** | Firebase                    |
| **Animations**     | Framer Motion               |
| **Charts**         | ApexCharts, Recharts        |
| **Real-time**      | Socket.io + Lenis           |

This frontend provides a modern, responsive AI agent management platform with:

- Multi-channel communication support
- Real-time messaging capabilities
- Comprehensive CRM features
- Advanced analytics and dashboards
- Subscription management
- Dark/light theme support

---

_Generated: January 26, 2026_
