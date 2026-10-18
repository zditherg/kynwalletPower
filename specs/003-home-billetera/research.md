# Research: Pantalla Home (Dashboard Financiero) de KynWallet

**Feature**: `003-home-billetera` | **Date**: 2026-10-17

Todas las decisiones técnicas, de diseño visual (Desktop `13:2` y Mobile `11:2`), interactividad dinámica y cumplimiento constitucional quedan documentadas aquí.

## R1. Stack base y Clean Architecture

- **Decision**: Mantener React 19 + TypeScript 5 (`strict: true`) + Vite 8, sin añadir ninguna dependencia externa nueva (`package.json` inalterado), organizando el código del Home en `src/domain/wallet.ts` (reglas financieras puras) y `src/ui/features/home/` (componentes reutilizables, reducer y hook del dashboard).
- **Rationale**: Dado que la demostración opera 100 % en el cliente con datos semilla y operaciones interactivas en memoria de la sesión autenticada, toda la lógica de cálculo de saldos, validación de operaciones y filtrado pertenece a funciones puras del dominio (`src/domain/wallet.ts`), verificadas con pruebas unitarias instantáneas (Principios I, II, III y IV).
- **Alternatives considered**: Librerías de gráficos pesadas (`recharts`, `chart.js`) o gestores de estado externos (`zustand`, `redux`) — rechazados por Principio IV (KISS/YAGNI) y sección 7.4 de la Constitución; barras de proporción CSS/SVG accesibles y `useReducer` ofrecen alto impacto visual con cero dependencias adicionales.

## R2. Diseños de referencia en Figma: Desktop (`13:2`) y Mobile (`11:2`)

- **Decision**: Implementar un layout adaptativo que reproduzca ambos prototipos del archivo `f7uDsv8sh6ZOtK2OitTqtg`:
  1. **Prototipo 1 — Desktop (`node-id=13-2`, `≥ 960px`)**:
     - **Sidebar de navegación izquierda** (`240px` fija, fondo `--neutral-0`, borde derecho `--neutral-300`): logo KynWallet (`logo-mark.svg` + `"KynWallet"`), navegación principal (`"Inicio"` activo con acento `--brand-700`, `"Movimientos"`, `"Tarjetas"`, `"Mi Perfil"`) y botón inferior `"Cerrar sesión"`.
     - **Cabecera superior del área principal**: saludo `"¡Bienvenido, {displayName}!"` (`h1`), subtítulo `"Resumen de tus finanzas hoy"` e insignia de titular con iniciales.
     - **Fila superior de impacto visual (Grid 2 columnas en Desktop)**:
       - **Panel de Saldo Principal y Flujo Mensual** (fondo degradado `--brand-gradient`, radio `22px`, texto blanco): etiqueta `"Saldo disponible"`, monto principal en tipografía grande (`36px Bold`), botón accesible `"Ocultar saldo"` / `"Mostrar saldo"`, barra visual dinámica de proporción Ingresos vs. Gastos y tarjetas de indicadores `"Ingresos del mes"` (`+$...`) y `"Gastos del mes"` (`-$...`).
       - **Tarjeta Virtual Kyn Card interactiva**: representación visual de la tarjeta (`"Kyn Card"`, chip dorado, número `"5294  ••••  ••••  4827"`, titular `{DISPLAY_NAME}` en mayúsculas y vencimiento `"12/29"`, estado `"Activa"`).
     - **Barra de Acciones Rápidas Dinámicas** (4 botones de impacto visual en rejilla): `"Recargar"`, `"Enviar"`, `"Recibir"` y `"Pagar"`.
     - **Panel de Movimientos Recientes**: encabezado `"Movimientos recientes"`, pestañas/filtros dinámicos (`"Todos"`, `"Ingresos"`, `"Gastos"`), campo de búsqueda instantánea (`"Buscar movimiento"`) y lista de transacciones con icono de categoría, concepto, fecha y monto formateado (`+$` en verde accesible / `-$` en rojo accesible).
  2. **Prototipo 2 — Mobile (`node-id=11-2`, `< 960px`, desde `320px`)**:
     - Oculta la barra lateral de escritorio y presenta una **cabecera móvil compacta** con logo, saludo al titular y botón `"Cerrar sesión"`.
     - Apila en una sola columna vertical: tarjeta de Saldo Disponible + indicadores, acciones rápidas en cuadrícula de 4 columnas táctiles, tarjeta Kyn Card compacta y listado de Movimientos Recientes con filtros y búsqueda.
     - **Barra de navegación inferior fija** (`navigation` `"Navegación móvil"` con `"Inicio"`, `"Movimientos"`, `"Tarjetas"`, `"Mi Perfil"`).
- **Rationale**: Garantiza fidelidad visual tanto en escritorio (`13:2`) como en móvil (`11:2`) usando un único árbol semántico accesible y CSS Grid / Flexbox con el punto de corte corporativo de `960px`.

## R3. Tokens semánticos y contraste WCAG 2.1 AA (Constitución 8.4)

- **Decision**: Ampliar `src/ui/styles/tokens.css` con tokens semánticos verificados frente a WCAG 2.1 AA sobre fondo blanco (`#ffffff`):
  - `--success-700: #166534` (ratio **7.13:1** sobre blanco — montos de ingresos `+$` e indicadores positivos).
  - `--success-50: #dcfce7` (fondo suave para iconos de ingresos).
  - Reutilizar `--danger-600: #c62828` (ratio **5.62:1** sobre blanco — montos de gastos `-$` y errores) y `--danger-50: #fdecea`.
  - Además del color, todo ingreso lleva el prefijo `+` y todo gasto el prefijo `-` para cumplir WCAG 1.4.1 (Uso del color).
- **Rationale**: Cumple de manera verificable la regla 8.4 de la Constitución (`axe-core` + ratios ≥ 4.5:1).

## R4. Cálculos financieros y validaciones en el dominio (`src/domain/wallet.ts`)

- **Decision**: Definir en `src/domain/wallet.ts`:
  - Conjunto semilla inmutable `INITIAL_TRANSACTIONS` con 5 movimientos variados (2 ingresos y 3 gastos) que producen un saldo inicial positivo y realista (`$2,450.00` de saldo disponible: `$3,200.00` de ingresos y `$750.00` de gastos).
  - `calculateWalletSummary(transactions)`: calcula de forma pura `totalIncome`, `totalExpenses` y `availableBalance = round2(totalIncome - totalExpenses)`.
  - `filterTransactions(transactions, { type, query })`: filtra por tipo (`'all' | 'income' | 'expense'`) y por coincidencia de texto normalizado (sin distinguir mayúsculas/minúsculas ni tildes) en `title` o `category`.
  - `validateQuickOperation(input, availableBalance)`: valida bajo el Principio V (5.1) que `title` tenga entre 1 y 60 caracteres tras `trim()`, que `amount` sea un número válido `> 0` y `<= 999999.99` con máximo 2 decimales, y que para operaciones de salida (`'send' | 'pay'`) se cumpla `amount <= availableBalance`.
- **Rationale**: Centraliza todas las reglas de negocio financieras en el dominio (Principios III y IV), permitiendo probarlas exhaustivamente sin depender de React.

## R5. Integración con el flujo de Login existente (`WelcomeView` / `HomeDashboard`)

- **Decision**: Evolucionar `WelcomeView` (o renderizar el nuevo contenido del Dashboard dentro de la vista autenticada) de modo que:
  - Mantenga el encabezado nivel 1 `"¡Bienvenido, {name}!"` con manejo de foco (`tabIndex={-1}`) y el botón `"Cerrar sesión"` exigidos por los contratos de `001-login-billetera` (`US1-1`, `US1-5`, `FR-009`, `FR-009a`).
  - Cuando el usuario inicia sesión en `App`, la pantalla cambia del layout de formulario de 2 columnas (`LoginScreen`) al layout completo de `HomeDashboard` (Desktop `13:2` / Mobile `11:2`).
- **Rationale**: Cumple simultáneamente todos los escenarios de `003-home-billetera` y conserva el 100 % de las pruebas existentes de `001-login-billetera` y `002-registro-billetera` en verde (Principio I, regla 1.2).
