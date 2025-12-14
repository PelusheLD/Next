# Instrucciones para Ejecutar Next.js

## ⚠️ IMPORTANTE: Debes estar en el directorio correcto

El proyecto está en: `C:\Users\Giezy\Desktop\Nueva carpeta\FV-Bodegon`

## Pasos para ejecutar:

### 1. Abre tu terminal (Git Bash, PowerShell, o CMD)

### 2. Navega al directorio del proyecto:

**En Git Bash:**
```bash
cd "/c/Users/Giezy/Desktop/Nueva carpeta/FV-Bodegon"
```

**En PowerShell:**
```powershell
cd "C:\Users\Giezy\Desktop\Nueva carpeta\FV-Bodegon"
```

**En CMD:**
```cmd
cd "C:\Users\Giezy\Desktop\Nueva carpeta\FV-Bodegon"
```

### 3. Verifica que estás en el lugar correcto:

**En Git Bash:**
```bash
ls package.json
```

**En PowerShell/CMD:**
```powershell
Test-Path package.json
# o
dir package.json
```

Si ves el archivo, estás en el lugar correcto ✅

### 4. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

### 5. Abre tu navegador:

Ve a: **http://localhost:3000**

## Solución de problemas:

### Error: "Could not read package.json"
- **Causa**: Estás en el directorio incorrecto
- **Solución**: Asegúrate de estar en `FV-Bodegon`, no en `Nueva carpeta`

### Error: "module is not defined"
- **Solución**: Ya está corregido, pero si persiste, verifica que `next.config.js` use `export default`

### Error: "Port 3000 is already in use"
- **Solución**: Cierra otras aplicaciones o usa otro puerto: `npm run dev -- -p 3001`

## Comandos útiles:

```bash
# Verificar que estás en el directorio correcto
pwd  # (Git Bash) o Get-Location (PowerShell)

# Ver archivos del directorio
ls    # (Git Bash) o dir (PowerShell/CMD)

# Instalar dependencias (si es necesario)
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Detener el servidor
Ctrl + C
```



