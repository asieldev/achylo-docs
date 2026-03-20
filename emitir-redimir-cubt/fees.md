#  Fees y Sobrecolateralización (Mint & Redeem)

Achylo usa una **tarifa plana en porcentaje** para cada flujo y, en el caso del Mint, agrega un componente de **sobrecolateralización** para reforzar el Treasury.

---

##  Tasas base
- **Mint Fee:** `0.5%` sobre el monto en USDC.
- **Redeem Fee:** `1%` sobre el monto en CUBT que canjeas.
- **Overcollateralization (solo Mint):** `1%` del USDC depositado se envía al Treasury como respaldo adicional.

> **Importante:** Estas tasas pueden actualizarse (máximo 10% para las comisiones) y la app siempre muestra el valor vigente en el simulador.

---

##  Cómo se calculan
1. **Mint**
   - Se descuenta primero la comisión (`mintFee`).
   - Luego se resta el 1% destinado a sobrecolateralización (si no estás exento).
   - El monto neto restante se convierte en CUBT.
2. **Redeem**
   - Solo se descuenta la comisión (`redeemFee`).
   - Recibes en USDC el neto calculado por el simulador.

La tarjeta de simulación indica claramente ambos conceptos (`Protocol Fee` y `Overcollateralization`).

---

##  Descuentos y Exenciones
- **Usuarios Gold:** los usuarios con estatus Gold activo en el P2P son exentos automáticamente de todas las comisiones (0% fee). Esta verificación se realiza en tiempo real mediante la consulta al contrato P2PEscrow.
- **Cuentas feeExempt:** exención manual de comisiones (0% fee) configurada por los administradores, independiente del estatus Gold.
- **Staking Activo:** Los usuarios que tienen un stake activo en el contrato reciben automáticamente un 50% de descuento en las comisiones de Mint y Redeem.
- **Holder CUBT:** Los usuarios que poseen al menos 1 CUBT en su wallet reciben un descuento en las comisiones de Mint y Redeem (la configuración actual del contrato otorga un 25% de descuento).

El backend verifica estas condiciones en cada llamada y la dApp refleja el resultado en tiempo real indicándolo en el simulador.

---

##  Sobrecolateralización
- Si no estás exento, el 1% del USDC depositado en Mint se envía al Treasury.
- Esta fracción aparece en el simulador como **Overcollateralization** y no se convierte a CUBT.
- Usuarios feeExempt o con permisos especiales pueden quedar liberados de este componente.

---

##  Actualizaciones dinámicas
Si ves que la comisión efectiva o la sobrecolateralización cambian, es porque:
- El protocolo ajustó las tasas dentro de los límites permitidos.
- Se actualizó tu estado (por ejemplo, obtuviste o perdiste la etiqueta feeExempt / staking / holder).

Siempre revisa el simulador antes de confirmar; ahí tendrás el desglose final aplicado a tu cuenta.