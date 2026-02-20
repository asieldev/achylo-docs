# 🌱 Mint CUBT

Guía para depositar **USDC** y recibir **CUBT** usando la pestaña **Mint** del módulo “Mint & Redeem”.

---

## ✅ Requisitos previos
- Wallet conectada en la red correcta (**Base** o **Base Sepolia**).
- Saldo USDC suficiente y allowance disponible para el contrato de Mint (se gestiona automáticamente si usas el botón **Approve & Mint**).

---

## 🧩 Paso a paso
1. **Ingresa el monto**: en la pestaña Mint escribe cuántos USDC quieres depositar. Usa los botones rápidos del 25 %, 50 %, 75 % o 100 % para completar el campo según tu balance.
2. **Analiza el simulador**: la tarjeta de simulación muestra
   - CUBT estimado a recibir (neto).
   - Comisión efectiva según tus descuentos activos.
   - Porción de sobrecolateralización que irá al Treasury si aplica.
3. **Aprueba y mintea**:
   - Si es la primera vez o tu allowance es bajo, pulsa **Approve & Mint**. La dApp enviará la aprobación y, una vez confirmada, lanzará el minteo (dos pasos automáticos).
   - Si ya tenías allowance suficiente, basta con presionar **Mint** para ejecutar una sola transacción.
4. **Confirma en tu wallet**: acepta las transacciones en MetaMask (u otra wallet compatible). La interfaz muestra toasts indicando “Paso 1/2…”, “Paso 2/2…” y “Mint exitoso”.
5. **Actualización automática**: tras la confirmación on-chain la app espera unos segundos y refresca balances, métricas y descuentos.

---

## 💡 Notas útiles
- Si cambiaste de red o hiciste operaciones fuera de la dApp, usa el botón **Refresh** en la parte superior para sincronizar balances.
- Cuando el simulador muestre “Overcollateralization”, significa que un 1 % del monto en USDC se envía al Treasury como respaldo. Esta porción no se convierte a CUBT.
- Si tu cuenta está marcada como **feeExempt** o tienes descuentos (staking / balance mínimo de CUBT), verás la comisión reducida directamente en el simulador.