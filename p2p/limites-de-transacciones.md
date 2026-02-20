

#  Límites de Transacciones

Cada nivel de usuario tiene límites específicos por hora y por día para garantizar un uso justo del protocolo y proteger al sistema contra abusos o automatizaciones maliciosas.

---

##  Capas de Protección Activas
- **Anti-ráfaga:** más de **3 transacciones en 10 segundos** activan un enfriamiento automático de **30 segundos**.
- **Detección de duplicados:** acciones idénticas repetidas en un lapso de **5 segundos** se bloquean de forma inmediata.
- **Backoff progresivo:** después de **3 fallos consecutivos**, el tiempo de espera aumenta de manera exponencial hasta un máximo de **2 minutos**.
- **Límites horarios y diarios:** dependen del nivel del usuario y se describen en la tabla siguiente.

---

##  Límites por Nivel
| Nivel de Usuario | Requisitos | Límite por Hora | Límite por Día |
| :--- | :--- | :--- | :--- |
| **Nuevo** | 0 escrows completados | 10 transacciones | 24 transacciones |
| **Activo** | 1+ escrows completados | 20 transacciones | 48 transacciones |
| **Merchant** | Registro y colateral vigente | 30 transacciones | 300 transacciones |
| **Gold** | Cuenta verificada + beneficios Gold | Ilimitado | Ilimitado |

> **Nota:** Los usuarios Gold no tienen límites, pero siguen sujetos a las protecciones anti-abuso instantáneas (anti-ráfaga, duplicados y backoff).

---

##  Acciones Siempre Permitidas
Las siguientes funciones **no consumen** cuota del limitador y están disponibles sin restricciones para todos los niveles:

- Crear escrow privado.
- Aceptar orden pública.
- Liberar fondos.
- Confirmar pago.
- Reclamar fondos.
- Iniciar disputa.
- Votar en disputa.

---

##  Recomendaciones
1. **Planifica tus operaciones:** agrupa acciones similares para evitar disparar el anti-ráfaga.
2. **Evita automatizaciones agresivas:** los scripts que envían múltiples transacciones idénticas en segundos quedarán bloqueados.
3. **Monitorea tus límites:** si alcanzas el límite horario, espera al siguiente intervalo o ajusta tu nivel (por ejemplo, completando escrows para subir a Usuario Activo).

Con estos límites el protocolo mantiene la estabilidad del gas patrocinado y protege tanto a usuarios como a merchants.