# 🚀 GUÍA DE IMPLEMENTACIÓN - LOGO TOOLTRACK

## 📋 PASO 1: PREPARAR LOS ARCHIVOS (2 minutos)

### 1.1 Crear carpeta para logos
```bash
# En la raíz de tu proyecto ToolTrack
cd C:\Users\TuUsuario\tooltrack-frontend
mkdir public\assets
```

### 1.2 Copiar archivos SVG
Copia estos 6 archivos a la carpeta `public/assets/`:
- ✅ tooltrack-logo-header-dark.svg
- ✅ tooltrack-logo-header-light.svg
- ✅ tooltrack-favicon.svg
- ✅ tooltrack-logo-presentation.svg
- ✅ tooltrack-icon-only.svg
- ✅ tooltrack-monogram.svg

---

## 📋 PASO 2: ACTUALIZAR EL NAVBAR (5 minutos)

### 2.1 Ubicar tu archivo Navbar
Encuentra tu archivo: `src/components/Navbar.jsx`

### 2.2 CÓDIGO COMPLETO DEL NAVBAR

**REEMPLAZA** tu componente Navbar actual con este código:

```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ userName, userRole, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#0a4d4e',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* LOGO NUEVO - AQUÍ ESTÁ EL CAMBIO PRINCIPAL */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="/assets/tooltrack-logo-header-dark.svg" 
          alt="ToolTrack" 
          style={{ 
            height: '50px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/dashboard')}
        />
      </div>

      {/* Información del usuario */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        color: '#ffffff'
      }}>
        <span style={{ 
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {userName} ({userRole})
        </span>
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#14b8a6',
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0d9488'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#14b8a6'}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
```

### 2.3 ¿Qué cambió?
- ✅ Línea 22-31: Ahora usa el nuevo logo SVG
- ✅ El logo es clickeable y te lleva al dashboard
- ✅ Se mantiene toda tu lógica de logout

---

## 📋 PASO 3: ACTUALIZAR EL FAVICON (2 minutos)

### 3.1 Ubicar el archivo
Encuentra: `public/index.html`

### 3.2 CÓDIGO PARA EL FAVICON

**BUSCA** esta línea en tu `index.html`:
```html
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
```

**REEMPLÁZALA** con estas líneas:
```html
<!-- Favicon nuevo de ToolTrack -->
<link rel="icon" type="image/svg+xml" href="%PUBLIC_URL%/tooltrack-favicon.svg" />
<link rel="apple-touch-icon" href="%PUBLIC_URL%/tooltrack-favicon.svg" />
```

### 3.3 También copia el favicon a public/
```bash
# Copia tooltrack-favicon.svg a:
# public/tooltrack-favicon.svg (raíz de public, NO en assets)
```

---

## 📋 PASO 4: ACTUALIZAR LA LANDING PAGE (Opcional - 3 minutos)

### 4.1 Si tienes una landing page
Ubica: `src/pages/LandingPage.jsx` o similar

### 4.2 CÓDIGO PARA LA HERO SECTION

**BUSCA** tu sección hero/principal y **AGREGA** el logo:

```jsx
<div className="hero-section" style={{
  textAlign: 'center',
  padding: '80px 20px',
  backgroundColor: '#f8fafc'
}}>
  {/* Logo de presentación */}
  <img 
    src="/assets/tooltrack-logo-presentation.svg" 
    alt="ToolTrack - Gestión Inteligente de Herramientas" 
    style={{ 
      maxWidth: '400px',
      width: '100%',
      marginBottom: '30px'
    }}
  />
  
  <h1 style={{
    fontSize: '48px',
    fontWeight: '700',
    color: '#0a4d4e',
    marginBottom: '20px'
  }}>
    Control total de tus herramientas
  </h1>
  
  {/* Resto de tu contenido... */}
</div>
```

---

## 📋 PASO 5: VERIFICAR LA IMPLEMENTACIÓN (2 minutos)

### 5.1 Iniciar el servidor
```bash
npm start
```

### 5.2 Checklist de verificación
- ✅ El logo aparece en el navbar (arriba a la izquierda)
- ✅ El logo tiene los colores teal correctos
- ✅ El favicon aparece en la pestaña del navegador
- ✅ El logo es clickeable y navega al dashboard
- ✅ Los colores coinciden con tu diseño

---

## 🎨 PASO 6: AJUSTES OPCIONALES

### 6.1 Cambiar el tamaño del logo en el navbar

Si el logo se ve muy grande o pequeño, cambia esta línea:
```jsx
style={{ height: '50px' }}  // Cambia a 40px, 60px, etc.
```

### 6.2 Agregar animación hover al logo

```jsx
<img 
  src="/assets/tooltrack-logo-header-dark.svg" 
  alt="ToolTrack" 
  style={{ 
    height: '50px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease'
  }}
  onClick={() => navigate('/dashboard')}
  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
/>
```

---

## 📱 PASO 7: PARA TU PRESENTACIÓN SENA

### 7.1 Usar en PowerPoint/Google Slides
1. Abre `tooltrack-logo-presentation.svg` en tu navegador
2. Click derecho > Guardar imagen como > PNG
3. Inserta en tu presentación

### 7.2 Usar en documentos Word
1. Inserta > Imagen > `tooltrack-logo-presentation.svg`
2. El logo se verá perfecto a cualquier tamaño (vectorial)

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: "No se ve el logo en el navbar"
**Solución:**
```bash
# Verifica que los archivos estén en:
public/assets/tooltrack-logo-header-dark.svg
public/tooltrack-favicon.svg

# Reinicia el servidor:
Ctrl + C
npm start
```

### Problema 2: "El favicon no cambia"
**Solución:**
```bash
# Limpia la caché del navegador:
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### Problema 3: "El logo se ve pixelado"
**Solución:**
Los SVG nunca se pixelan. Si se ve mal:
- Verifica que estés usando el archivo .svg y no .png
- Usa el archivo correcto: tooltrack-logo-header-dark.svg

---

## ✅ CHECKLIST FINAL

Antes de dar por terminada la implementación:

- [ ] ✅ Archivos SVG copiados a public/assets/
- [ ] ✅ Favicon copiado a public/
- [ ] ✅ Navbar.jsx actualizado con el nuevo logo
- [ ] ✅ index.html actualizado con el favicon
- [ ] ✅ Servidor reiniciado (npm start)
- [ ] ✅ Logo visible en el navbar
- [ ] ✅ Favicon visible en la pestaña
- [ ] ✅ Logo clickeable funciona
- [ ] ✅ Colores teal correctos
- [ ] ✅ Commit a GitHub realizado

---

## 🎯 COMANDO PARA COMMIT A GITHUB

```bash
git add .
git commit -m "feat: Implementar nuevo logo ToolTrack con paleta teal"
git push origin main
```

---

## 📞 SIGUIENTE PASO

Si todo funciona correctamente:
1. ✅ Toma screenshots para tu presentación SENA
2. ✅ Prepara la demo mostrando el logo nuevo
3. ✅ Menciona en tu presentación: "Logo profesional con identidad visual coherente"

**¡Tu ToolTrack ya tiene su identidad visual profesional! 🎉**
