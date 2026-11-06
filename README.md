# nexpenses-native

Plantilla mínima de **React Native (Expo SDK 58)** basada en el comportamiento real de `products-app` (curso Fernando Herrera), adaptada a NativeWind 4 + Figtree + TanStack Query + Zustand.

## Stack

- Expo Router (typed routes) + `reactCompiler`
- NativeWind **4.2.7** + Tailwind 3.4
- TanStack Query 5 (`new QueryClient()` sin `defaultOptions`; `staleTime` por query)
- Zustand + `expo-secure-store` (sesión)
- Axios con `EXPO_PUBLIC_STAGE` + URLs por plataforma (como products-app)
- Formik (formularios de auth; sin Yup, igual que products)
- Tema claro/oscuro (NativeWind + AsyncStorage) + `StatusBar` + `SafeAreaProvider`
- Cámara / galería (`expo-camera`, `expo-image-picker`, `expo-media-library`)
- ESLint + Prettier (plugin Tailwind) + pnpm

## Estructura

```
src/
  app/                 # Rutas thin: (auth), (app)/(tabs), details, camera
  core/                # apiClient, exampleApi, env, SecureStore, queryClient
  features/
    auth/              # Formik + Alert, store, actions, mapper
    example/           # JSONPlaceholder infinite + pull-to-refresh
    camera/            # pantalla cámara + store de imágenes
  shared/              # Themed*, FAB, MenuIconButton, FullScreenLoader, theme
```

Reglas: `app` → `features`/`shared`/`core`; `features` → `core`/`shared` (nunca otra feature).

## Providers (root)

Orden como products-app:

`GestureHandlerRootView` → `SafeAreaProvider` → `QueryClientProvider` → `AppThemeProvider` → `StatusBar` → `Stack`.

## Auth

| Método | Path | Body |
|--------|------|------|
| POST | `/auth/login` | `{ email, password }` |
| POST | `/auth/register` | `{ fullName, email, password }` |
| GET | `/auth/check-status` | Bearer token |

Validación con Formik + `Alert` en español. `checkStatus` solo en `(app)/_layout`.

## Env

Copia `.env.example` → `.env` (no commits):

```
EXPO_PUBLIC_STAGE=dev
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_API_URL_IOS=
EXPO_PUBLIC_API_URL_ANDROID=
```

En `dev` se usa `_IOS` / `_ANDROID` según plataforma; en `prod`, `EXPO_PUBLIC_API_URL`.

## Demo example

Lista infinita + pull-to-refresh contra `https://jsonplaceholder.typicode.com/posts` (sin auth). Detalle con KAV + RefreshControl + safe-area padding.

## Cámara

Pestaña **Media** → FAB → pantalla modal (shutter, flip, galería, confirmar/rehacer, guarda en media-library). Store Zustand `useCameraStore`.

## Arranque

```bash
cp .env.example .env   # completa las URLs
pnpm install
pnpm start
```

Scripts: `pnpm lint`, `pnpm typecheck`, `pnpm android` / `pnpm ios` (`expo run:*` — no prebuild automático desde aquí).

## Renombrar

Cambia `name` / `slug` / `scheme` / `android.package` / `ios.bundleIdentifier` en `app.json` y `package.json`.
