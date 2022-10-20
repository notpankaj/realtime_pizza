import axios from "axios";
import moment from "moment";
import Noty from "noty";
function initAdmin(socket) {
  const orderTableBody = document.querySelector("#orderTableBody");
  let orders = [];
  let markup;
  axios
    .get("/admin/orders", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      console.log(res, "res");
      orders = res.data;
      markup = generateMarkup(orders);
      orderTableBody.innerHTML = markup;
    })
    .catch((err) => {
      console.log(err);
    });

  const renderItems = (items) => {
    let parsetItem = Object.values(items);
    return parsetItem
      .map((menuItem) => {
        return `
            <p>${menuItem.item.name} - ${menuItem.qty} pcs</p>
            `;
      })
      .join("");
  };

  const generateMarkup = (orders) => {
    return orders
      .map((order) => {
        return `
            <tr>
                <td class="border px-4 py-2">
                    <p>${order._id}</p>
                    <div>${renderItems(order?.items)}</div>
                </td>
                <td class="border px-4 py-2">${order.customerId.name}</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">
                <div class="inline-block relative w-64">
                  <form action="/admin/order/status" method="POST">
                    <input type="hidden" name="orderId" value="${order._id}">
                    <select name="status" onChange="this.form.submit()"
                      class="block apperance-none w-full bg-white border border-gray-400 hover:border-gray-500
                        px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                    <option value="order_placed"
                    ${order.status === "order_placed" ? "selected" : ""}
                    >
                    placed
                    </option>
                    <option value="confiremd"
                    ${order.status === "confiremd" ? "selected" : ""}
                    >
                    confiremd
                    </option>
                    <option value="prepared"
                    ${order.status === "prepared" ? "selected" : ""}
                    >
                    prepared
                    </option>
                    <option value="delivered"
                    ${order.status === "delivered" ? "selected" : ""}
                    >
                    delivered
                    </option>
                    <option value="completed"
                    ${order.status === "completed" ? "selected" : ""}
                    >
                    completed
                    </option>
                    </select>
                  </form>
                </div>
                </td>
                <td class="border px-4 py-2">
                ${moment(order.createAt).format("hh:mm:A")}
                </td>
            </tr>
            `;
      })
      .join("");
  };

  socket.on("orderPlaced", (order) => {
    new Noty({
      type: "success",
      timeout: 1000,
      text: "New Order",
      progressBar: false,
    }).show();

    orders.unshift(order);
    orderTableBody.innerHTML = "";
    orderTableBody.innerHTML = generateMarkup(orders);
  });
}

export default initAdmin;
