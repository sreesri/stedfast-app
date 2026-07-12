# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start the dev server (opens Expo Go QR code)
npm start

# Start targeting a specific platform
npm run android
npm run ios

# EAS builds
eas build --platform android --profile preview      # APK for testing
eas build --platform android --profile development  # Dev client build
eas build --platform all --profile production       # App Store / Play Store
```

There are no lint or test scripts configured.

## Architecture

**Stedfast** is an Expo / React Native app for intermittent fasting and macro tracking. It talks to a REST backend at `https://stedfast-backend.onrender.com` (configured in `utils/config.ts`).

### Provider stack (App.tsx)

```
QueryClientProvider (TanStack Query)
  └── AuthProvider
        └── FastingProvider
              └── LimitProvider
                    └── RootNavigator
```

### Navigation flow (RootNavigator.tsx)

```
Not logged in          → AuthNavigator (Login / Signup)
Logged in, no config   → FastingNavigator (FastingConfigScreen → LimitConfigScreen)
Logged in, config done → MainNavigator (HomeTabs + modal stack)
```

`RootNavigator` gates routing on three async checks: `useAuth().isLoggedIn`, `useFastingContext().isFastingConfigDone`, and `useLimitContext().isLimitConfigDone`. All three must resolve before showing the main app.

### MainNavigator tabs

Home · Stats · My Foods (Food Library) · Settings

Modal stack screens pushed on top of the tabs: MealLogs, MealEdit, FoodEditor, FastingConfig, LimitConfig.

### Screen names

All screen name strings live in `utils/Constants.ts` → `SCREEN`. Navigation calls must use these constants, not raw strings. Route params are typed in `navigation/types.ts` → `RootStackParamList`.

### API layer (`utils/http.ts`)

A single axios instance with a `Bearer` token injected via `setAuthToken()`. The interceptor in `AuthContext` auto-calls `logout()` on 401/403. All API functions are exported from `http.ts` — screens and hooks import from there, not from axios directly.

Response shapes from the backend are inconsistent (arrays vs `{ data: [] }` vs `{ dishes: [] }` etc.), so `http.ts` contains normalizer helpers (`normalizeDishes`, `normalizeMeals`, `normalizeMealSelectionItems`) that handle all known shapes defensively.

### Data fetching pattern

TanStack Query is used for all server state. Query keys follow the pattern `["entityName", param]` (e.g., `["intakeSummary", today]`, `["activeSession"]`). Mutations call `queryClient.invalidateQueries` to refetch. Custom hooks in `hooks/` encapsulate query + mutation logic for screens.

### Auth & storage

- JWT stored in `expo-secure-store` under key `userToken`
- Token attached to all requests via `api.defaults.headers.common["Authorization"]`
- `AsyncStorage` used only for `userId`

### Colors

**Never use hardcoded colors.** Always import from `COLORS` in `utils/Constants.ts`. The palette: `background`, `primary`, `secondary`, `ascent`, `input`.

### Installing dependencies

Always ask before installing new packages and explain why the library is needed.
