# FV Bodegones - Next.js

Aplicación web completa para FV Bodegones, migrada a **Next.js 14** con frontend y backend unificados.

## 🚀 Características

- ✅ **Next.js 14** con App Router
- ✅ **Frontend y Backend unificados** - Todo en un solo servidor
- ✅ **TypeScript** - Tipado estático
- ✅ **Drizzle ORM** - Gestión de base de datos
- ✅ **PostgreSQL** - Base de datos (con soporte para almacenamiento en memoria)
- ✅ **Autenticación JWT** - Sistema de autenticación seguro
- ✅ **Panel de Administración** - Gestión completa de productos, categorías, pedidos
- ✅ **Tailwind CSS** - Estilos modernos
- ✅ **shadcn/ui** - Componentes de UI

## 📋 Prerrequisitos

- Node.js 18 o superior
- PostgreSQL (opcional, puede usar almacenamiento en memoria para desarrollo)
- npm o yarn

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/PelusheLD/Next.git
cd Next

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones (DATABASE_URL, JWT_SECRET, etc.)
```

## 🚀 Uso

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
- `npm run lint` - Ejecutar linter
- `npm run check` - Verificar tipos TypeScript
- `npm run seed` - Poblar base de datos con datos iniciales
- `npm run db:push` - Aplicar migraciones de base de datos

## 📁 Estructura del Proyecto

```
├── app/                    # Aplicación Next.js
│   ├── api/               # Rutas de API
│   │   ├── admin/         # Rutas de administración
│   │   ├── auth/          # Autenticación
│   │   ├── categories/    # Categorías
│   │   ├── products/      # Productos
│   │   ├── orders/        # Pedidos
│   │   └── ...
│   ├── admin/             # Panel de administración
│   ├── page.tsx           # Página principal
│   └── layout.tsx         # Layout principal
├── lib/                    # Utilidades y lógica
│   ├── db.ts              # Conexión a base de datos
│   ├── auth.ts            # Autenticación
│   ├── storage.ts         # Lógica de almacenamiento
│   └── ...
├── components/             # Componentes React
│   ├── admin/             # Componentes del panel admin
│   └── ui/                # Componentes de UI (shadcn/ui)
├── contexts/               # Contextos React
├── hooks/                  # Hooks personalizados
├── shared/                 # Código compartido
│   └── schema.ts          # Esquemas de base de datos
└── public/                 # Archivos estáticos
```

## 🔐 Autenticación

El sistema usa autenticación JWT. Para acceder al panel de administración:

1. Ve a `/admin/login`
2. Usuario por defecto: `admin`
3. Contraseña por defecto: `admin123`

**⚠️ IMPORTANTE:** Cambia las credenciales por defecto en producción.

## 📚 Documentación Adicional

- `COMO_PROBAR.md` - Cómo probar que Next.js funciona
- `ESTRUCTURA_ACTUAL.md` - Estructura detallada del proyecto
- `INSTRUCCIONES.md` - Instrucciones de uso
- `README_NEXTJS.md` - Información sobre la migración

## 🗄️ Base de Datos

El proyecto usa Drizzle ORM con PostgreSQL. Las migraciones están en `/migrations`.

Para aplicar migraciones:
```bash
npm run db:push
```

Para poblar con datos iniciales:
```bash
npm run seed
```

## 🚢 Despliegue

El proyecto está listo para desplegar en:
- **Vercel** (recomendado para Next.js)
- **Render**
- **Railway**
- Cualquier plataforma que soporte Node.js

Asegúrate de configurar las variables de entorno en tu plataforma de despliegue.

## 📄 Licencia

MIT

## 👥 Contribuidores

- PelusheLD

## 🔗 Enlaces

- Repositorio: https://github.com/PelusheLD/Next.git
