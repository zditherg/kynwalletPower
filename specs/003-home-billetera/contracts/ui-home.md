# Contract: Interfaz de usuario de la pantalla Home (Dashboard Financiero)

Contrato observable por el usuario y por las pruebas automatizadas (React Testing Library consulta por rol y nombre accesible). Aplica tanto a la disposición Desktop (Figma `13:2`) como a la disposición Mobile (Figma `11:2`).

## 1. Estructura general y cabecera

| Elemento | Rol / nombre accesible | Comportamiento |
|---|---|---|
| Saludo principal | `heading` nivel 1 `"¡Bienvenido, {displayName}!"` | Recibe el foco inicial al entrar al Home (`tabIndex={-1}`, FR-001, FR-003) |
| Navegación principal | `navigation` `"Navegación principal"` | Contiene los botones `"Inicio"` (`aria-current="page"`), `"Movimientos"`, `"Tarjetas"` y `"Mi Perfil"` |
| Cerrar sesión | `button` `"Cerrar sesión"` | Limpia la sesión y regresa al formulario de Login vacío (FR-010) |

## 2. Panel de Saldo, Indicadores y Tarjeta Virtual

| Elemento | Rol / nombre accesible | Comportamiento |
|---|---|---|
| Saldo disponible | Región / texto con etiqueta `"Saldo disponible"` | Muestra el monto formateado (ej. `"$2,450.00"`) o `"••••••"` cuando `balanceHidden === true` |
| Control de privacidad | `button` `"Ocultar saldo"` / `"Mostrar saldo"` | `aria-pressed` refleja si el saldo está oculto; alterna la visibilidad de todos los importes de resumen (FR-004) |
| Indicador de ingresos | Texto junto a `"Ingresos del mes"` | Muestra `"+$3,200.00"` (o `"••••••"` si está oculto) |
| Indicador de gastos | Texto junto a `"Gastos del mes"` | Muestra `"-$750.00"` (o `"••••••"` si está oculto) |
| Kyn Card | Tarjeta visual con `"Kyn Card"` | Muestra `"5294  ••••  ••••  4827"` y el nombre del titular en mayúsculas |

## 3. Controles de Acciones Rápidas (`FR-005`, `FR-006`)

| Acción | Rol / nombre accesible | Comportamiento al activarse |
|---|---|---|
| Recargar | `button` `"Recargar"` | Abre el panel interactivo `"Recargar saldo"` con campos `"Concepto"` y `"Monto (USD)"` y botón `"Confirmar operación"` |
| Enviar | `button` `"Enviar"` | Abre el panel interactivo `"Enviar dinero"` con campos `"Destinatario o concepto"` y `"Monto (USD)"` y botón `"Confirmar operación"` |
| Recibir | `button` `"Recibir"` | Abre el panel `"Recibir dinero"` con el alias/cuenta del usuario y botón `"Copiar alias"` que dispara el Toast `"Datos copiados al portapapeles"` |
| Pagar | `button` `"Pagar"` | Abre el panel interactivo `"Pagar servicio"` con campos `"Servicio o concepto"` y `"Monto (USD)"` y botón `"Confirmar operación"` |

## 4. Historial de Movimientos Recientes y Filtros Dinámicos (`FR-007`, `FR-008`)

| Elemento | Rol / nombre accesible | Comportamiento |
|---|---|---|
| Encabezado de sección | `heading` nivel 2 `"Movimientos recientes"` | Identifica la sección de historial |
| Filtros por tipo | `button` `"Todos"`, `button` `"Ingresos"`, `button` `"Gastos"` | `aria-pressed="true"` en el filtro activo; filtra instantáneamente la lista |
| Buscador de movimientos | `searchbox` `"Buscar movimiento"` | Filtra instantáneamente por concepto o categoría |
| Lista de movimientos | `list` `"Lista de movimientos"` con `listitem` | Cada ítem muestra título, categoría, fecha y monto con signo (`+$...` o `-$...`) |
| Estado vacío | Texto `"No se encontraron movimientos para los criterios seleccionados"` | Se muestra cuando ningún movimiento coincide con el filtro/búsqueda activos |
