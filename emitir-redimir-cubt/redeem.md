#  Redeem CUBT

Guía para canjear **CUBT** y recibir **USDC** utilizando la pestaña **Redeem** del módulo “Mint & Redeem”.

---

##  Antes de comenzar
- Wallet conectada en Base / Base Sepolia.
- CUBT disponible en tu balance (y sin estar bloqueado en un escrow).

---

##  Paso a paso
1. **Selecciona Redeem**: cambia a la pestaña Redeem dentro del módulo.
2. **Ingresa el monto**: escribe cuántos CUBT quieres canjear. Puedes usar el botón **MAX** si deseas liberar todo tu balance.
3. **Revisa el simulador**:
   - Verás los USDC estimados **antes y después** de la comisión.
   - Se muestran descuentos activos o si eres **feeExempt**.
4. **Confirma**: pulsa **Redeem** y aprueba la transacción en tu wallet. La interfaz mostrará toasts del progreso y el resultado final.
5. **Actualización automática**: igual que en Mint, la dApp espera unos segundos tras la confirmación y refresca balances y estadísticas.

---

##  Tips
- Si acabas de recibir CUBT desde otra cuenta o contrato, usa **Refresh** para actualizar el balance antes de canjear.
- Si el simulador muestra que la comisión es cero, significa que estás exento (feeExempt o estatus Gold/staking aplicable).
- El flujo de Redeem no tiene sobrecolateralización: únicamente se descuenta la comisión configurada para ese momento.