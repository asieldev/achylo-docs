#  Gestión de Órdenes Públicas

##  Crear una orden pública 
> **Nota:** Esta función es exclusiva para usuarios con rol de **Merchant**. Si no visualizas el botón "Create Public Order", asegúrate de haber completado tu registro en el menú *Become a Merchant*.

###  Capacidad de Orden y Colateral
Al abrir el modal, verás un resumen de tu capacidad operativa basada en tu garantía:
* **Your Merchant Collateral:** El saldo total que has depositado como garantía.
* **Max order capacity (2x multiplier):** Achylo te permite publicar órdenes por un valor de hasta el **doble (2x)** de tu colateral.
* **Available:** Indica cuánto cupo te queda disponible para nuevas órdenes tras descontar las órdenes activas.

### Pasos para configurar el modal:

1. **Order Type (Tipo de orden):**
   * **Buy USDC:** Compras USDC y entregas fiat.
   * **Sell USDC:** Vendes USDC y recibes fiat.

2. **Fiat Currency (Moneda):** Selecciona la divisa de intercambio.
   * *Opciones destacadas:* **CUP**, **CUBT** (aplica 50% de descuento), **MLC**, **USD Clásica**, **COP**, **USD**, **EUR**, **GBP**, **MXN**, **ARS**, entre otras.

3. **Exchange Rate (Tasa de cambio):** * Define cuánto fiat pagas/recibes por cada 1 USDC. 
   * *Rango válido:* 0.01 - 1,000,000 por unidad.

4. **Límites por Transacción:**
   * **Min Amount :** Lo mínimo que un usuario puede aceptarte.
   * **Max Amount :** Lo máximo que un usuario puede aceptarte en una sola operación.

5. **Total Available Amount :** * Es el monto total de la orden. 
   * **Importante:** Para órdenes de compra (*Buy*), no se bloquean tokens de tu wallet, se usa tu capacidad de colateral.

6. **Payment Method (Métodos de Pago):**
   * Selecciona hasta **5 métodos** distintos (ej. Zelle, Pix, Bandec, Transferencia).

7. **Reclaim Timeout :**
   * Tiempo que tiene el comprador para completar el pago antes de que el vendedor pueda reclamar los fondos.
   * *Rango:* Desde 15 minutos hasta 28 días. Si se deja vacío, aplica el valor por defecto.

8. **🏪 Merchant Only:** * Si activas esta casilla, **solo otros merchants registrados** podrán ver y aceptar tu orden, brindando una capa extra de seguridad.

---

##  Aceptar una orden pública
1. **Selección:** En el tab **“Marketplace”**, pulsa en **“Accept Order”**.
2. **Detalles:** Ingresa el monto (puedes usar el botón **MAX**) y tus datos de cobro si es una orden de tipo *Buy*.
3. **Revisión:** La app aplicará automáticamente descuentos si usas **CUBT**.
4. **Confirmación:** Pulsa **“Accept Order”** para crear el *escrow* seguro.

---

<p align="center">
  <img src="../assets/images/order.png" alt="Vista del modal 'Create Public Order'" width="75%" />
</p>

**📍 Img. No.1. Vista de Create Public Order.**