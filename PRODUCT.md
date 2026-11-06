# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Stack

Expo SDK 58 + React Native 0.88 + expo-router + NativeWind 4.2.7 (Tailwind 3.4) + TanStack Query + Zustand + Formik + Zod. Solo iOS y Android (sin web). Backend NestJS contracts frozen. Fuente de diseño/comportamiento: Next.js Nexpenses (Capacitor `com.nexpenses.app`); este repo es `com.nexpenses.rn` (evita `…native`: palabra reservada Java). Scheme deep link: `nexpenses`.

## Users

Personas en Colombia que quieren controlar gastos del ciclo de presupuesto (quincena/mes desde payday), en COP, con historial, categorías, recurrentes y deudas/créditos.

## Product Purpose

Registrar gastos del ciclo actual, ver progreso del presupuesto, historial por mes (America/Bogota), gestionar categorías y plantillas recurrentes, deudas (manual + PDF extract), ajustes (tema, wipe, export, email inbound). Online-first; offline en fase posterior.

## Positioning

Presupuesto por ciclo de payday (no solo mes calendario) + UX idéntica al web Nexpenses en nativo, coexistiendo con el APK Capacitor.

## Key workflows

1. Auth JWT (login/register; Google nativo más tarde).
2. Setup presupuesto + cycleStartedAt.
3. Crear/editar gastos del ciclo (PTR listas).
4. Historial por mes Bogotá; categorías; recurrentes.
5. Deudas completa (cuotas/cupo/PDF).
6. Ajustes: tema 3-way, wipe, export SAF/share, email inbound.
7. Tour + WhatsNew; luego Google; luego offline.

## Constraints

- Identificadores EN; copy UI ES (`messages/es.json`).
- Nest envelope `{success,data,message,error}`; 401 → logout + toast.
- No pantalla /migrate; no next-auth.
- Commits solo cuando Dylan lo pida; APK solo Android Studio.
- Inferred from migration plan + Next source — confirmed by Dylan approval of phase 0.

## Accessibility

Targets: touch targets ≥44pt, Dynamic Type where feasible, Reduce Motion respected in later phases, contrast from DESIGN.md tokens.
