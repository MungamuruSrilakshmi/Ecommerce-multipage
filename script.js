let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to Cart!");
  updateCartCount();

  dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      items: [{
        item_name: name,
        price: price
      }]
    }
  });
}

function updateCartCount() {
  const count = document.getElementById("cart-count");
  if (count) count.innerText = cart.length;
}

function displayCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  let total = 0;
  container.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price;
    container.innerHTML += `
      <p>${item.name} - ₹${item.price}
      <button onclick="removeItem(${index})">Remove</button></p>
    `;
  });

  document.getElementById("total").innerText = total;

  dataLayer.push({ event: "view_cart" });
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  displayCart();

  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: "T" + Date.now(),
          value: cart.reduce((sum, item) => sum + item.price, 0),
          currency: "INR"
        }
      });

      localStorage.removeItem("cart");
      window.location.href = "thankyou.html";
    });
  }
});
