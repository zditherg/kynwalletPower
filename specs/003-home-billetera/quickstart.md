# Quickstart: Pantalla Home (Dashboard Financiero) de KynWallet

Guía rápida para ejecutar y validar de punta a punta el Dashboard Home en escritorio (`13:2`) y móvil (`11:2`).

## Prerrequisitos

- Node.js 20 LTS o superior y npm 10 o superior.

## Configuración y ejecución

```bash
npm install
cp .env.example .env.local
npm run dev        # Servidor de desarrollo en http://localhost:5173
```

## Verificación automatizada de calidad (Constitución 9.4)

```bash
npm run verify     # lint, format, typecheck, test:coverage (≥ 80 %), build, audit:deps, audit:licenses, scan:secrets
```

## Escenarios de validación manual

| # | Acción | Resultado esperado | Referencia Spec |
|---|---|---|---|
| 1 | Iniciar sesión con una cuenta válida (o registrarse e iniciar sesión) | Se despliega el Dashboard Home con `"¡Bienvenido, {Nombre}!"`, el saldo disponible (`"$2,450.00"`), ingresos (`"+$3,200.00"`), gastos (`"-$750.00"`) y la tarjeta Kyn Card con el titular | US1-1, US1-2 |
| 2 | Pulsar el botón `"Ocultar saldo"` y luego `"Mostrar saldo"` | Los montos cambian dinámicamente a `"••••••"` y vuelven a mostrarse al pulsar `"Mostrar saldo"` | US1-3, FR-004 |
| 3 | En `"Movimientos recientes"`, pulsar `"Ingresos"`, luego `"Gastos"` y luego `"Todos"` | La lista se filtra al instante mostrando solo ingresos (`+$`), solo gastos (`-$`) o todos los movimientos | US2-1, US2-2, US2-3 |
| 4 | Escribir `" Nómina "` o `"Supermercado"` en `"Buscar movimiento"`, y luego `"xyz-inexistente"` | Filtra en tiempo real los movimientos coincidentes; con texto sin coincidencias muestra `"No se encontraron movimientos para los criterios seleccionados"` | US2-4, FR-008 |
| 5 | Pulsar la acción rápida `"Recargar"`, escribir concepto `"Depósito extra"` y monto `"500"`, y pulsar `"Confirmar operación"` | El saldo disponible sube a `"$2,950.00"`, los ingresos suben a `"+$3,700.00"`, aparece `"Depósito extra"` al inicio de la lista y se muestra el Toast de confirmación | US3-1, FR-005 |
| 6 | Pulsar `"Enviar"`, escribir destinatario `"Carlos Ruiz"` y monto `"999999"` (mayor al saldo) | Muestra error inline `"Saldo insuficiente para realizar esta operación"` y no descuenta el saldo | US3-3, FR-006 |
| 7 | En `"Enviar"`, cambiar el monto a `"150"` y confirmar | El saldo baja a `"$2,800.00"`, los gastos suben a `"-$900.00"` y `"Carlos Ruiz"` aparece al inicio de los movimientos con `"-$150.00"` | US3-2, FR-005 |
| 8 | Pulsar `"Recibir"` y luego `"Copiar alias"` | Muestra los datos de recepción del usuario y el Toast `"Datos copiados al portapapeles"` | US3-4, FR-005 |
| 9 | Alternar el tamaño de ventana entre `1440px` (Desktop `13:2`) y `375px` / `320px` (Mobile `11:2`) | En escritorio muestra barra lateral y rejilla multicolumna; en móvil muestra disposición de una columna y barra inferior sin scroll horizontal | US4-1, US4-2, SC-005 |
| 10 | Pulsar `"Cerrar sesión"` | Regresa al formulario de Login vacío | US1-4, FR-010 |
