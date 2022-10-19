import axios from "axios";
import Noty from "noty";
import initAdmin from "./admin";
import moment from "moment";

const cartBtn = document.querySelector("#cart-counter");
const addToCartBtns = document.querySelectorAll(".add-to-cart");

function updateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      console.log(res, "updateCart()");
      cartBtn.innerText = res.data.totalQty || 0;
      new Noty({
        type: "success",
        text: "Item added to cart",
        // progressBar: false,
        layout: "bottomLeft",
        timeout: 1000,
      }).show();
    })
    .catch((err) => {
      console.error(err);
      new Noty({
        type: "error",
        text: "something went wrong!",
        timeout: 1000,
      }).show();
    });
}

addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const { pizza } = btn.dataset;
    if (!pizza) return;
    // console.log(JSON.parse(pizza));
    updateCart(JSON.parse(pizza));
  });
});

const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

initAdmin();

// Change order status

const statuses = document.querySelectorAll(".status_line");
console.log({ statuses });
const hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);

let time = document.createElement("small");

// console.log(order, "order");
function updateStatus(order) {
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (dataProp === order?.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}

updateStatus(order);
