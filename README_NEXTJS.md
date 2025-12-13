# FV Bodegones - Versión Next.js

Este es el repositorio de respaldo de la migración completa de FV Bodegones a Next.js.

## 🚀 Migración Completada

Este proyecto ha sido migrado exitosamente de una arquitectura separada (Express + Vite) a **Next.js 14** con App Router, donde el frontend y backend corren juntos en un solo servidor.

## ✨ Características de la Migración

- ✅ **Frontend y Backend unificados** - Todo corre en un solo servidor Next.js
- ✅ **App Router** - Usando la última arquitectura de Next.js
- ✅ **API Routes** - Todas las rutas de API migradas a `/app/api`
- ✅ **Componentes React** - Todos los componentes funcionando
- ✅ **Base de datos** - Drizzle ORM configurado
- ✅ **Autenticación** - Sistema de autenticación JWT funcionando
- ✅ **Panel Admin** - Panel de administración completamente funcional

## 📁 Estructura del Proyecto

```
FV-Bodegon/
├── app/                    # Aplicación Next.js
│   ├── api/               # Rutas de API (reemplazan server/routes.ts)
│   ├── admin/             # Panel de administración
│   ├── page.tsx           # Página principal
│   └── layout.tsx         # Layout principal
├── lib/                    # Utilidades y lógica compartida
│   ├── db.ts              # Conexión a base de datos
│   ├── auth.ts            # Autenticación
│   ├── storage.ts         # Lógica de almacenamiento
│   └── ...
├── components/             # Componentes React
├── contexts/               # Contextos React
├── hooks/                  # Hooks personalizados
└── shared/                 # Esquemas de base de datos
```

## 🛠️ Instalación y Uso

### Prerrequisitos

- Node.js 18 o superior
- Base de datos PostgreSQL (opcional, puede usar almacenamiento en memoria)

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

### Producción

```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run seed` - Poblar base de datos con datos iniciales
- `npm run db:push` - Aplicar migraciones de base de datos

## 🔄 Cambios Principales

### Antes (Arquitectura Separada)
- `server/` - Backend Express
- `client/` - Frontend Vite + React
- Dos servidores separados

### Ahora (Next.js Unificado)
- `app/` - Frontend y Backend en Next.js
- `app/api/` - Rutas de API
- Un solo servidor

## 📚 Documentación Adicional

- `COMO_PROBAR.md` - Cómo probar que Next.js funciona
- `ESTRUCTURA_ACTUAL.md` - Estructura detallada del proyecto
- `INSTRUCCIONES.md` - Instrucciones de uso

## 🔗 Repositorio Original

Este es un respaldo de la migración. El repositorio original está en:
https://github.com/PelusheLD/FV-Bodegon

## 📄 Licencia

MIT

