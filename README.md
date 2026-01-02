# MagnetWallet

Aplicativo personal para registrar gastos/ingresos con gráficas, usando:
- Vite + React + TypeScript
- Firebase Hosting
- Firebase Auth (Google)
- Firestore (datos por usuario)
- Recharts (gráficas)

## 1) Configuración local

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Crea un archivo `.env.local` (puedes copiar `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

3. Ejecuta en desarrollo:
   ```bash
   npm run dev
   ```

## 2) Configuración en Firebase Console

1. Authentication → Sign-in method → habilita **Google**
2. Firestore Database → Create database (modo producción recomendado)

## 3) Deploy a Firebase Hosting

```bash
npm run build
firebase deploy
```

## 4) Estructura de datos

Se guarda por usuario:
- `users/{uid}/transactions`

Documento:
- `date` (YYYY-MM-DD)
- `amount` (number)
- `type` ("expense" | "income")
- `category` (string)
- `note` (string opcional)
- `createdAt` (number)


## Reglas de Firestore (incluidas en el repo)

Este repo incluye `firestore.rules` para que cada usuario solo pueda leer/escribir sus propios documentos en `/users/{uid}`.

Al hacer `firebase deploy`, también se despliegan las reglas e índices (si Firestore está habilitado).
