# Research: Pantalla Home (Dashboard Financiero) de KynWallet

**Feature**: `003-home-billetera` | **Date**: 2026-10-18

Todas las decisiones técnicas, de diseño visual (basadas exclusivamente en el nodo `13:2` de Figma), comportamiento responsive sin distorsión (Desktop 2 paneles / Mobile 1 solo panel de contenido-formulario), interactividad dinámica y cumplimiento constitucional quedan documentadas aquí.

## R1. Stack base y Clean Architecture

- **Decision**: Mantener React 19 + TypeScript 5 (`strict: true`) + Vite 8, sin añadir ninguna dependencia externa nueva (`package.json` inalterado), organizando el código del Home en `src/domain/wallet.ts` (reglas financieras puras) y `src/ui/features/home/` (componentes reutilizables, reducer y hook del dashboard).
- **Rationale**: Dado que la demostración opera 100 % en el cliente con datos semilla y operaciones interactivas en memoria de la sesión autenticada, toda la lógica de cálculo de saldos, validación de operaciones y filtrado pertenece a funciones puras del dominio (`src/domain/wallet.ts`), verificadas con pruebas unitarias instantáneas (Principios I, II, III y IV).
- **Alternatives considered**: Librerías de gráficos pesadas (`recharts`, `chart.js`) o gestores de estado externos (`zustand`, `redux`) — rechazados por Principio IV (KISS/YAGNI) y sección 7.4 de la Constitución; barras de proporción CSS accesibles y `useReducer` ofrecen alto impacto visual con cero dependencias adicionales.

## R2. Único diseño de referencia en Figma (`node-id=13-2`) y patrón Responsive (Desktop 2 paneles / Mobile solo formulario-contenido)

- **Decision**: Adoptar exclusivamente el diseño de Figma **`node-id=13-2`** del archivo `f7uDsv8sh6ZOtK2OitTqtg` ([https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=13-2](https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=13-2)) y aplicar el mismo principio estructural responsive de 2 paneles en Desktop y 1 panel en Mobile que utilizan Login y Registro:
  1. **Desktop (`≥ 960px` — 2 paneles)**:
     - **Panel 1 (Izquierdo — Panel lateral de marca y navegación, `260px` fijo)**: fondo `--neutral-0` con borde derecho `--neutral-200`, encabezado con logo corporativo KynWallet (`logo-mark.svg` + `"KynWallet"`) y menú vertical de navegación (`"Inicio"` activo con `aria-current="page"`, `"Movimientos"`, `"Tarjetas"`, `"Mi Perfil"`).
     - **Panel 2 (Derecho — Panel de contenido y formularios del Dashboard, `1fr`)**: contenedor fluido y centrado (`max-width: 1080px`) con cabecera de bienvenida y botón `"Cerrar sesión"`, rejilla de 2 columnas para la tarjeta **Kyn Card** y el panel de **Ingresos/Gastos + flujo positivo**, botonera de **Acciones rápidas** (`Recargar`, `Enviar`, `Recibir`, `Pagar`) con su formulario interactivo inline y sección de **Movimientos recientes** con filtros y buscador.
  2. **Mobile (`< 960px`, desde `320px` — 1 solo panel / solo formulario-contenido)**:
     - Elimina el layout de barra inferior flotante (`11:2` descartado) que causaba distorsión al cambiar entre tamaños de ventana.
     - En `< 960px`, el contenedor principal se comporta como **1 solo panel vertical centrado** (`max-width: 540px`, sin paneles laterales fijos ni barras pegadas al borde inferior), presentando una cabecera compacta con las opciones de navegación en línea y apilando limpiamente en una sola columna las tarjetas de resumen, el formulario de acciones rápidas y la lista de movimientos recientes, garantizando cero distorsión durante el redimensionamiento continuo entre móvil, tablet y escritorio.
- **Rationale**: Unificar la maquetación en torno al prototipo `13:2` con transición de 1 columna (`< 960px`) a 2 paneles (`≥ 960px`) elimina los cambios abruptos de `order` y `position: sticky; bottom: 0` que deformaban la interfaz al redimensionar la pantalla.

## R3. Opciones `Movimientos`, `Tarjetas` y `Mi Perfil` con Toast Alert (`"Próximamente"`)

- **Decision**: Configurar los botones `"Movimientos"`, `"Tarjetas"` y `"Mi Perfil"` dentro de `<nav aria-label="Navegación principal">` para que al hacer clic disparen exclusivamente `showToast(MESSAGES.COMING_SOON)` (`"Próximamente"`), renderizando el componente reutilizable `Toast` (`src/ui/components/Toast/Toast.tsx`, `role="status"`, `aria-live="polite"`).
- **Rationale**: Cumple exactamente el requerimiento del usuario (*"considera que las opciones Movimientos, Tarjetas y Mi Perfil del Dashboard solo envíen un mensaje de Próximamente utilizando Toast Alert"*) y reutiliza el componente `Toast` ya validado en `002-registro-billetera` (Constitución, Principio IV y 8.5).

## R4. Tokens semánticos y contraste WCAG 2.1 AA (Constitución 8.4)

- **Decision**: Mantener en `src/ui/styles/tokens.css` los tokens semánticos verificados frente a WCAG 2.1 AA sobre fondo blanco (`#ffffff`):
  - `--success-700: #166534` (ratio **7.13:1** sobre blanco — montos de ingresos `+$` e indicadores positivos).
  - `--success-50: #dcfce7` (fondo suave para indicadores de ingresos).
  - `--surface-muted: #f4f5f9` (superficie de contraste suave para el fondo del panel derecho y tarjetas internas).
  - Reutilizar `--error-600: #dc2626` (montos de gastos `-$` y errores) y `--error-50: #fef2f2`.
  - Además del color, todo ingreso lleva el prefijo `+` y todo gasto el prefijo `-` para cumplir WCAG 1.4.1 (Uso del color).
- **Rationale**: Cumple de manera verificable la regla 8.4 de la Constitución (`axe-core` + ratios ≥ 4.5:1).

## R5. Cálculos financieros y validaciones en el dominio (`src/domain/wallet.ts`)

- **Decision**: Mantener en `src/domain/wallet.ts`:
  - Conjunto semilla inmutable `INITIAL_TRANSACTIONS` con 5 movimientos variados (2 ingresos y 3 gastos) que producen un saldo inicial positivo y realista (`$2,450.00` de saldo disponible: `$3,200.00` de ingresos y `$750.00` de gastos).
  - `calculateWalletSummary(transactions)`: calcula de forma pura `totalIncome`, `totalExpenses`, `availableBalance = roundCurrency(totalIncome - totalExpenses)` e `incomeSharePercent`.
  - `filterTransactions(transactions, { type, query })`: filtra por tipo (`'all' | 'income' | 'expense'`) y por coincidencia de texto normalizado (sin distinguir mayúsculas/minúsculas ni tildes) en `title` o `category`.
  - `validateQuickOperation(input, availableBalance)`: valida bajo el Principio V (5.1) que `title` tenga entre 1 y 60 caracteres tras `trim()`, que `amountRaw` sea un número válido `> 0` y `<= 999999.99` con máximo 2 decimales, y que para operaciones de salida (`'send' | 'pay'`) se cumpla `amount <= availableBalance`.
- **Rationale**: Centraliza todas las reglas de negocio financieras en el dominio (Principios III y IV), permitiendo probarlas exhaustivamente sin depender de React.
