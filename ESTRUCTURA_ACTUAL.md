# Estructura Actual del Proyecto Next.js

## ✅ Carpetas que SÍ se usan (Next.js):

### `/app` - Aplicación Next.js
- `app/page.tsx` - Página principal
- `app/layout.tsx` - Layout principal
- `app/admin/` - Panel de administración
- `app/api/` - **Todas las rutas de API están aquí** (reemplazan a `server/routes.ts`)

### `/lib` - Utilidades y lógica compartida
- `lib/db.ts` - Conexión a base de datos
- `lib/auth.ts` - Autenticación
- `lib/storage.ts` - Lógica de almacenamiento
- `lib/storage-pg.ts` - Implementación PostgreSQL
- `lib/queryClient.ts` - Configuración React Query
- `lib/utils.ts` - Utilidades (cn function)
- `lib/searchUtils.ts` - Búsqueda de productos

### `/components` - Componentes React
- `components/` - Todos los componentes (copiados desde `client/src/components`)
- `components/admin/` - Componentes del panel admin
- `components/ui/` - Componentes de UI (shadcn/ui)

### `/contexts` - Contextos React
- `contexts/CurrencyContext.tsx`
- `contexts/DollarRateContext.tsx`

### `/hooks` - Hooks personalizados
- `hooks/use-toast.ts`
- `hooks/use-mobile.tsx`

### `/shared` - Código compartido
- `shared/schema.ts` - Esquemas de base de datos (Drizzle)

### `/public` - Archivos estáticos
- `public/uploads/` - Imágenes subidas
- `public/logo.png`, `public/fondo.png`

## ❌ Carpetas que NO se usan (pueden eliminarse):

### `/server` - Backend antiguo (Express)
- ❌ `server/index.ts` - Reemplazado por Next.js
- ❌ `server/routes.ts` - Reemplazado por `app/api/`
- ❌ `server/auth.ts` - Reemplazado por `lib/auth.ts`
- ❌ `server/db.ts` - Reemplazado por `lib/db.ts`
- ❌ `server/storage.ts` - Reemplazado por `lib/storage.ts`
- ⚠️ `server/seed.ts` - **ÚNICA EXCEPCIÓN**: Se usa en script `npm run seed`

### `/client` - Frontend antiguo (Vite + React)
- ❌ `client/src/` - Todo migrado a `/app` y `/components`
- ❌ `client/index.html` - No se usa en Next.js
- ❌ `vite.config.ts` - Reemplazado por `next.config.js`

## 📝 Nota sobre `server/seed.ts`

El único archivo que aún referencia `server/` es:
- `package.json` línea 13: `"seed": "tsx server/seed.ts"`

**Opciones:**
1. **Mover** `server/seed.ts` a `lib/seed.ts` y actualizar el script
2. **Dejar** como está si solo se usa ocasionalmente para poblar la BD

## 🧹 Limpieza Recomendada

Puedes eliminar estas carpetas/archivos de forma segura:
- ✅ `/server` (excepto `seed.ts` si lo quieres mantener)
- ✅ `/client`
- ✅ `vite.config.ts`
- ✅ Archivos de documentación antigua (opcional)

**IMPORTANTE:** Antes de eliminar, asegúrate de:
1. Hacer un backup
2. Verificar que todo funciona correctamente
3. Si usas `seed.ts`, moverlo primero a `lib/`



