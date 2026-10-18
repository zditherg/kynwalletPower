# Implementation Plan: Pantalla Home (Dashboard Financiero) de KynWallet

**Branch**: `003-home-billetera` | **Date**: 2026-10-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-home-billetera/spec.md`

## Summary

Implementación del **Dashboard Home** de la billetera virtual KynWallet que se habilita tras iniciar sesión correctamente. Reproduce la estructura de los dos prototipos de referencia en Figma — **Prototipo 1 Desktop (`13:2`)** y **Prototipo 2 Mobile (`11:2`)** — e incorpora controles dinámicos de alto impacto visual: visualización y ocultamiento de saldo por privacidad (`••••••`), barra proporcional de flujo financiero (Ingresos vs. Gastos), tarjeta virtual Kyn Card personalizada, acciones rápidas interactivas (`Recargar`, `Enviar`, `Recibir`, `Pagar`) que actualizan en tiempo real el saldo y el historial, y listado de movimientos recientes con filtrado instantáneo por tipo (`Todos`, `Ingresos`, `Gastos`) y búsqueda por texto. Construido con React 19, TypeScript 5 (`strict`) y Vite 8 bajo Clean Architecture y TDD estricto.

## Technical Context

**Language/Version**: TypeScript 5.x (`strict: true`), Node.js ≥ 20 LTS

**Primary Dependencies**: React 19, Vite 8, `@fontsource-variable/inter` (cero dependencias nuevas añadidas)

**Storage**: Estado de sesión en memoria del cliente (inicializado con datos semilla deterministas al autenticar y actualizable dinámicamente mediante acciones rápidas)

**Testing**: Vitest 5, React Testing Library, `@testing-library/user-event`, jsdom, `axe-core` (`src/test/a11y.ts`), `@vitest/coverage-v8`

**Target Platform**: Navegadores modernos en escritorio (`≥ 960px`, Prototipo `13:2`) y dispositivos móviles (`320px`–`959px`, Prototipo `11:2`)

**Project Type**: Aplicación web de página única (SPA), solo frontend

**Performance Goals**: Carga del dashboard y respuesta de filtros, búsqueda y acciones rápidas en < 100 ms (SC-001, SC-002)

**Constraints**: Sin backend ni base de datos externa; cumplimiento obligatorio de WCAG 2.1 nivel AA; validaciones de entrada en el límite (Constitución 5.1); sin desplazamiento horizontal desde `320px`

**Scale/Scope**: 3 vistas conectadas (Login, Registro y Home Dashboard), módulo de dominio financiero puro (`src/domain/wallet.ts`) y módulo de UI del dashboard (`src/ui/features/home/`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / Regla | Cumplimiento en el diseño | Estado |
|---|---|---|
| I. TDD (No Negociable) | Todas las reglas del dominio (`wallet.ts`), el reducer (`homeReducer.ts`) y los componentes del dashboard (`HomeDashboard.tsx`) se desarrollan escribiendo primero las pruebas automatizadas que fallan | ✅ |
| II. SOLID | Responsabilidad única por módulo; funciones de dominio puras desacopladas de la UI; componentes extensibles mediante props | ✅ |
| III. Clean Architecture | `src/domain/wallet.ts` contiene los tipos, cálculos de saldo y filtros sin depender de React; `src/ui/features/home/` consume el dominio respetando las reglas de `eslint.config.js` | ✅ |
| IV. DRY/KISS/YAGNI | Reutilización de `Button`, `TextField`, `Alert`, `Toast` y `tokens.css`; sin librerías externas de gráficos ni gestores de estado complejos | ✅ |
| V. Seguridad por Diseño | Validación estricta de montos y conceptos en `validateQuickOperation` (rango `0.01`–`999,999.99`, máximo 2 decimales, verificación de saldo suficiente); control de privacidad para ocultar saldos en pantalla | ✅ |
| VI. BRD/ARD | No existen documentos BRD/ARD independientes; rigen `spec.md` y la Constitución | ✅ N/A |
| 7. Dependencias | Cero paquetes externos nuevos añadidos | ✅ |
| 8.1 Pruebas automatizadas | Pruebas unitarias de dominio y reducer + pruebas de integración y accesibilidad de UI; cobertura global ≥ 80 % | ✅ |
| 8.2 Convenciones de código | ESLint 9 (`strict` + `jsx-a11y`) + Prettier + `tsc --noEmit` | ✅ |
| 8.3 Documentación | Actualización de `README.md` y artefactos de `specs/003-home-billetera/` | ✅ |
| 8.4 Accesibilidad WCAG 2.1 AA | Roles semánticos (`navigation`, `searchbox`, `list`, `status`), `aria-pressed` en filtros y control de privacidad, signos `+`/`-` además de colores con ratio ≥ 4.5:1 (`--success-700`, `--danger-600`), validado con `axe-core` | ✅ |
| 8.5 / 8.6 Reutilización y Sistema de Diseño | Reutiliza los tokens de Figma en `src/ui/styles/tokens.css` y los componentes base en `src/ui/components/` | ✅ |
| 9.2 Trazabilidad | Casos de prueba etiquetados con identificadores de historia y requisito (`US1-2`, `US2-3`, `US3-1`, `FR-006`, etc.) | ✅ |
| 9.4 Controles de cumplimiento | Ejecución completa de `npm run verify` | ✅ |

**Resultado del gate**: **APROBADO**. Sin violaciones sin justificar.

**Re-check post-diseño (Phase 1)**: El modelo de datos (`data-model.md`), el contrato de interfaz (`contracts/ui-home.md`) y la guía rápida (`quickstart.md`) cumplen todos los principios de la Constitución.

## Project Structure

### Documentation (this feature)

```text
specs/003-home-billetera/
├── plan.md                             # Este archivo (/speckit.plan)
├── research.md                         # Decisiones técnicas y de diseño Desktop/Mobile (Phase 0)
├── data-model.md                       # Entidades financieras y estados del Home (Phase 1)
├── quickstart.md                       # Guía de ejecución y validación manual (Phase 1)
├── contracts/
│   └── ui-home.md                      # Contrato observable de la UI del Dashboard Home (Phase 1)
├── checklists/
│   └── requirements.md                 # Checklist de calidad de la especificación
└── tasks.md                            # Lista de tareas (/speckit.tasks - Phase 2)
```

### Source Code (repository root)

```text
src/
├── main.tsx                            # Raíz de composición
├── App.tsx                             # Presenta HomeDashboard cuando el usuario inicia sesión y LoginScreen en login/register
├── domain/
│   ├── auth.ts
│   ├── registration.ts
│   ├── wallet.ts                       # Nuevo: WalletTransaction, WalletSummary, calculateWalletSummary, filterTransactions, validateQuickOperation, formatCurrency, INITIAL_TRANSACTIONS
│   ├── validation.ts
│   └── messages.ts                     # Ampliado con los textos del Dashboard Home y validaciones de acciones rápidas
├── application/
│   ├── ports/
│   │   ├── AuthGateway.ts
│   │   └── UserRegistrationGateway.ts
│   ├── authenticate.ts
│   └── registerUser.ts
├── infrastructure/
│   ├── InMemoryAuthGateway.ts
│   ├── LocalStorageUserGateway.ts
│   ├── passwordHash.ts
│   └── loadDemoAccounts.ts
├── ui/
│   ├── styles/
│   │   ├── tokens.css                  # Ampliado con --success-700, --success-50 y tokens de superficie del dashboard
│   │   └── global.css
│   ├── components/
│   │   ├── TextField/
│   │   ├── PasswordField/
│   │   ├── Button/
│   │   ├── Checkbox/
│   │   ├── SocialButton/
│   │   ├── Divider/
│   │   ├── Alert/
│   │   └── Toast/
│   ├── layout/
│   │   └── BrandPanel/
│   └── features/
│       ├── home/
│       │   ├── HomeDashboard.tsx       # Nuevo: Dashboard completo adaptable a Desktop (13:2) y Mobile (11:2)
│       │   ├── HomeDashboard.module.css
│       │   ├── homeReducer.ts          # Nuevo: Máquina de estados de filtros, privacidad y acciones rápidas
│       │   └── useHomeDashboard.ts     # Nuevo: Hook de coordinación del dashboard
│       ├── login/
│       │   ├── LoginScreen.tsx
│       │   ├── LoginForm.tsx
│       │   ├── WelcomeView.tsx         # Reexporta/integra HomeDashboard manteniendo el contrato de bienvenida y cierre de sesión
│       │   ├── loginReducer.ts
│       │   └── useLoginForm.ts
│       └── register/
│           ├── RegisterForm.tsx
│           ├── RegisterForm.module.css
│           ├── registerReducer.ts
│           └── useRegisterForm.ts
└── test/
    ├── setup.ts
    ├── a11y.ts
    ├── fixtures.ts
    ├── authStub.ts
    └── registrationStub.ts
```

**Structure Decision**: Se mantiene la arquitectura limpia en un único proyecto frontend. La lógica financiera pura se ubica en `src/domain/wallet.ts` y la interfaz interactiva en `src/ui/features/home/`, integrándose con `WelcomeView` / `App` para que al autenticarse se despliegue el Dashboard Home completo a pantalla completa.

## Complexity Tracking

| Violación / desviación | Por qué es necesaria | Alternativa más simple rechazada porque |
|---|---|---|
| Tokens `--success-700` (`#166534`) y `--brand-700` (`#d04721`) para textos e indicadores sobre fondo claro | Garantizar un ratio de contraste ≥ 4.5:1 exigido por la Constitución 8.4 (WCAG 2.1 AA) | Tonos verdes o naranjas claros de prototipo no alcanzan el umbral 4.5:1 sobre blanco |
