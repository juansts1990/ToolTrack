# 🚀 MODELO DE NEGOCIO - TOOLTRACK

## 📊 ¿CÓMO FUNCIONA EL NEGOCIO?

### 🎯 CLIENTE OBJETIVO
Empresas de 10-50 empleados en:
- Construcción
- Talleres mecánicos  
- Mantenimiento industrial

### 💰 MODELO DE SUSCRIPCIÓN

#### Plan Básico - $40,000/mes
- Hasta 20 empleados
- 100 herramientas
- Sistema QR completo
- Dashboard básico
- Soporte por email

#### Plan Estándar - $65,000/mes ⭐ RECOMENDADO
- Hasta 35 empleados
- 300 herramientas
- Sistema QR completo
- Dashboard avanzado
- Soporte prioritario
- Reportes avanzados
- Modo offline

#### Plan Avanzado - $90,000/mes
- Hasta 50 empleados
- Herramientas ilimitadas
- Sistema QR completo
- Dashboard premium
- Soporte 24/7
- Reportes personalizados
- API personalizada

---

## 🔄 FLUJO OPERATIVO COMPLETO

### FASE 1: CONTRATACIÓN (Una sola vez)

**Paso 1 - Cliente encuentra ToolTrack**
- Visita landing page (localhost:5173/)
- Ve planes, FAQ, contacto
- Puede agendar demo o empezar gratis

**Paso 2 - Registro**
- Llena formulario con datos de empresa
- Selecciona plan (Básico, Estándar, o Avanzado)
- 2 meses gratis para probar

**Paso 3 - Pago**
- Después de 2 meses, se cobra mensualmente
- Métodos: Transferencia, tarjeta, PSE
- Se puede cambiar de plan en cualquier momento

---

### FASE 2: CONFIGURACIÓN INICIAL (Primera semana)

**Paso 1 - Ingresar Herramientas**
Supervisor ingresa al sistema cada herramienta:

```
Ejemplo:
Nombre: TALADRO ELECTRICO DEWALT DCD771
Serial: TAL-DEW-01
Estado: Disponible
Fecha compra: 15/01/2024
Mantenimiento 1: 15/04/2024
Mantenimiento 2: 15/07/2024
Mantenimiento 3: 15/10/2024
Garantía hasta: 15/01/2027
```

El sistema automáticamente:
- ✅ Genera código QR único: `HERR-TAL01`
- ✅ Programa alertas de mantenimiento
- ✅ Guarda en base de datos

**Paso 2 - Ingresar Empleados**
Supervisor ingresa cada empleado:

```
Ejemplo:
Nombre: Pedro Sandoval
Identificación: 18200018
Sección: V.CAÑERO NUEVO
```

El sistema automáticamente:
- ✅ Genera código QR único: `EMP-18200018`
- ✅ Asocia a su sección
- ✅ Habilita para préstamos

**Paso 3 - Imprimir Códigos QR**
- Sistema genera PDF con todos los QR
- Se imprimen etiquetas adhesivas
- Se pegan en herramientas y tarjetas de empleados

---

### FASE 3: OPERACIÓN DIARIA (Día a día)

#### 🔵 PRÉSTAMO DE HERRAMIENTA

**Escenario:** Pedro necesita el taladro para trabajar

**1. Empleado solicita herramienta**
```
Pedro: "Necesito el taladro Dewalt"
Supervisor: "Ok, vamos a registrarlo"
```

**2. Supervisor escanea QR de herramienta**
```
[Escanea código QR del taladro]
Sistema muestra:
- Nombre: TALADRO DEWALT DCD771
- Estado: Disponible ✅
- Último uso: Juan García (hace 2 días)
```

**3. Supervisor escanea QR de empleado**
```
[Escanea código QR de tarjeta de Pedro]
Sistema muestra:
- Nombre: Pedro Sandoval
- Sección: V.CAÑERO NUEVO
- Herramientas activas: 2
```

**4. Confirma préstamo**
```
[Botón: Registrar Préstamo]

Sistema registra automáticamente:
✅ Herramienta: TALADRO DEWALT DCD771
✅ Empleado: Pedro Sandoval
✅ Fecha/hora: 28/12/2024 08:45 AM
✅ Estado herramienta → "En uso"
✅ Sección: V.CAÑERO NUEVO
```

**5. Dashboard se actualiza**
```
Préstamos Activos: 24 → 25
Herramientas Disponibles: 100 → 99
```

---

#### 🟢 DEVOLUCIÓN DE HERRAMIENTA

**Escenario:** Pedro termina su trabajo y devuelve el taladro

**1. Empleado devuelve herramienta**
```
Pedro: "Ya terminé, aquí está el taladro"
Supervisor: "Perfecto, lo registro"
```

**2. Supervisor escanea QR de herramienta**
```
[Escanea código QR del taladro]
Sistema muestra:
- Nombre: TALADRO DEWALT DCD771
- Estado: En uso con Pedro Sandoval
- Prestado hace: 4 horas 23 minutos
```

**3. Supervisor escanea QR de empleado**
```
[Escanea código QR de Pedro]
Sistema muestra:
- Pedro Sandoval
- Herramientas activas: 3
  - Taladro Dewalt (4h 23m)
  - Pistola neumática (2h 10m)
  - Llave inglesa (1h 05m)
```

**4. Confirma devolución**
```
[Botón: Registrar Devolución]

Sistema registra automáticamente:
✅ Herramienta devuelta: TALADRO DEWALT DCD771
✅ Empleado: Pedro Sandoval
✅ Fecha/hora devolución: 28/12/2024 13:08 PM
✅ Tiempo de uso: 4 horas 23 minutos
✅ Estado herramienta → "Disponible"
✅ Historial actualizado
```

**5. Dashboard se actualiza**
```
Préstamos Activos: 25 → 24
Herramientas Disponibles: 99 → 100
```

---

#### 🔴 ALERTAS AUTOMÁTICAS

**Alerta 1 - Herramienta no devuelta**
```
Sistema detecta:
- Herramienta: Pistola neumática
- Empleado: Juan García
- Prestada hace: 48 horas
- Jornada normal: 8 horas

[Envía alerta automática]
📧 Email al supervisor: "Herramienta en préstamo >48h"
📱 SMS a Juan: "Favor devolver pistola neumática"
```

**Alerta 2 - Mantenimiento próximo**
```
Sistema detecta:
- Herramienta: Taladro Dewalt
- Mantenimiento programado: 15/01/2025
- Días restantes: 15 días

[Envía alertas escalonadas]
📧 15 días antes: "Programar mantenimiento"
📧 7 días antes: "Mantenimiento próximo"
📧 3 días antes: "URGENTE: Mantenimiento en 3 días"
```

**Alerta 3 - Garantía próxima a vencer**
```
Sistema detecta:
- Herramienta: Sierra circular Bosch
- Garantía vence: 20/02/2025
- Días restantes: 45 días

[Envía alerta]
📧 Al administrador: "Garantía vence pronto - aprovechar si hay fallas"
```

---

## 📊 REPORTES Y ANÁLISIS

### Reporte Semanal
```
RESUMEN SEMANAL (23-29 DIC 2024)

Préstamos realizados: 156
Devoluciones a tiempo: 148 (94.8%)
Devoluciones tardías: 8 (5.2%)

Top 5 herramientas más usadas:
1. Taladro Dewalt - 24 veces
2. Pistola neumática - 18 veces
3. Llave inglesa - 15 veces
4. Martillo Stanley - 12 veces
5. Sierra circular - 11 veces

Empleados más activos:
1. Pedro Sandoval - 15 préstamos
2. Juan García - 12 préstamos
3. Carlos Ramírez - 10 préstamos
```

### Reporte Mensual
```
RESUMEN MENSUAL (DIC 2024)

Inversión en herramientas: $45,000,000
Pérdidas por mal manejo: $850,000 (1.9%)
Ahorro vs método manual: $2,300,000

Mantenimientos realizados: 18
Mantenimientos pendientes: 6
Garantías aprovechadas: 3 ($8,500,000 ahorrado)

ROI del sistema: 350%
```

---

## 💡 VENTAJAS PARA LA EMPRESA

### SIN ToolTrack (Método manual)
❌ Herramientas perdidas: $8-12M/año
❌ Tiempo de supervisión: 55 min/día
❌ Mantenimientos olvidados: 40%
❌ Garantías perdidas: $2-8M
❌ Sin trazabilidad de quién tiene qué
❌ Papeleos y Excel desorganizados

### CON ToolTrack
✅ Pérdidas reducidas: -60% ($5M/año ahorrado)
✅ Tiempo de supervisión: 5 min/día (50 min ahorrados)
✅ Mantenimientos al día: 95%
✅ Garantías aprovechadas: 100%
✅ Trazabilidad completa en tiempo real
✅ Base de datos digital organizada
✅ Reportes automáticos

**AHORRO ANUAL: $7-10 MILLONES**
**COSTO SISTEMA: $780,000/año (plan estándar)**
**ROI: 900% - 1,200%**

---

## 🎯 PREGUNTAS FRECUENTES OPERATIVAS

### ¿Qué pasa si se pierde el código QR de una herramienta?
- Se puede reimprimir desde el sistema
- Se puede registrar manualmente con búsqueda

### ¿Funciona sin internet en obra?
- Sí, modo offline en planes Estándar y Avanzado
- Se sincroniza automáticamente al conectarse

### ¿Cuánto tarda un préstamo/devolución?
- 8 segundos en promedio
- 2 escaneos (herramienta + empleado) + 1 click

### ¿Se puede prestar la misma herramienta a varios empleados?
- No, hasta que no se devuelva
- Sistema bloquea préstamos duplicados

### ¿Qué pasa si un empleado renuncia?
- Se desactiva su QR
- Se registran todas sus herramientas pendientes
- Se transfieren a otro empleado

### ¿Se puede usar en múltiples obras simultáneas?
- Sí, se crean "secciones" por obra
- Cada sección tiene su supervisor
- Dashboard consolidado

---

## 📈 ESCALABILIDAD

### Empresa con 10 empleados
- Plan Básico: $40,000/mes
- Ahorro estimado: $5M/año
- ROI: 1,000%

### Empresa con 30 empleados  
- Plan Estándar: $65,000/mes
- Ahorro estimado: $8M/año
- ROI: 1,100%

### Empresa con 50 empleados
- Plan Avanzado: $90,000/mes
- Ahorro estimado: $12M/año
- ROI: 1,200%

---

## 🔐 SEGURIDAD

✅ Códigos QR únicos e irrepetibles
✅ Historial completo e inmodificable
✅ Respaldos automáticos diarios
✅ Encriptación de datos
✅ Acceso por roles (admin, supervisor, operario)

---

¡Así funciona ToolTrack! Simple, rápido y efectivo. 🚀
