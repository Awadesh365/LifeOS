# CityOS Frontend

Modern, scalable React application for CityOS built with **enterprise-grade architecture**.

## 🎯 Architecture Highlights

- **Framework**: React 18 + TypeScript + Vite
- **Structure**: Feature-based + Atomic Design
- **State**: Zustand (global) + React Query (server) + React Hook Form (forms)
- **Styling**: CSS Modules with design tokens
- **Testing**: Vitest + React Testing Library + Playwright

## 📁 Project Structure

```
src/
├── components/     # Reusable UI (Atomic Design)
├── features/       # Domain modules (auth, users, billing)
├── pages/          # Route pages
├── layouts/        # Page layouts
├── hooks/          # Custom hooks
├── store/          # Global state (Zustand)
├── services/       # API layer
├── utils/          # Helper functions
├── types/          # TypeScript types
└── config/         # Configuration
```

See [STRUCTURE.md](./STRUCTURE.md) for complete folder organization.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

## 🛠 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |
| `npm run storybook` | Start Storybook |

## 📚 Documentation

- [**Codebase Structure**](../standards/frontend/CODEBASE_STRUCTURE.md) - Complete folder organization
- [**Component Architecture**](../standards/frontend/COMPONENT_ARCHITECTURE.md) - How to build components
- [**State Management**](../standards/frontend/STATE_MANAGEMENT.md) - When to use which state solution
- [**Frontend Standards**](../standards/frontend/README.md) - Development standards

## 🏗️ Architecture Decisions

### Why Feature-Based?

Features are self-contained modules:
```
features/auth/
├── components/   # LoginForm, RegisterForm
├── hooks/        # useLogin, useAuth
├── services/     # auth.api.ts
├── store/        # authSlice.ts
└── index.ts      # Public API
```

**Benefits**:
- Easy to find related code
- Can assign entire features to teams
- Can extract to separate packages
- Clear boundaries

### Why CSS Modules?

- **Scoped styles** - No global conflicts
- **Type-safe** - TypeScript support
- **Performance** - Only load what's needed
- **Flexible** - Easy to override

### Why React Query?

- **Automatic caching** - Fetch once, use everywhere
- **Background updates** - Data stays fresh
- **Built-in loading/error** - Less boilerplate
- **Optimistic updates** - Better UX

## 🎨 Component Library

### Atoms (Basic)
- Button, Input, Icon, Badge, Avatar, Spinner

### Molecules (Composite)
- FormField, Card, SearchBar, Modal, Dropdown

### Organisms (Complex)
- Header, Sidebar, DataTable, UserProfile

## 🔧 Path Aliases

Import with clean paths:

```typescript
import { Button } from '@components/atoms/Button';
import { useAuth } from '@hooks/useAuth';
import { User } from '@types/models/User';
import { formatDate } from '@utils/formatters/date';
```

Configured in `tsconfig.json`.

## 🧪 Testing Strategy

### Unit Tests (Vitest)
```bash
npm test
```

Test component logic, hooks, utilities.

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

Test critical user flows.

### Coverage Target
- **Minimum**: 80%
- **Critical paths**: 100%

## 📦 Build Output

```bash
npm run build
```

Output in `dist/`:
- Minified JavaScript
- Optimized CSS
- Compressed images
- Source maps (optional)

## 🚢 Deployment

### Vercel/Netlify
```bash
# Automatically detected by Vite
npm run build
```

### Docker
```bash
docker build -t cityos-frontend .
docker run -p 80:80 cityos-frontend
```

## 🔐 Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_ANALYTICS_ID=your-analytics-id
```

Access in code:
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

## 🤝 Contributing

1. Follow the [Frontend Standards](../standards/frontend/README.md)
2. Write tests for new features
3. Run linter before committing
4. Create Storybook stories for components
5. Update documentation

## 📈 Performance

### Targets
- **FCP**: < 1.8s
- **TTI**: < 3.8s
- **Lighthouse**: > 90

### Optimization Techniques
- Code splitting (React.lazy)
- Image optimization (WebP)
- Bundle analysis
- Memoization (React.memo, useMemo)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

See [LICENSE](../LICENSE)

---

**Built with ❤️ for CityOS**
