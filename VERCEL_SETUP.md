# Configuración en Vercel

## 📋 Configuración del Proyecto

### 1. Project Name
**Recomendado:** `fv-bodegones` o `fv-bodegon-next`
- Puedes dejar "next" si quieres, pero un nombre más descriptivo es mejor

### 2. Framework Preset
✅ **Ya está correcto:** `Next.js` (detectado automáticamente)

### 3. Root Directory
✅ **Correcto:** `./` (raíz del proyecto)

### 4. Build and Output Settings
**Abre esta sección y verifica:**

**Build Command:**
```
npm run build
```

**Output Directory:**
```
.next
```
(Next.js lo maneja automáticamente, pero verifica que esté así)

**Install Command:**
```
npm install
```

### 5. Environment Variables ⚠️ IMPORTANTE

**Abre "Environment Variables" y agrega:**

#### Variables OBLIGATORIAS:

1. **DATABASE_URL**
   - **Valor:** Tu string de conexión a PostgreSQL
   - **Ejemplo:** `postgresql://usuario:password@host:5432/database?sslmode=require`
   - **Para todos los ambientes:** ✅ Production, ✅ Preview, ✅ Development

2. **JWT_SECRET** (Recomendado)
   - **Valor:** Una cadena aleatoria segura (mínimo 32 caracteres)
   - **Ejemplo:** `tu-clave-secreta-super-segura-aleatoria-123456789`
   - **Para todos los ambientes:** ✅ Production, ✅ Preview, ✅ Development
   - **Nota:** Si no la pones, usará una por defecto (menos seguro)

#### Variables OPCIONALES:

3. **NODE_ENV**
   - **Valor:** `production`
   - **Solo para:** ✅ Production
   - **Nota:** Vercel lo configura automáticamente, pero puedes agregarlo manualmente

## 🚀 Pasos para Desplegar

1. **Configura las variables de entorno** (lo más importante)
2. **Haz clic en "Deploy"**
3. **Espera a que termine el build** (puede tardar 2-5 minutos la primera vez)
4. **¡Listo!** Tu aplicación estará en `tu-proyecto.vercel.app`

## ⚙️ Configuración Adicional Recomendada

### Después del primer deploy:

1. **Custom Domain** (opcional)**
   - Ve a Settings → Domains
   - Agrega tu dominio personalizado

2. **Environment Variables por Ambiente**
   - Puedes tener diferentes valores para Production, Preview y Development
   - Útil si tienes bases de datos diferentes para cada ambiente

## 🔍 Verificar que Funciona

Después del deploy, verifica:
- ✅ La página principal carga: `https://tu-proyecto.vercel.app`
- ✅ El admin funciona: `https://tu-proyecto.vercel.app/admin/login`
- ✅ Las APIs responden: `https://tu-proyecto.vercel.app/api/categories`

## ⚠️ Problemas Comunes

### Error: "DATABASE_URL is not set"
- **Solución:** Agrega la variable `DATABASE_URL` en Environment Variables

### Error: "Build failed"
- **Solución:** Revisa los logs de build en Vercel para ver el error específico

### Error: "Module not found"
- **Solución:** Asegúrate de que `package.json` tenga todas las dependencias necesarias

## 📝 Notas Importantes

- **Base de datos:** Asegúrate de que tu base de datos PostgreSQL permita conexiones desde Vercel (whitelist de IPs si es necesario)
- **SSL:** En producción, la conexión a la BD debe usar SSL
- **Secrets:** Nunca subas `.env` al repositorio, usa Environment Variables de Vercel

