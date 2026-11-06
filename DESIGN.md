---
name: Nexpenses Native
description: Design system ported from Next Nexpenses globals.css for Expo NativeWind.
colors:
  stitch-primary: "#4eedb8"
  stitch-secondary: "#10b981"
  stitch-tertiary: "#38bdf8"
  stitch-neutral: "#0f1416"
  background-light: "#eef2f0"
  background-dark: "#0f1416"
  foreground-light: "#0f1416"
  foreground-dark: "#dfe3e6"
  card-light: "#f4f7f5"
  card-dark: "#1b2022"
  popover-light: "#f8faf9"
  popover-dark: "#171c1e"
  primary-light: "#0d9668"
  primary-dark: "#4eedb8"
  primary-foreground-light: "#ffffff"
  primary-foreground-dark: "#0a0f11"
  secondary-light: "#e8f0ec"
  secondary-dark: "#262b2d"
  muted-light: "#e8eeec"
  muted-dark: "#262b2d"
  muted-foreground-light: "#5c6b63"
  muted-foreground-dark: "#bbcac1"
  accent-light: "#ecf3ef"
  accent-dark: "#303638"
  destructive-light: "#93000a"
  destructive-dark: "#ffb4ab"
  border-light: "#dce4e0"
  border-dark: "#303638"
  ring-light: "#0d9668"
  ring-dark: "#4eedb8"
typography:
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.25
rounded:
  base: "0.375rem"
  button-alert: "0.5rem"
  card: "0.875rem"
  modal: "1.125rem"
spacing:
  md: "16px"
  shell-max: "28rem"
components:
  button-primary:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.primary-foreground-light}"
    rounded: "{rounded.button-alert}"
  splash:
    backgroundColor: "{colors.background-light}"
---

## Overview

Nexpenses Native mirrors the Next.js Nexpenses visual system: soft green-gray surfaces, emerald primary in light and mint neon primary in dark, Figtree typography, and a bottom pill navigation (built in later phases). Tokens live as HSL CSS variables in `src/global.css` for NativeWind/RNR and as hex in `src/shared/theme/colors.ts` for StatusBar/Splash.

## Colors

Use semantic tokens (`background`, `foreground`, `primary`, `muted-foreground`, `destructive`, `border`) rather than raw stitch aliases in UI. Light splash/status: `#eef2f0`. Dark: `#0f1416`. Nav pill tokens documented in the migration Page.

## Typography

Figtree via `@expo-google-fonts/figtree` (`font-figtree-*` utilities). UI copy in Spanish.

## Layout

Content centered with max width ~28rem (max-w-md) even on tablet. Safe area insets + bottom nav clearance. Lists use pull-to-refresh.

## Elevation & Depth

Modals (phase 2): blur backdrop + elevated popover surface, `rounded-[1.125rem]`. Cards `rounded-[0.875rem]`. Motion 150–200ms ease `[0.22,1,0.36,1]`.

## Shapes

Radius base `0.375rem`. Alert/Confirm buttons `0.5rem`. Prefer soft rectangles over heavy skeuomorphism.

## Components

Phase 0 ships theme + Tabler `Icon` wrapper. Phase 1 adds React Native Reusables primitives (NativeWind registry). Overlays use `@gorhom/bottom-sheet` with GlobalModal look (not centered RNR Dialog).

## Do's and Don'ts

- Do keep hex↔HSL sync across `global.css`, `tailwind.config.js`, `theme.ts` / `colors.ts`.
- Do use Tabler icons; avoid Lucide unless a peer forces it.
- Don't target web (`react-native-web`) — iOS/Android only.
- Don't invent Nest endpoints; contracts are frozen.
