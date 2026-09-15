const formatCurrency = (amount = 0) =>
  `₦${Number(amount).toLocaleString("en-NG")}`;

const formatDate = (date) => {
  if (!date) return "Not specified";

  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getCustomerName = (order) => {
  return (
    order.customerName ||
    order.user?.name ||
    order.user?.fullName ||
    order.deliveryName ||
    "Customer"
  );
};

const getDeliveryAddress = (order) => {
  if (typeof order.deliveryAddress === "string") {
    return order.deliveryAddress;
  }

  if (order.deliveryAddress && typeof order.deliveryAddress === "object") {
    return [
      order.deliveryAddress.address,
      order.deliveryAddress.street,
      order.deliveryAddress.city,
      order.deliveryAddress.state,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return "Not provided";
};

const getItems = (order) => {
  return order.items || order.orderItems || [];
};

const getItemName = (item) => {
  return (
    item.name ||
    item.menuItem?.name ||
    item.product?.name ||
    "Menu Item"
  );
};

const getItemPrice = (item) => {
  return (
    item.price ??
    item.menuItem?.price ??
    item.product?.price ??
    0
  );
};

const getItemQuantity = (item) => {
  return item.quantity || 1;
};

const getItemsHtml = (order) => {
  const items = getItems(order);

  if (!items.length) {
    return `
      <tr>
        <td
          colspan="3"
          style="
            padding:16px 12px;
            text-align:center;
            color:#6b7280;
            font-size:14px;
          "
        >
          No purchased items available.
        </td>
      </tr>
    `;
  }

  return items
    .map((item) => {
      const name = escapeHtml(getItemName(item));
      const quantity = getItemQuantity(item);
      const price = getItemPrice(item);

      return `
        <tr>
          <td
            style="
              padding:12px;
              border-bottom:1px solid #e5e7eb;
              color:#172033;
              font-size:14px;
            "
          >
            ${name}
          </td>

          <td
            style="
              padding:12px;
              border-bottom:1px solid #e5e7eb;
              text-align:center;
              color:#4b5563;
              font-size:14px;
            "
          >
            ${quantity}
          </td>

          <td
            style="
              padding:12px;
              border-bottom:1px solid #e5e7eb;
              text-align:right;
              color:#172033;
              font-size:14px;
              font-weight:600;
            "
          >
            ${formatCurrency(price * quantity)}
          </td>
        </tr>
      `;
    })
    .join("");
};

const baseTemplate = ({
  title,
  intro,
  order,
  content,
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${escapeHtml(title)}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f3f6fa;
    font-family:Arial, Helvetica, sans-serif;
    color:#172033;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#f3f6fa;"
  >

    <tr>
      <td align="center" style="padding:35px 15px;">

        <!-- MAIN CONTAINER -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:650px;
            background:#ffffff;
            border-radius:10px;
            overflow:hidden;
          "
        >

          <!-- TOP BORDER -->
          <tr>
            <td
              style="
                height:4px;
                background:#1769e0;
                font-size:0;
                line-height:0;
              "
            >
            </td>
          </tr>

          <!-- LOGO / BRAND -->
          <tr>
            <td
              align="center"
              style="
                padding:28px 25px 10px;
              "
            >

              <div
                style="
                  font-size:27px;
                  font-weight:700;
                  color:#1769e0;
                "
              >
                Dave's Table
              </div>

              <div
                style="
                  margin-top:5px;
                  font-size:12px;
                  color:#7b8494;
                  letter-spacing:1px;
                "
              >
                RESTAURANT &amp; DELIVERY
              </div>

            </td>
          </tr>

          <!-- CHECK ICON -->
          <tr>
            <td align="center" style="padding:15px 25px 5px;">

              <div
                style="
                  width:65px;
                  height:65px;
                  line-height:65px;
                  border-radius:50%;
                  background:#eaf4ff;
                  color:#1769e0;
                  font-size:38px;
                  font-weight:bold;
                  text-align:center;
                "
              >
                ✓
              </div>

            </td>
          </tr>

          <!-- TITLE -->
          <tr>
            <td
              align="center"
              style="
                padding:10px 25px 5px;
              "
            >

              <h1
                style="
                  margin:0;
                  font-size:25px;
                  line-height:1.3;
                  color:#1769e0;
                "
              >
                ${escapeHtml(title)}
              </h1>

            </td>
          </tr>

          <!-- INTRO -->
          <tr>
            <td
              align="center"
              style="
                padding:8px 35px 25px;
              "
            >

              <p
                style="
                  margin:0;
                  font-size:14px;
                  line-height:1.7;
                  color:#6b7280;
                "
              >
                ${intro}
              </p>

            </td>
          </tr>

          ${content}

          <!-- FOOTER -->
          <tr>
            <td
              align="center"
              style="
                padding:25px;
                background:#f8fafc;
                border-top:1px solid #e5e7eb;
              "
            >

              <p
                style="
                  margin:0 0 7px;
                  font-size:14px;
                  color:#172033;
                  font-weight:600;
                "
              >
                Thank you for choosing Dave's Table
              </p>

              <p
                style="
                  margin:0;
                  font-size:12px;
                  line-height:1.6;
                  color:#7b8494;
                "
              >
                This is an automated email. Please do not reply directly
                to this message.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>
</html>
`;


/* =========================================================
   CUSTOMER ORDER CONFIRMATION
========================================================= */

export const orderConfirmation = (order) => {
  const customerName = escapeHtml(getCustomerName(order));
  const deliveryAddress = escapeHtml(getDeliveryAddress(order));

  const subtotal =
    order.subtotal ??
    order.subTotal ??
    order.totalPrice ??
    order.total ??
    0;

  const deliveryFee =
    order.deliveryFee ??
    order.shippingFee ??
    0;

  const total =
    order.totalPrice ??
    order.total ??
    subtotal + deliveryFee;

  const orderNumber =
    order._id ||
    order.orderNumber ||
    "N/A";

  const estimatedDeliveryDate =
    order.estimatedDeliveryDate ||
    order.deliveryDate;

  return baseTemplate({
    title: "Thank You For Your Order!",
    intro: `
      Hello ${customerName},<br>
      Your order has been successfully paid for and is now being processed.
      We'll keep you updated as your order moves through the delivery process.
    `,
    order,

    content: `

      <!-- ORDER NUMBER -->
      <tr>
        <td style="padding:0 30px 20px;">

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
          >
            <tr>

              <td
                style="
                  padding:15px;
                  background:#e8f5ff;
                  border-left:4px solid #1769e0;
                "
              >

                <span
                  style="
                    font-size:12px;
                    color:#172033;
                    font-weight:bold;
                  "
                >
                  ORDER CONFIRMATION NO.
                </span>

              </td>

              <td
                align="right"
                style="
                  padding:15px;
                  background:#e8f5ff;
                  border-left:0;
                "
              >

                <span
                  style="
                    font-size:13px;
                    color:#172033;
                    font-weight:bold;
                  "
                >
                  #${escapeHtml(orderNumber)}
                </span>

              </td>

            </tr>
          </table>

        </td>
      </tr>


      <!-- PURCHASED ITEMS -->
      <tr>
        <td style="padding:0 30px 20px;">

          <h2
            style="
              margin:0 0 12px;
              font-size:16px;
              color:#172033;
            "
          >
            Purchased Items
          </h2>

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              border:1px solid #e5e7eb;
              border-radius:6px;
              overflow:hidden;
            "
          >

            <tr
              style="
                background:#f8fafc;
              "
            >

              <th
                align="left"
                style="
                  padding:12px;
                  font-size:12px;
                  color:#6b7280;
                  text-transform:uppercase;
                "
              >
                Item
              </th>

              <th
                align="center"
                style="
                  padding:12px;
                  font-size:12px;
                  color:#6b7280;
                  text-transform:uppercase;
                "
              >
                Qty
              </th>

              <th
                align="right"
                style="
                  padding:12px;
                  font-size:12px;
                  color:#6b7280;
                  text-transform:uppercase;
                "
              >
                Price
              </th>

            </tr>

            ${getItemsHtml(order)}

          </table>

        </td>
      </tr>


      <!-- ORDER TOTALS -->
      <tr>
        <td style="padding:0 30px 25px;">

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
          >

            <tr>
              <td
                style="
                  padding:7px 0;
                  font-size:14px;
                  color:#6b7280;
                "
              >
                Subtotal
              </td>

              <td
                align="right"
                style="
                  padding:7px 0;
                  font-size:14px;
                  color:#172033;
                "
              >
                ${formatCurrency(subtotal)}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:7px 0;
                  font-size:14px;
                  color:#6b7280;
                "
              >
                Delivery Fee
              </td>

              <td
                align="right"
                style="
                  padding:7px 0;
                  font-size:14px;
                  color:#172033;
                "
              >
                ${formatCurrency(deliveryFee)}
              </td>
            </tr>

            <tr>
              <td
                colspan="2"
                style="
                  border-top:1px solid #e5e7eb;
                  padding-top:12px;
                "
              >
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:5px 0;
                  font-size:15px;
                  font-weight:bold;
                  color:#172033;
                "
              >
                TOTAL
              </td>

              <td
                align="right"
                style="
                  padding:5px 0;
                  font-size:17px;
                  font-weight:bold;
                  color:#1769e0;
                "
              >
                ${formatCurrency(total)}
              </td>
            </tr>

          </table>

        </td>
      </tr>


      <!-- DELIVERY INFORMATION -->
      <tr>
        <td style="padding:0 30px 30px;">

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              border-top:1px solid #e5e7eb;
              padding-top:20px;
            "
          >

            <tr>

              <td
                width="60%"
                valign="top"
                style="
                  padding-top:20px;
                  padding-right:15px;
                "
              >

                <div
                  style="
                    font-size:13px;
                    font-weight:bold;
                    color:#172033;
                    margin-bottom:8px;
                  "
                >
                  Delivery Address
                </div>

                <div
                  style="
                    font-size:13px;
                    line-height:1.6;
                    color:#6b7280;
                  "
                >
                  ${deliveryAddress}
                </div>

              </td>


              <td
                width="40%"
                valign="top"
                style="
                  padding-top:20px;
                  padding-left:15px;
                "
              >

                <div
                  style="
                    font-size:13px;
                    font-weight:bold;
                    color:#172033;
                    margin-bottom:8px;
                  "
                >
                  Estimated Delivery
                </div>

                <div
                  style="
                    font-size:13px;
                    line-height:1.6;
                    color:#6b7280;
                  "
                >
                  ${formatDate(estimatedDeliveryDate)}
                </div>

              </td>

            </tr>

          </table>

        </td>
      </tr>

    `,
  });
};


/* =========================================================
   ADMIN NEW ORDER EMAIL
========================================================= */

export const newOrderAdmin = (order) => {
  const customerName = escapeHtml(getCustomerName(order));
  const deliveryAddress = escapeHtml(getDeliveryAddress(order));

  const subtotal =
    order.subtotal ??
    order.subTotal ??
    order.totalPrice ??
    order.total ??
    0;

  const deliveryFee =
    order.deliveryFee ??
    order.shippingFee ??
    0;

  const total =
    order.totalPrice ??
    order.total ??
    subtotal + deliveryFee;

  const orderNumber =
    order._id ||
    order.orderNumber ||
    "N/A";

  return baseTemplate({
    title: "New Order Received!",
    intro: `
      A new order has been successfully paid for and is ready for processing.
      Please review the order details below.
    `,
    order,

    content: `

      <!-- ORDER ALERT -->
      <tr>
        <td style="padding:0 30px 20px;">

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              background:#e8f5ff;
              border-left:4px solid #1769e0;
            "
          >

            <tr>
              <td style="padding:15px;">

                <div
                  style="
                    font-size:12px;
                    color:#6b7280;
                    margin-bottom:5px;
                  "
                >
                  ORDER CONFIRMATION NO.
                </div>

                <div
                  style="
                    font-size:17px;
                    font-weight:bold;
                    color:#172033;
                  "
                >
                  #${escapeHtml(orderNumber)}
                </div>

              </td>
            </tr>

          </table>

        </td>
      </tr>


      <!-- CUSTOMER INFORMATION -->
      <tr>
        <td style="padding:0 30px 20px;">

          <h2
            style="
              margin:0 0 12px;
              font-size:16px;
              color:#172033;
            "
          >
            Customer Information
          </h2>

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              border:1px solid #e5e7eb;
            "
          >

            <tr>

              <td
                style="
                  padding:12px;
                  font-size:13px;
                  color:#6b7280;
                "
              >
                Customer
              </td>

              <td
                align="right"
                style="
                  padding:12px;
                  font-size:13px;
                  font-weight:bold;
                  color:#172033;
                "
              >
                ${customerName}
              </td>

            </tr>

            <tr>

              <td
                style="
                  padding:12px;
                  border-top:1px solid #e5e7eb;
                  font-size:13px;
                  color:#6b7280;
                "
              >
                Order Status
              </td>

              <td
                align="right"
                style="
                  padding:12px;
                  border-top:1px solid #e5e7eb;
                  font-size:13px;
                  font-weight:bold;
                  color:#1769e0;
                "
              >
                PAID
              </td>

            </tr>

          </table>

        </td>
      </tr>


      <!-- ITEMS -->
      <tr>
        <td style="padding:0 30px 20px;">

          <h2
            style="
              margin:0 0 12px;
              font-size:16px;
              color:#172033;
            "
          >
            Order Items
          </h2>

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              border:1px solid #e5e7eb;
            "
          >

            <tr style="background:#f8fafc;">

              <th
                align="left"
                style="
                  padding:12px;
                  font-size:12px;
                  color:#6b7280;
                "
              >
                Item
              </th>

              <th
                align="center"
                style="
                  padding:12px;
                  font-size:12px;
                  color:#6b7280;
                "
              >
                Qty
              </th>

              <th
                align="right"
                style="
                  padding:12px;
                  font-size:12px;
                  color:#6b7280;
                "
              >
                Price
              </th>

            </tr>

            ${getItemsHtml(order)}

          </table>

        </td>
      </tr>


      <!-- TOTAL -->
      <tr>
        <td style="padding:0 30px 20px;">

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
          >

            <tr>

              <td
                style="
                  padding:8px 0;
                  font-size:14px;
                  color:#6b7280;
                "
              >
                Subtotal
              </td>

              <td
                align="right"
                style="
                  padding:8px 0;
                  font-size:14px;
                "
              >
                ${formatCurrency(subtotal)}
              </td>

            </tr>

            <tr>

              <td
                style="
                  padding:8px 0;
                  font-size:14px;
                  color:#6b7280;
                "
              >
                Delivery Fee
              </td>

              <td
                align="right"
                style="
                  padding:8px 0;
                  font-size:14px;
                "
              >
                ${formatCurrency(deliveryFee)}
              </td>

            </tr>

            <tr>

              <td
                style="
                  border-top:1px solid #e5e7eb;
                  padding-top:13px;
                  font-size:15px;
                  font-weight:bold;
                "
              >
                TOTAL
              </td>

              <td
                align="right"
                style="
                  border-top:1px solid #e5e7eb;
                  padding-top:13px;
                  font-size:17px;
                  font-weight:bold;
                  color:#1769e0;
                "
              >
                ${formatCurrency(total)}
              </td>

            </tr>

          </table>

        </td>
      </tr>


      <!-- DELIVERY -->
      <tr>
        <td style="padding:0 30px 30px;">

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              background:#f8fafc;
            "
          >

            <tr>

              <td style="padding:15px;">

                <div
                  style="
                    font-size:13px;
                    font-weight:bold;
                    color:#172033;
                    margin-bottom:7px;
                  "
                >
                  Delivery Address
                </div>

                <div
                  style="
                    font-size:13px;
                    line-height:1.6;
                    color:#6b7280;
                  "
                >
                  ${deliveryAddress}
                </div>

              </td>

            </tr>

          </table>

        </td>
      </tr>

    `,
  });
};


/* =========================================================
   PASSWORD RESET EMAIL
========================================================= */

export const resetPasswordEmail = (name, code) => {
  return baseTemplate({
    title: "Password Reset Request",

    intro: `
      Hello ${escapeHtml(name)},<br>
      We received a request to reset your Dave's Table password.
    `,

    order: {},

    content: `

      <tr>
        <td align="center" style="padding:10px 30px 35px;">

          <p
            style="
              margin:0 0 15px;
              font-size:14px;
              color:#6b7280;
            "
          >
            Your password reset code is:
          </p>

          <div
            style="
              display:inline-block;
              padding:15px 25px;
              background:#e8f5ff;
              border:1px solid #c9e7ff;
              border-radius:6px;
              font-size:28px;
              font-weight:bold;
              letter-spacing:7px;
              color:#1769e0;
            "
          >
            ${escapeHtml(code)}
          </div>

          <p
            style="
              margin:18px 0 0;
              font-size:13px;
              color:#7b8494;
            "
          >
            This code expires in 15 minutes.
          </p>

        </td>
      </tr>

    `,
  });
};