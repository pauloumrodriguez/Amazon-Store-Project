import { orders } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

async function loadPage() {
  try {
    await loadProductsFetch();
    renderOrdersGrid();
  } catch (error) {
    document.querySelector(".js-orders-grid").innerHTML =
      "<p>Unable to load your orders. Please, try again later.</p>";
  }
}

function renderOrdersGrid() {
  const ordersGrid = document.querySelector(".js-orders-grid");

  if (orders.length === 0) {
    ordersGrid.innerHTML = "<p>You have no orders yet.</p>";
    return;
  }

  let ordersHTML = "";

  orders.forEach((order) => {
    const orderDate = dayjs(order.orderTime).format("MMMM D");

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsHTML(order)}
        </div>
      </div>
    `;
  });

  ordersGrid.innerHTML = ordersHTML;
}

function productsHTML(order) {
  let html = "";

  order.products.forEach((orderProduct) => {
    const product = getProduct(orderProduct.productId);

    if (!product) {
      return;
    }

    const deliveryDate = dayjs(
      orderProduct.estimatedDeliveryTime,
    ).format("MMMM D");

    const trackingParameters = new URLSearchParams({
      orderId: order.id,
      productId: orderProduct.productId,
    });

    html += `
      <div class="product-image-container">
        <img src="${product.image}" />
      </div>

      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <div class="product-delivery-date">
          Arriving on: ${deliveryDate}
        </div>
        <div class="product-quantity">
          Quantity: ${orderProduct.quantity}
        </div>
        <button class="buy-again-button button-primary">
          <img class="buy-again-icon" src="images/icons/buy-again.png" />
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?${trackingParameters.toString()}">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  });

  return html;
}

loadPage();
