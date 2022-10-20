const Order = require("../../../models/order");
const moment = require("moment");
function orderController() {
  return {
    async index(req, res) {
      const userId = req.user._id;
      const orders = await Order.find({ customerId: userId }, null, {
        sort: { createdAt: -1 },
      });
      res.header(
        "Cache-control",
        "no-store",
        "private",
        "no-cache, max-stale=0",
        "must-revalidate",
        "post-check=0",
        "pre-check=0"
      );

      res.render("customers/orders", { orders, moment });
    },
    store(req, res) {
      const { phoneNumber, address } = req.body;
      //   Validate request
      if (!phoneNumber || !address) {
        req.flash("error", "All Fields Are Required!");
        return res.redirect("/cart");
      }

      const order = new Order({
        customerId: req.user._id,
        phone: phoneNumber,
        address,
        items: req.session.cart.items,
      });

      order
        .save()
        .then((result) => {
          Order.populate(result, { path: "customerId" }, (err, palcedOrder) => {
            delete req.session.cart;
            req.flash("success", "Order Placed Successfuly!");

            // Event Emitter
            const eventEmitter = req.app.get("eventEmitter");
            eventEmitter.emit("orderPlaced", palcedOrder);
            return res.redirect("/customers/orders");
          });
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "something went wrong!");
          return res.redirect("cart");
        });
    },
    async show(req, res) {
      try {
        const order = await Order.findById(req.params.id);
        // Authorize user
        if (req.user._id.toString() === order.customerId.toString()) {
          return res.render("customers/singleOrder", { order: order });
        }
        return res.redirect("/");
      } catch (error) {
        console.log(error);
        return res.render("/");
      }
    },
  };
}

module.exports = orderController;
