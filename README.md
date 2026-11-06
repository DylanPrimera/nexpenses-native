# nexpenses-native

App nativa **Nexpenses** (Expo SDK 58). Fuente de diseño/comportamiento: Next.js `nexpenses`. Solo **iOS y Android** (`com.nexpenses.rn`; no usar `…native` — `native` es palabra reservada en Java/Android). Scheme: `nexpenses`.

## Fase 0 (fundaciones)

- Tokens HSL en `src/global.css` + hex en `src/shared/theme/colors.ts`
- Axios + unwrap envelope Nest + hook 401 (`setUnauthorizedHandler`)
- Utils COP / budget-cycle / dates + Zod schemas + tests jest-expo
- Tabler icons + Figtree; splash/status `#eef2f0` / `#0f1416`
- `PRODUCT.md` + `DESIGN.md`

## Arranque

```bash
cp .env.example .env   # completa URLs (no commitear .env)
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm android           # o pnpm ios — no dejes el proceso colgado en CI/agente
```

## Env

```
EXPO_PUBLIC_STAGE=dev
EXPO_PUBLIC_API_URL=          # prod
EXPO_PUBLIC_API_URL_IOS=
EXPO_PUBLIC_API_URL_ANDROID=
```

## Scripts

`pnpm start` · `pnpm android` · `pnpm ios` · `pnpm lint` · `pnpm typecheck` · `pnpm test`

Sin script `web`. Sin `expo prebuild` desde el flujo habitual; APK en Android Studio.
