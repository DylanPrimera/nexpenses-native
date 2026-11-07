# Auditoría nativa · Fase 12

## Estado

Implementación local verificada el 7 de noviembre de 2026, 12:02 America/Bogota. Las validaciones de dispositivo no se han ejecutado; no hay score visual, FPS, memoria ni aprobación de paridad inventados.

## Inventario

22 expresiones map de render en 16 archivos al inicio: 18 sustituidas, 4 expresiones de layout permitidas; guard AST sin infracciones. Incluye presupuesto (2), categorías, tipo de crédito, cuotas, grupos de créditos (2), gastos Dashboard, tipo de pago, grupos/filas de historial (2), filtros, recurrentes, exportación, tema, semanas/fechas de calendario (2) y selector genérico. Los seis grupos de skeletons, Novedades y Ajustes también usan raíces nativas aunque no tuvieran map de JSX.

Excepciones exactas: HistoryHeader/ViewToggle → VIEW_OPTIONS.map; Calendar/Header → WEEKDAYS.map; BottomNav → left.map y right.map. Ninguna colección de registros se exceptúa por tamaño. Maps sin JSX en caché, validación, IDs o export XML no son render.

## Severidad

P0: pérdida/filtración de datos o crash. P1: flujo esencial inaccesible, cola rota o carga perpetua. P2: contraste, recortes o foco. P3: diferencias cosméticas. Cierre manual exige cero P0/P1 y excepciones P2 aceptadas por Dylan; aprobación visual explícita.

| ID | Caso | Severidad | Estado |
|---|---|---|---|
| LIST-01 | Raíces nativas sin scroll vertical anidado, incluidas cuotas/calendario | P1 | Implementado; validar dispositivo |
| TOUR-01 | Targets budget/recent y adaptador FlatList | P1 | Implementado; validar dispositivo |
| OFF-01 | Categorías/Recurrentes/Deudas sin caché offline | P1 | Implementado; validar dispositivo |
| THEME-01 | Tema manual opuesto al sistema, splash y barras | P2 | Implementado; validar dispositivo |
| A11Y-01 | Foco/retorno y ocultación de fondo por capas | P1 | Implementado; TalkBack pendiente |
| A11Y-02 | Fuente grande, montos y controles | P2 | Implementado; medición real pendiente |
| COLOR-01 | Texto normal y estados pressed/alpha | P2 | Tokens implementados; capturas pendientes |
| MOTION-01 | Tour con reducción de movimiento | P2 | Implementado; validar dispositivo |

## Evidencia manual pendiente

- [ ] Emulador y Xiaomi: modelo, versión Android, resolución, escalas, modo de ejecución y hora America/Bogota.
- [ ] Capturas light/dark de seis pestañas, login/registro y formulario/selector de gasto con datos ficticios.
- [ ] Fuente normal/200% o máximo Xiaomi; montos completos y acciones alcanzables con teclado.
- [ ] TalkBack: entrada/retorno de foco, solo overlay superior, labels/errores y controles seleccionados.
- [ ] Back bloqueado en overlays; cierre visible y estado de formulario conservados.
- [ ] 1.000 gastos, 200 recurrentes, 100 categorías y préstamo largo con fixtures locales: filas montadas acotadas, filtro/paginación/refresh y Ver todas/Ver menos.
- [ ] Offline sin caché, crear → Pendiente → reconectar, matar/reabrir offline, 4xx y logout/cambio de cuenta.
- [ ] Tema manual/sistema y Reduce Motion con recarga JS.
- [ ] iOS y VoiceOver: pendiente explícito, no validado.

Guardar capturas localmente fuera de Git, sin datos financieros reales ni publicación automática. Nombres: android-{emulator|xiaomi}-{screen}-{light|dark}-{state}.png. Registrar aprobadas/ejecutadas y pendientes por separado; no otorgar un score sin medición. No se actualiza la Page de migración.

## Verificación automatizada ejecutada

Todos los comandos finales se ejecutaron desde la raíz RN con `EXPO_NO_DOTENV=1`:

| Comando | Resultado |
|---|---|
| `pnpm typecheck` | OK, TypeScript sin errores |
| `pnpm lint` | OK, cero errores y cero advertencias |
| `pnpm exec jest --runInBand` | 55 suites, 325 tests, todos pasan |
| `pnpm exec jest --runInBand --config src/shared/layout/__tests__/jest.polish.config.cjs` | 10 suites, 44 tests, todos pasan |

Total: 65 suites y 369 tests. Los tests y su config/setup están en carpetas `__tests__` confirmadas con `git check-ignore`; no se editó `.gitignore`. Los mocks de componentes limitan el alcance a JS/composición y sustituyen IO/nativo y features ajenas al escenario; no equivalen a una prueba de TalkBack o teclado físico.

Cobertura añadida: guard de loops de render; ventana de 1.000 gastos y opciones; filas loading; pantallas sin caché offline; dos secciones de créditos y amortización 8/todas/8; detalle recurrente tras retirar su fila; filtros/paginación online-offline-con pendientes; adaptación del tour y cleanup; selección/crear/limpiar y opciones/presets con Formik; alcance de exportación con IO falso; Novedades y dismiss idempotente; tema manual/sistema/fallo de storage y setter NativeWind inestable; raíz/barras sin remount del proveedor de queries; contraste efectivo HSL/alfa; stack, RAF, retorno/fallback y carrera entre overlays; Reduce Motion del tour. Las regresiones de cola/persistencia de fase 11 siguen incluidas en la suite base.

## Hallazgos y ajustes de implementación

- NativeWind devuelve un setter nuevo por render. La hidratación local usa `useEffectEvent` de React 19 para no repetir lecturas ni pisar la preferencia manual; regresión reproducida en rojo y corregida.
- Gorhom no propaga todas las props accesibles de View desde BottomSheetModal. El aislamiento se aplica a un host del portal completo mediante containerComponent estable; incluye contenido, footer y cerrar, sin remount al cambiar la capa superior.
- `#08754f` sobre tintas primary 15–20% puede caer por debajo de 4,5:1. Se conserva el verde de marca y se usa texto neutro en esos casos; se elimina opacidad de press donde rompía el contraste. Los tests calculan los HSL efectivos y componen alfa antes de la luminancia; esto no certifica WCAG completa.
- La rama estática de PageShell usa FlatList de header con KeyboardAvoidingView; AppSheet usa BottomSheetFlatList de header. Evita que opciones horizontales tengan un ScrollView de aplicación como ancestro. El comportamiento real de teclado/dynamic sizing requiere QA manual.
- Sin dependencias nuevas, sin cambios de lockfile ni código nativo. Recarga JS suficiente en el dev client de fase 11.
