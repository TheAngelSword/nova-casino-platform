# Anexo Testing / QA para NOVA Casino Studio

## Objetivo
Crear un módulo operativo para controlar la fase de pruebas de cada juego desde la planeación hasta la corrección y revalidación de bugs.

## Funciones principales del módulo

### 1. Registro de tester
- Nombre del tester.
- Usuario/correo.
- Especialidad.
- Nivel de experiencia.
- Estado activo/inactivo.

### 2. Horario laborado
- Fecha de sesión.
- Hora inicio.
- Hora fin.
- Horas trabajadas.
- Build probado.
- Ambiente usado.
- Juego revisado.
- Alcance de revisión.
- Notas generales.

### 3. Qué revisó
Cada sesión debe indicar exactamente qué se probó:
- Flujo de apuesta.
- Denominación y créditos.
- Resultado de jugada.
- Tabla de pagos.
- Matemática/RTP.
- Volatilidad.
- Bonus.
- Jackpot.
- Arte integrado.
- Animaciones.
- Música y SFX.
- Logs.
- Recuperación después de apagado.
- Cashout.
- Sistema de caja.
- SAS/AFT.
- Homologación.

### 4. Reporte de bugs
Cada bug debe registrar:
- Juego.
- Build.
- Ambiente.
- Título.
- Descripción.
- Pasos para reproducir.
- Resultado esperado.
- Resultado real.
- Severidad.
- Prioridad.
- Área responsable.
- Responsable asignado.
- Evidencia.
- Estado.

### 5. Revisión de responsables
Programador, diseñador, artista, matemático o audio designer deben poder revisar cada bug y marcar:
- Aceptado.
- Rechazado.
- Duplicado.
- No reproducible.
- Corregido.
- Requiere más información.
- Versión de corrección.
- Commit o build donde se corrigió.

## Estados recomendados

### Bugs
- Abierto.
- Asignado.
- En corrección.
- Corregido.
- En revalidación.
- Cerrado.
- Rechazado.
- Duplicado.
- No reproducible.

### Casos de prueba
- Pendiente.
- En proceso.
- Aprobado.
- Fallido.
- Bloqueado.
- Requiere revisión.
- Revalidado.

### Sesiones
- Abierta.
- En revisión.
- Cerrada.

## Métricas del dashboard de testing
- Casos totales.
- Casos ejecutados.
- Casos aprobados.
- Casos fallidos.
- Bugs abiertos.
- Bugs críticos.
- Bugs por juego.
- Bugs por área.
- Bugs por severidad.
- Tiempo promedio de corrección.
- Bugs reabiertos.
- Sesiones por tester.
- Horas trabajadas por tester.

## Checklist mínimo por juego
1. Instalación del build.
2. Carga inicial.
3. Flujo de apuesta.
4. Créditos y denominación.
5. Resultados.
6. Tabla de pagos.
7. Eventos de premio.
8. Bonus/free games.
9. Jackpot.
10. Audio.
11. Arte.
12. Animaciones.
13. Logs.
14. Errores controlados.
15. Cashout.
16. Recuperación por apagado.
17. Sesión/tarjeta.
18. Integración caja/SAS/AFT.
19. Simulación estadística.
20. Evidencias.

## Recomendación de implementación
Agregar una sección `Testing / QA` al menú principal y usar tablas dedicadas para sesiones, casos de prueba, ejecuciones, bugs y revisiones.
