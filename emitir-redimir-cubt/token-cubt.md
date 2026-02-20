#  Token CUBT

CUBT es una **stablecoin con rendimiento programado (yield-bearing)** cuyo valor inicial se fijó tomando como referencia el precio del CUP (Peso Cubano) en la fecha de lanzamiento del protocolo. Desde entonces, su precio se aprecia gradualmente gracias al rendimiento generado por el Tesoro del protocolo.

##  Mecanismo de apreciación
- Cada **28 días** el contrato de Treasury destina el **25%** de los fondos acumulados para aumentar el colateral que respalda CUBT.
- Este refuerzo periódico incrementa el valor de CUBT frente al USDC de forma **sostenible y transparente**.
- Resultado: un activo diseñado para proteger el poder adquisitivo y crecer junto al ecosistema Achylo.

---

##  Navegando la página “Mint & Redeem”
1. Desde el menú principal, abre **Mint and Redeem**. Encontrarás dos pestañas principales: **Mint** y **Redeem**.
2. El panel superior muestra:
   - Balances de **USDC** y **CUBT**.
   - Estado del **allowance**.
   - Botón **Refresh** para volver a consultar datos on-chain si cambiaste de red o ejecutaste transacciones recientes.
3. Debajo verás un módulo de estadísticas con oferta total, reservas en USDC y las comisiones vigentes. Si tienes descuentos, aparecen resaltados en verde.

---

##  Usa el simulador antes de operar
Al ingresar un monto:
- En **Mint**, escribes cuánto USDC quieres convertir a CUBT.
- En **Redeem**, indicas cuántos CUBT deseas canjear por USDC.

El simulador calcula en tiempo real:
1. **Cantidad a recibir** luego de comisiones y ajustes.
2. **Standard Fee** (tarifa base) vs. **Effective Fee** (con tus descuentos).
3. Si aplica la capa de **sobrecolateralización**.

Esto te permite confirmar exactamente cuántos tokens obtendrás antes de firmar cualquier transacción.

---

##  Consejos rápidos
- Usa **Refresh** si tu balance no coincide con la wallet después de una operación.
- Revisa los badges verdes para confirmar descuentos activos.
- Si el simulador indica sobrecolateralización, significa que parte del USDC quedará bloqueado como garantía adicional (según las reglas vigentes del Tesoro).

Con este flujo el protocolo mantiene la estabilidad de CUBT, evita sorpresas al usuario y facilita operaciones seguras en segundos.