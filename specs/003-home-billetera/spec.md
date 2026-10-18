# Feature Specification: Pantalla Home (Dashboard Financiero) de KynWallet

**Feature Branch**: `003-home-billetera`

**Created**: 2026-10-17

**Status**: Draft

**Input**: User description: "Necesito construir la opción Home la cual se habilita despues de haber iniciado sesión correctamente en nuestra billetera virtual, con el objetivo de presentar un dashboard de control sobre las finanzas de la billetera para dicho usuario. Ten en cuenta que existen como referencia de diseño dos prototipos en Figma: Prototipo 1 (Desktop): https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=13-2 y Prototipo 2 (Mobile): https://www.figma.com/design/f7uDsv8sh6ZOtK2OitTqtg/Billetera-Virtual---Prototipos?node-id=11-2. Los controles dentro del dashboard tienen que ser dinámicos y de impacto visual al usuario. El alcance se limita a una demostración funcional, sin servicios backend ni base de datos. Genera historias de usuario y criterios de aceptación, respetando la Constitución del proyecto."

**Diseños de referencia**:
- **Prototipo 1 — Escritorio (`Desktop`)**: Figma, nodo `13:2` del archivo `f7uDsv8sh6ZOtK2OitTqtg`. Dashboard de múltiples columnas con navegación lateral, cabecera con saludo personalizado al usuario autenticado, panel principal de saldo disponible y tarjeta virtual Kyn Card, indicadores de ingresos y gastos del periodo, botonera de acciones rápidas (Enviar, Recibir, Recargar, Pagar) y panel de historial de movimientos recientes con filtros dinámicos.
- **Prototipo 2 — Móvil (`Mobile`)**: Figma, nodo `11:2` del archivo `f7uDsv8sh6ZOtK2OitTqtg`. Adaptación móvil en una sola columna con cabecera compacta, tarjeta de saldo e indicadores principales, accesos rápidos táctiles, lista de movimientos recientes y barra de navegación inferior fija.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acceder al Dashboard Home tras iniciar sesión y visualizar el resumen financiero (Priority: P1)

Como usuario autenticado de KynWallet, quiero que inmediatamente después de iniciar sesión se muestre el dashboard Home con mi nombre, mi saldo disponible, mi tarjeta virtual y el resumen de mis ingresos y gastos, pudiendo ocultar o mostrar los importes por privacidad y cerrar sesión cuando lo desee, para tener visibilidad inmediata y segura del estado de mis finanzas.

**Why this priority**: es el núcleo de la funcionalidad solicitada; conecta el inicio de sesión exitoso con el panel de control financiero del usuario y entrega el impacto visual principal del diseño.

**Independent Test**: se inicia sesión con una cuenta válida (de demostración o recién registrada) y se verifica que se despliega la pantalla Home mostrando el nombre del titular, el saldo total formateado, los indicadores de ingresos y gastos, la tarjeta Kyn Card con el titular, el control para ocultar/mostrar montos y la acción de cerrar sesión.

**Acceptance Scenarios**:

1. **Given** un usuario que ingresa credenciales válidas en la pantalla de inicio de sesión, **When** la autenticación se completa exitosamente, **Then** el sistema muestra la pantalla Home (Dashboard) personalizada con el nombre del usuario autenticado en el saludo y en la tarjeta virtual Kyn Card.
2. **Given** la pantalla Home cargada, **When** el usuario observa el panel de resumen financiero, **Then** visualiza el saldo total disponible, el total de ingresos del mes y el total de gastos del mes con formato monetario claro y jerarquía visual destacada.
3. **Given** los montos del dashboard visibles en pantalla, **When** el usuario activa el control de privacidad ("Ocultar saldo"), **Then** el saldo disponible y los montos de resumen se enmascaran dinámicamente (por ejemplo, `"••••••"`) y el control cambia su etiqueta accesible a `"Mostrar saldo"`; al volver a activarlo, los montos vuelven a mostrarse.
4. **Given** el usuario autenticado en la pantalla Home, **When** activa el control `"Cerrar sesión"`, **Then** se limpia el estado de la sesión activa y el sistema regresa a la pantalla de inicio de sesión con los campos vacíos.

---

### User Story 2 - Explorar y filtrar dinámicamente los movimientos recientes (Priority: P1)

Como usuario en el dashboard Home, quiero consultar la lista de mis movimientos recientes y filtrarlos dinámicamente por tipo (Todos, Ingresos, Gastos) o buscarlos por concepto, para analizar en qué he recibido o utilizado mi dinero sin recargar la página.

**Why this priority**: un dashboard financiero con controles dinámicos requiere que el usuario pueda interactuar con sus movimientos para obtener información accionable sobre sus finanzas.

**Independent Test**: en la pantalla Home se seleccionan los filtros `"Todos"`, `"Ingresos"` y `"Gastos"` y se escribe un término en el buscador de movimientos, verificando que la lista se actualiza instantáneamente mostrando solo las transacciones que coinciden.

**Acceptance Scenarios**:

1. **Given** la pantalla Home cargada, **When** el filtro activo por defecto es `"Todos"`, **Then** el listado de movimientos recientes muestra tanto ingresos como gastos ordenados del más reciente al más antiguo, diferenciando visualmente cada tipo con su signo (`+` / `-`), color semántico accesible, categoría, fecha y monto.
2. **Given** el listado de movimientos en el Home, **When** el usuario selecciona el filtro `"Ingresos"`, **Then** la lista se actualiza dinámicamente para mostrar únicamente las transacciones de entrada de dinero y el control `"Ingresos"` queda marcado como activo.
3. **Given** el listado de movimientos en el Home, **When** el usuario selecciona el filtro `"Gastos"`, **Then** la lista se actualiza dinámicamente para mostrar únicamente las transacciones de salida de dinero y el control `"Gastos"` queda marcado como activo.
4. **Given** el campo de búsqueda de movimientos, **When** el usuario escribe parte del nombre de un comercio, contacto o concepto, **Then** el listado filtra en tiempo real las transacciones que coinciden (sin distinguir mayúsculas ni tildes); y si ninguna coincide, muestra un estado vacío comprensible (`"No se encontraron movimientos para los criterios seleccionados"`).

---

### User Story 3 - Ejecutar acciones rápidas simuladas con actualización dinámica del saldo (Priority: P2)

Como usuario del dashboard Home, quiero utilizar los controles de acciones rápidas (`"Recargar"`, `"Enviar"`, `"Recibir"`, `"Pagar"`) para simular operaciones cotidianas y ver cómo mi saldo, mis totales de ingresos/gastos y mi lista de movimientos se actualizan al instante con impacto visual, para experimentar el control interactivo de mi billetera.

**Why this priority**: materializa la exigencia de que *"los controles dentro del dashboard tienen que ser dinámicos y de impacto visual al usuario"* dentro del alcance de una demostración sin backend.

**Independent Test**: desde la pantalla Home se activa `"Recargar"` o `"Enviar"`, se ingresa un concepto y un monto válido, se confirma la operación y se verifica que el saldo disponible, el indicador de ingresos/gastos y el primer ítem de movimientos recientes se actualizan inmediatamente.

**Acceptance Scenarios**:

1. **Given** la pantalla Home, **When** el usuario activa la acción rápida `"Recargar"` e ingresa un monto válido (mayor a 0), **Then** el saldo disponible y el total de ingresos se incrementan dinámicamente en ese monto, se añade un nuevo movimiento de ingreso al inicio del historial y se muestra una confirmación visual tipo Toast.
2. **Given** la pantalla Home con saldo disponible suficiente, **When** el usuario activa la acción rápida `"Enviar"` (o `"Pagar"`), ingresa un destinatario/concepto y un monto válido menor o igual a su saldo disponible y confirma, **Then** el saldo disponible disminuye en ese monto, el total de gastos aumenta en ese monto, se agrega el nuevo movimiento de gasto al inicio del historial y se muestra una confirmación visual.
3. **Given** el formulario de `"Enviar"` o `"Pagar"`, **When** el usuario intenta enviar un monto vacío, menor o igual a cero, o superior a su saldo disponible actual, **Then** el sistema muestra un mensaje de validación inline (por ejemplo, `"Saldo insuficiente para realizar esta operación"` o `"Ingresa un monto válido mayor a 0"`) y no modifica el saldo ni registra el movimiento.
4. **Given** la pantalla Home, **When** el usuario activa la acción rápida `"Recibir"`, **Then** se muestra un panel o diálogo interactivo con los datos de su cuenta/alias para recibir transferencias y un control para copiarlos con confirmación visual tipo Toast (`"Datos copiados al portapapeles"`).

---

### User Story 4 - Adaptación responsiva entre los prototipos Desktop (`13:2`) y Mobile (`11:2`) (Priority: P2)

Como usuario que accede desde distintos dispositivos, quiero que la pantalla Home adopte la distribución de escritorio (Prototipo 1, nodo `13:2`) en pantallas amplias y la distribución móvil (Prototipo 2, nodo `11:2`) en pantallas pequeñas, manteniendo todos los controles dinámicos accesibles, para gestionar mis finanzas cómodamente tanto en computador como en teléfono móvil.

**Why this priority**: el usuario especificó explícitamente los dos prototipos de referencia en Figma (`13:2` para Desktop y `11:2` para Mobile) como base obligatoria de la interfaz.

**Independent Test**: se visualiza la pantalla Home en ancho de escritorio (`1440px` / `≥ 960px`) y en ancho móvil (`375px` / `320px`), verificando la presencia de la navegación lateral y rejilla multicolumna en escritorio y la disposición vertical con barra de navegación inferior en móvil, sin desplazamiento horizontal.

**Acceptance Scenarios**:

1. **Given** una pantalla de ancho de escritorio (`≥ 960px`), **When** se muestra el Home, **Then** la interfaz presenta la estructura del Prototipo 1 (`13:2`): barra de navegación lateral con el logo KynWallet y opciones de menú, cabecera superior con perfil y cierre de sesión, y área de contenido distribuida en paneles para saldo/tarjeta, indicadores, acciones rápidas y movimientos.
2. **Given** una pantalla de ancho móvil (`< 960px`, desde `320px`), **When** se muestra el Home, **Then** la interfaz presenta la estructura del Prototipo 2 (`11:2`): cabecera superior compacta, tarjeta de saldo e indicadores apilados verticalmente, botonera de acciones rápidas adaptada a interacción táctil y barra de navegación inferior fija, sin generar desplazamiento horizontal.
3. **Given** los ítems de navegación secundaria del menú (en barra lateral Desktop o barra inferior Mobile) que exceden la vista principal de demostración, **When** el usuario los selecciona, **Then** el control refleja feedback visual o muestra una notificación Toast (`"Próximamente"`) sin perder el estado financiero actual de la sesión.

---

### Edge Cases

- **Intento de envío mayor al saldo disponible**: el sistema bloquea la operación con validación inline antes de procesar y el saldo nunca pasa a ser negativo.
- **Montos con decimales o formatos inválidos**: se aceptan hasta 2 decimales positivos y se rechazan caracteres no numéricos, valores negativos, `NaN`, `0` o montos que excedan el límite máximo por operación (`999,999.99`).
- **Filtro o búsqueda sin coincidencias**: cuando la combinación de filtro (`Ingresos` / `Gastos`) y texto de búsqueda no coincide con ningún movimiento, se muestra un estado vacío claro con opción para restablecer los filtros.
- **Ocultar saldo y realizar una nueva operación**: si el usuario tiene el saldo oculto (`••••••`) y realiza una recarga o envío, el estado de privacidad oculto se respeta hasta que el usuario decida mostrarlo nuevamente.
- **Nombres de titular extensos (hasta 80 caracteres)**: se truncan con elipsis (`text-overflow: ellipsis`) en la cabecera y en la tarjeta virtual Kyn Card sin romper la maquetación en `320px`.
- **Navegación completa por teclado**: todos los controles dinámicos (ocultar saldo, acciones rápidas, modales/diálogos, filtros de movimientos, buscador y cerrar sesión) son operables con `Tab`, `Shift+Tab`, `Enter`, `Space` y `Escape`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Tras una autenticación exitosa en `LoginForm`, la aplicación DEBE presentar la pantalla **Home (Dashboard Financiero)** en lugar de la vista estática de bienvenida, recibiendo el nombre para mostrar (`displayName`) y el identificador del usuario autenticado.
- **FR-002**: La pantalla Home DEBE reproducir en pantallas de escritorio (`≥ 960px`) la jerarquía, estructura y componentes del **Prototipo 1 de Figma (`13:2`)**, y en pantallas móviles (`< 960px`, desde `320px`) la estructura del **Prototipo 2 de Figma (`11:2`)**, reutilizando los tokens y componentes del sistema de diseño corporativo (Constitución 8.5 y 8.6).
- **FR-003**: El dashboard DEBE mostrar de forma destacada el saludo personalizado al usuario, el **Saldo Total Disponible**, el resumen de **Ingresos** y **Gastos** del periodo, y la representación visual de la **Kyn Card** con el nombre del titular autenticado.
- **FR-004**: El dashboard DEBE incluir un control interactivo y accesible para alternar entre mostrar y ocultar (`"••••••"`) los montos sensibles en pantalla (saldo disponible e indicadores de ingresos/gastos).
- **FR-005**: El dashboard DEBE ofrecer los controles dinámicos de **Acciones Rápidas** (`"Enviar"`, `"Recibir"`, `"Recargar"`, `"Pagar"`):
  - `"Recargar"` DEBE permitir ingresar un monto válido y un concepto opcional para incrementar dinámicamente el saldo disponible y registrar un nuevo movimiento de ingreso.
  - `"Enviar"` y `"Pagar"` DEBEN permitir ingresar un destinatario/concepto y un monto válido (mayor a `0` y menor o igual al saldo disponible actual) para descontar dinámicamente el saldo y registrar un nuevo movimiento de gasto.
  - `"Recibir"` DEBE mostrar la información de cuenta/alias del usuario para recibir fondos con opción de copiado rápido y aviso tipo Toast.
- **FR-006**: Toda entrada del usuario en los controles de operaciones rápidas DEBE validarse en el límite por tipo, formato, longitud y rango (Constitución, Principio V, regla 5.1): concepto/destinatario obligatorio (1–60 caracteres) y monto numérico positivo con hasta 2 decimales, mayor a `0` y que no supere el saldo disponible en operaciones de salida.
- **FR-007**: El dashboard DEBE incluir una sección de **Movimientos Recientes** que liste cada transacción con título/concepto, categoría, fecha, tipo (`ingreso` o `gasto`) y monto formateado con distinción visual y semántica (no basada únicamente en el color, incluyendo signo `+` o `-`).
- **FR-008**: La sección de Movimientos Recientes DEBE contar con controles dinámicos de filtrado por categoría de flujo (`"Todos"`, `"Ingresos"`, `"Gastos"`) y un campo de búsqueda instantánea por texto, mostrando un mensaje de estado vacío cuando no existan resultados.
- **FR-009**: Los cálculos de saldo disponible, suma de ingresos, suma de gastos y filtrado de movimientos DEBEN residir en la capa de dominio como funciones puras, sin duplicarse en los componentes de interfaz de usuario (Constitución, Principio III y Principio IV).
- **FR-010**: La pantalla Home DEBE incluir un control visible y accesible de **"Cerrar sesión"** que finalice la sesión actual y regrese al formulario de Login vacío sin exponer datos del usuario anterior.
- **FR-011**: Los elementos de navegación complementarios presentes en los prototipos de Figma (`13:2` y `11:2`) que apunten a módulos fuera del alcance de esta demostración DEBEN mostrar una notificación temporal tipo Toast (`"Próximamente"`) manteniendo el estado actual del dashboard.
- **FR-012**: Toda la interfaz del Home (incluyendo tarjetas de resumen, filtros, buscador, diálogos de acciones rápidas y barra de navegación Desktop/Mobile) DEBE cumplir como mínimo **WCAG 2.1 nivel AA** (Constitución 8.4): contraste suficiente, roles semánticos (`navigation`, `main`, `region`, `dialog`, `status`), etiquetas accesibles y operación completa por teclado.

### Key Entities *(include if feature involves data)*

- **Resumen de Billetera (`WalletSummary`)**: estado financiero agregado del usuario autenticado, compuesto por `availableBalance` (saldo disponible actual), `totalIncome` (suma de ingresos del periodo), `totalExpenses` (suma de gastos del periodo), `currency` (moneda de presentación, por defecto `USD` / `$`) y `cardNumberMasked` (número de tarjeta enmascarado `"5294 •••• •••• 4827"`).
- **Movimiento Financiero (`WalletTransaction`)**: registro individual en el historial de la billetera. Atributos: `id` único, `title` (concepto o destinatario, 1–60 caracteres), `category` (ej. `"Transferencia"`, `"Recarga"`, `"Servicios"`, `"Compras"`), `type` (`'income' | 'expense'`), `amount` (valor numérico positivo en centavos o decimal con 2 posiciones) y `occurredAt` (fecha/hora legible).
- **Filtro de Movimientos (`TransactionFilter`)**: criterio activo de visualización en el dashboard, compuesto por `type` (`'all' | 'income' | 'expense'`) y `query` (texto de búsqueda normalizado).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de los inicios de sesión exitosos (tanto con cuentas de demostración como con cuentas registradas en el navegador) cargan y presentan el dashboard Home en menos de 100 milisegundos tras completarse la autenticación.
- **SC-002**: Todas las interacciones dinámicas del dashboard (ocultar/mostrar saldo, filtrar movimientos por `"Todos"`/`"Ingresos"`/`"Gastos"`, buscar por texto y ejecutar una recarga o envío simulado) actualizan la interfaz en menos de 100 milisegundos sin recargar la página.
- **SC-003**: El 100 % de los escenarios de aceptación de las historias P1 y P2 están verificados mediante pruebas automatizadas siguiendo TDD (Constitución, Principio I y 8.1), manteniendo una cobertura global ≥ 80 %.
- **SC-004**: La pantalla Home supera la auditoría automatizada de accesibilidad WCAG 2.1 nivel AA (`0` violaciones críticas o serias) tanto en su estado inicial como con filtros aplicados y paneles de acción rápida abiertos.
- **SC-005**: La interfaz se adapta sin desplazamiento horizontal en todo el rango desde `320px` (Prototipo Mobile `11:2`) hasta `1440px+` (Prototipo Desktop `13:2`).

## Assumptions

- **Datos iniciales de demostración del Dashboard**: al iniciar sesión, la billetera se inicializa con un conjunto realista de movimientos recientes y saldo semilla determinista para la demostración, sobre el cual el usuario puede realizar recargas, envíos y pagos dinámicos que actualizan los montos en tiempo real.
- **Moneda de visualización**: los importes se muestran en dólares estadounidenses (`USD`, formato `$1,250.00` / `+$450.00` / `-$85.50`) en coherencia con el diseño de los prototipos de Figma.
- **Punto de corte entre Prototipo Desktop (`13:2`) y Prototipo Mobile (`11:2`)**: se utiliza el breakpoint de `960px` ya establecido en el sistema de diseño del proyecto (`research.md` R10 de `001-login-billetera`): `< 960px` renderiza la disposición móvil con barra de navegación inferior (`11:2`) y `≥ 960px` renderiza la disposición de escritorio con navegación lateral y paneles en cuadrícula (`13:2`).
- **Alcance sin backend**: todas las operaciones dentro del dashboard (recargas, envíos, pagos, filtros y privacidad de saldo) se ejecutan íntegramente en el cliente sin llamadas a servidores externos ni bases de datos.
- **Conformidad con BRD/ARD (Constitución, Principio VI)**: al no existir documentos BRD o ARD independientes en el repositorio, esta especificación y la Constitución actúan como fuente autorizada.
