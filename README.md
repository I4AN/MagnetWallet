# 🧲 Magnet Wallet

Aplicación web de **control de gastos personales**. Permite registrar movimientos (gastos e ingresos), definir un sueldo mensual, asignar presupuestos por categoría y visualizar resúmenes con gráficos, todo organizado por mes. Cada usuario inicia sesión con Google y sus datos quedan aislados en Firestore bajo su propio UID.

**Demo en producción:** hospedada en Firebase Hosting (proyecto `magnet-manage`).

---

## ✨ Funcionalidades

- 🔐 **Autenticación con Google** (Firebase Auth, popup de Google).
- 💰 **Sueldo mensual**: se configura un monto por mes y la app calcula el disponible (`sueldo + ingresos − gastos`).
- 🧾 **Movimientos**: alta y baja de gastos/ingresos con fecha, monto, categoría (agrupadas: Vivienda, Servicios, Alimentación, Transporte, Salud, Ocio, etc.) y nota opcional.
- 📊 **Resumen mensual**: gráficos con Recharts (gastos por categoría, evolución diaria) presentados en un carrusel animado.
- 🎯 **Presupuestos por categoría**: monto objetivo por categoría y mes, comparado contra lo gastado.
- 📅 **Selección de mes**: todo el dashboard (movimientos, sueldo, presupuestos, gráficos) se filtra por el mes elegido.
- 📱 **Diseño responsive**: breakpoints propios para móvil (≤720px), tablet (≤1024px) y escritorio.
- ⚡ **Datos en tiempo real**: suscripciones `onSnapshot` de Firestore; los cambios se reflejan al instante.

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| UI | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build | [Vite 7](https://vite.dev/) con plugin SWC |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com/) + CSS propio (`App.css`, `index.css`) |
| Routing | [React Router DOM 6](https://reactrouter.com/) |
| Gráficos | [Recharts 3](https://recharts.org/) |
| Animaciones | [Motion](https://motion.dev/) (carrusel) + tw-animate-css |
| Iconos | react-icons / lucide-react |
| Backend (BaaS) | [Firebase 12](https://firebase.google.com/): Auth, Firestore, Hosting, Analytics |
| CI/CD | GitHub Actions → Firebase Hosting |
| Linting | ESLint 9 + typescript-eslint |

---

## 📁 Estructura del proyecto

```
magnetwallet/
├── .github/workflows/
│   ├── firebase-hosting-merge.yml         # Deploy a producción al hacer push a main
│   └── firebase-hosting-pull-request.yml  # Deploy de preview en cada PR
├── public/                    # Estáticos (favicon)
├── src/
│   ├── main.tsx               # Punto de entrada; monta React e inicializa Analytics
│   ├── App.tsx                # Router: / (login) y /dashboard, con guardas por sesión
│   ├── pages/
│   │   ├── App.tsx            # Dashboard principal (compone todos los componentes)
│   │   ├── Login.tsx          # Pantalla de bienvenida / inicio de sesión
│   │   └── App.css            # Estilos del dashboard (importa Tailwind)
│   ├── components/
│   │   ├── Header.tsx         # Marca + avatar/sesión del usuario
│   │   ├── SalaryCard.tsx     # Formulario de sueldo mensual
│   │   ├── StatsOverview.tsx  # Tarjetas: sueldo, gastos, disponible, ingresos, balance
│   │   ├── TransactionForm.tsx    # Alta de movimientos
│   │   ├── TransactionsTable.tsx  # Tabla de movimientos del mes (con eliminar)
│   │   ├── MonthlySummary.tsx     # Gráficos del mes (pie, barras, línea)
│   │   ├── BudgetSection.tsx      # Presupuestos por categoría vs. gasto real
│   │   └── Carousel.tsx/.css      # Carrusel animado (Motion) para los gráficos
│   ├── hooks/
│   │   ├── useAuth.ts             # Sesión de Firebase Auth (Google)
│   │   ├── useTransactions.ts     # Suscripción + alta/baja de movimientos y métricas
│   │   ├── useMonthlySalary.ts    # Sueldo del mes seleccionado
│   │   ├── useBudgets.ts          # Presupuestos del mes seleccionado
│   │   ├── useMonthSelection.ts   # Estado del mes/fecha activos
│   │   ├── useTransactionForm.ts  # Estado del formulario de movimientos
│   │   └── useBreakpoint.ts       # Detección móvil/tablet/escritorio
│   ├── services/
│   │   ├── firebase.ts        # Inicialización de Firebase (config vía variables VITE_*)
│   │   ├── transactions.ts    # CRUD + suscripción de movimientos en Firestore
│   │   ├── salary.ts          # Lectura/escritura del sueldo mensual
│   │   └── budgets.ts         # Lectura/escritura de presupuestos
│   ├── lib/
│   │   ├── categories.ts      # Catálogo de categorías de gasto agrupadas
│   │   ├── date.ts            # Utilidades de fechas (YYYY-MM, YYYY-MM-DD)
│   │   ├── transaction-metrics.ts # Totales, agrupación por categoría, gasto diario
│   │   └── utils.ts           # Helper cn() (clsx + tailwind-merge)
│   └── types/
│       └── transaction.ts     # Tipos Transaction / TransactionType
├── firebase.json              # Config de Hosting (sirve dist/, SPA rewrite a index.html)
├── .firebaserc                # Proyecto Firebase por defecto: magnet-manage
├── firestore.rules            # Reglas de seguridad de Firestore
├── firestore.indexes.json     # Índices de Firestore
├── .env.example               # Plantilla de variables de entorno
└── vite.config.ts             # Vite + React SWC + Tailwind + alias "@" → src/
```

---

## 🗄️ Modelo de datos (Firestore)

Todos los datos viven bajo el usuario autenticado — nadie puede leer ni escribir datos de otro UID:

```
users/{uid}/
├── transactions/{txId}
│   └── { date: "YYYY-MM-DD", amount: number, type: "expense"|"income",
│         category: string, note?: string, createdAt: number, createdAtServer: timestamp }
├── salaryByMonth/{YYYY-MM}
│   └── { amount: number, month: "YYYY-MM", updatedAt: number, updatedAtServer: timestamp }
└── budgets/{YYYY-MM}/categories/{categoryId}
    └── { name: string, amount: number, month: "YYYY-MM", updatedAt: number, updatedAtServer: timestamp }
```

Las **reglas de seguridad** ([firestore.rules](firestore.rules)) validan:
- Solo el dueño (`request.auth.uid == userId`) puede leer/escribir sus documentos.
- Formato de fechas (`YYYY-MM-DD`) y meses (`YYYY-MM`).
- Montos positivos, tipos válidos (`expense`/`income`), longitudes máximas de categoría (40) y nota (200).
- Que los documentos no contengan campos extra fuera del esquema.

---

## 🚀 Puesta en marcha local

### Requisitos

- Node.js 20+
- Una cuenta de Firebase con un proyecto creado (o acceso al proyecto `magnet-manage`)

### 1. Clonar e instalar

```bash
git clone https://github.com/i4an/magnetwallet.git
cd magnetwallet
npm install
```

### 2. Configurar variables de entorno

Copia la plantilla y completa los valores desde **Firebase Console → Configuración del proyecto → Tus apps → SDK de Firebase**:

```bash
cp .env.example .env.local
```

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...   # opcional (Analytics)
```

> Estas claves son configuración **pública de cliente** de Firebase (viajan en el bundle JS); la seguridad real la dan las reglas de Firestore y Auth.

### 3. Configurar Firebase Console

1. **Authentication** → habilitar el proveedor **Google**.
2. **Firestore Database** → crear la base de datos (modo producción).
3. Desplegar las reglas de seguridad:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 4. Ejecutar

```bash
npm run dev
```

La app queda en `http://localhost:5173`.

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Type-check (`tsc -b`) + build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | ESLint sobre todo el proyecto |

---

## ☁️ Despliegue

### Automático (CI/CD) — recomendado

El repo despliega solo a **Firebase Hosting** mediante GitHub Actions:

- **Push a `main`** → [firebase-hosting-merge.yml](.github/workflows/firebase-hosting-merge.yml) compila y publica al canal **live**.
- **Pull Request** → [firebase-hosting-pull-request.yml](.github/workflows/firebase-hosting-pull-request.yml) publica un **canal de preview** con URL temporal.

Para que el build de CI funcione, el repo necesita en **Settings → Secrets and variables → Actions**:

- **Variables** (`vars.*`): las 7 `VITE_FIREBASE_*` del `.env.example`.
- **Secret**: `FIREBASE_SERVICE_ACCOUNT_MAGNET_MANAGE` (cuenta de servicio generada por `firebase init hosting:github`).

### Manual

```bash
npm run build
firebase deploy --only hosting
```

`firebase.json` sirve la carpeta `dist/` y reescribe todas las rutas a `index.html` (SPA), por lo que React Router funciona también al recargar la página.

---

## 🔒 Notas de seguridad

- Los archivos `.env.local` / `.env.production` están **ignorados por git**; solo se versiona `.env.example` como plantilla.
- El aislamiento por usuario se garantiza en las reglas de Firestore, no en el cliente.
- Analytics solo se inicializa en builds de producción (`import.meta.env.PROD`).

---

## 👤 Autor

**Ian Tomás Leguizamón** — [@i4an](https://github.com/i4an)
