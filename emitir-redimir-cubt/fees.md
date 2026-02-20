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

##  Descuentos automáticos
- **Cuentas feeExempt:** no pagan comisiones.
- **Staking activo:** reduce la tarifa al 50% (Mint ≈ 0.25%, Redeem ≈ 0.5%).
- **Holder ≥ 1 CUBT:** reduce la tarifa al 75% (Mint ≈ 0.375%, Redeem ≈ 0.75%).

El backend verifica estas condiciones en cada llamada y la dApp refleja el resultado en tiempo real.

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