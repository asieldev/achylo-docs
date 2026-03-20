# 💸 Fees del Marketplace P2P

Las comisiones del módulo P2P financian el sistema de **patrocinio de gas** de Achylo. Cada vez que confirmas una acción on-chain desde la app (crear/aceptar órdenes, liberar fondos, registrar merchants, iniciar disputas, etc.), el protocolo cubre el gas por ti y recupera ese costo con una **tarifa plana en USDC por escrow**. Consulta siempre la sección **Stats** para conocer el valor actualizado (por ejemplo, "Fee por escrow: X USDC").

---

## 🧠 ¿En qué se usan estas comisiones?
- Pago del gas on-chain cuando el usuario firma acciones patrocinadas.
- Mantenimiento y monitoreo del pool de gas para garantizar disponibilidad.
- Sostenimiento del Transaction Guard y otras capas anti-abuso.

> **Importante:** No debes preocuparte por variaciones de gas de la red; Achylo se encarga de cubrirlas mientras mantenga saldo en el pool.

## ⏱️ ¿Cuándo se descuentan los fees?
El contrato de escrow cobra la tarifa **una única vez** al finalizar exitosamente la transacción o al resolverse una disputa. Específicamente, el descuento del monto ocurre en los siguientes casos:

1. **Al completar una compra/venta:** Se descuenta (del monto total en custodia) en el momento exacto en que el vendedor **libera los fondos** al comprador (`releaseFunds`).
2. **Despúes de una disputa:** Si una orden entra en disputa, la comisión se descuenta del monto final antes de ser enviado al ganador (`_resolveDispute`).

*Otras acciones en la plataforma (como crear una orden, solicitar cancelar o registrarse como merchant) **no** tienen cobro de comisión por parte del Escrow.*

---

## 👥 ¿Quién paga y quién está exento?
- El **usuario que ejecuta la acción** paga el fee (por ejemplo, el vendedor cuando libera los fondos al comprador o al aceptar una orden).
- **Usuarios Gold:** están exentos del cobro y disfrutan de 0% en comisiones del protocolo. Puedes obtener el estatus Gold comprando la membresía o a través del sistema de referidos mensualmente. Si eres Gold, el contrato omite la tarifa para tus operaciones.

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
| ¿Quién define el monto? | La Gobernanza (compuesta por usuarios Gold, usuarios con stake y holders); se publica en la página de Stats. |
| ¿Quién lo paga? | El usuario que ejecuta la acción patrocinada, salvo que sea Gold. |
| ¿Para qué sirve? | Cubrir gas on-chain y mantener el servicio de patrocinio. |
| ¿Cuándo se cobra? | En el momento clave de cada flujo (ej. liberar fondos). |
| ¿Puedo evitarlo? | Solo si tienes estatus Gold; de lo contrario se descuenta automáticamente. |

Con este esquema los usuarios disfrutan de transacciones patrocinadas sin preocuparse por el gas ni por cálculos complejos de comisiones variables.