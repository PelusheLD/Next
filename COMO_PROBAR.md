# Cómo Probar que Next.js está Funcionando

## 1. Verificar que el servidor esté corriendo

El servidor de desarrollo debería estar ejecutándose. Para verificar:

### Opción A: Ver en el navegador
1. Abre tu navegador
2. Ve a: **http://localhost:3000**
3. Deberías ver la página principal de FV Bodegones

### Opción B: Verificar en la terminal
Si el servidor está corriendo, deberías ver algo como:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in Xs
```

## 2. Probar las rutas principales

### Página Principal
- **URL**: http://localhost:3000
- **Qué deberías ver**: La página de inicio con categorías y productos

### Panel de Administración
- **URL**: http://localhost:3000/admin/login
- **Qué deberías ver**: Formulario de login

### API Routes (desde el navegador o Postman)
- **Categorías**: http://localhost:3000/api/categories
- **Productos**: http://localhost:3000/api/products
- **Configuración**: http://localhost:3000/api/settings

## 3. Comandos útiles

### Iniciar el servidor de desarrollo
```bash
npm run dev
```

### Detener el servidor
Presiona `Ctrl + C` en la terminal donde está corriendo

### Verificar errores de TypeScript
```bash
npm run check
```

### Construir para producción
```bash
npm run build
```

### Iniciar servidor de producción
```bash
npm run start
```

## 4. Solución de problemas comunes

### Error: "Port 3000 is already in use"
- Cierra otras aplicaciones que usen el puerto 3000
- O cambia el puerto: `npm run dev -- -p 3001`

### Error: "Module not found"
- Ejecuta: `npm install` de nuevo
- Verifica que todos los archivos se copiaron correctamente

### Error de base de datos
- Verifica que tengas un archivo `.env` con `DATABASE_URL`
- Si no tienes base de datos, el proyecto usará almacenamiento en memoria

### La página muestra errores
- Abre la consola del navegador (F12) para ver errores
- Revisa la terminal donde corre el servidor para errores del servidor

## 5. Verificar que todo funciona correctamente

✅ **Frontend funcionando**: La página carga sin errores en la consola
✅ **API funcionando**: Las rutas `/api/*` devuelven datos JSON
✅ **Navegación funcionando**: Puedes navegar entre páginas
✅ **Autenticación funcionando**: Puedes hacer login en `/admin/login`

## Nota importante

Si es la primera vez que ejecutas el proyecto, asegúrate de tener:
- Node.js instalado (versión 18 o superior)
- Variables de entorno configuradas (archivo `.env` si usas base de datos)
- Todas las dependencias instaladas (`npm install`)



