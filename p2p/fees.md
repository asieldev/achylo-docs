# 💸 Fees del Marketplace P2P

Las comisiones del módulo P2P financian el sistema de **patrocinio de gas** de Achylo. Cada vez que confirmas una acción on-chain desde la app (crear/aceptar órdenes, liberar fondos, registrar merchants, iniciar disputas, etc.), el protocolo cubre el gas por ti y recupera ese costo con una **tarifa plana en USDC por escrow**. Consulta siempre la sección **Stats** para conocer el valor actualizado (por ejemplo, "Fee por escrow: X USDC").

---

## 🧠 ¿En qué se usan estas comisiones?
- Pago del gas on-chain cuando el usuario firma acciones patrocinadas.
- Mantenimiento y monitoreo del pool de gas para garantizar disponibilidad.
- Sostenimiento del Transaction Guard y otras capas anti-abuso.

> **Importante:** No debes preocuparte por variaciones de gas de la red; Achylo se encarga de cubrirlas mientras mantenga saldo en el pool.

---

## ⏱️ ¿Cuándo se descuentan los fees?
El contrato de escrow cobra internamente la tarifa cada vez que la acción patrocinada llega a su punto de cobro. Ejemplos típicos:

1. **Al completar una compra/venta:** cuando el vendedor libera los fondos al comprador.
2. **Al cerrar una orden pública con éxito:** el fee se descuenta en la confirmación final.
3. **Otras acciones patrocinadas:** si la lógica requiere gas cubierto por el protocolo, el contrato añade automáticamente la tarifa.

Si la comisión cambia, el backend actualiza la página de Stats para que lo veas antes de interactuar.

---

## 👥 ¿Quién paga y quién está exento?
- El **usuario que ejecuta la acción** paga el fee (por ejemplo, el vendedor cuando libera fondos, el merchant al registrar su colateral, etc.).
- **Usuarios Gold:** definidos por el equipo, están exentos del cobro. Si alguno de los participantes es Gold, el contrato omite la tarifa para esa operación.

---

## 👀 Cómo se muestra en la UI
- Cada modal de acción (Accept Order, Release Funds, Register Merchant, etc.) incluye un resumen donde aparece la tarifa exacta.
- Los tooltips explican el destino del fee y el monto neto que llegará al comprador.
- Si eres Gold o la acción está exenta, la interfaz lo marca con el badge "⭐ Gold User - No protocol fees".

---

## 📏 Estructura de la tarifa
- **Tarifa definida por contrato:** mismo monto para todas las operaciones finalizadas, pueden ser consultados desde Stats > Protocol > P2P Escrow Protocol > Fixed Fee y Percentage Fee. El valor es definido por el protocolo y varia de acuerdo al valor de la orden (Ex: 0.1 USDC para ordenes < 100 USDC y 0.1% para ordenes > 100 USDC).
- **Requisito básico:** estas se descuentan automáticamente desde el contrato cuando se ejecuta alguna acción de compra/venta.

> **Tip:** Antes de liberar fondos o aceptar una orden grande, revisa el panel de Stats para confirmar que el valor "Fee por escrow" no ha cambiado.

---

## 🧾 Resumen rápido
| Pregunta | Respuesta |
| :--- | :--- |
| ¿Quién define el monto? | El equipo de protocolo; se publica en la página de Stats. |
| ¿Quién lo paga? | El usuario que ejecuta la acción patrocinada, salvo que sea Gold. |
| ¿Para qué sirve? | Cubrir gas on-chain y mantener el servicio de patrocinio. |
| ¿Cuándo se cobra? | En el momento clave de cada flujo (ej. liberar fondos). |
| ¿Puedo evitarlo? | Solo si tienes estatus Gold; de lo contrario se descuenta automáticamente. |

Con este esquema los usuarios disfrutan de transacciones patrocinadas sin preocuparse por el gas ni por cálculos complejos de comisiones variables.