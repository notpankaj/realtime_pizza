const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customer/cartController");
const orderController = require("../app/http/controllers/customer/orderController");
const AdminOrderController = require("../app/http/controllers/admin/AdminOrderController");

// Middlewares
const guest = require("../app/http/middleware/guest");
const auth = require("../app/http/middleware/auth");
const admin = require("../app/http/middleware/admin");
const statusController = require("../app/http/controllers/admin/StatusController");

function initWebRoutes(app) {
  app.get("/", homeController().index);

  // auth
  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);
  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);
  app.post("/logout", authController().logout);

  // cart
  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);

  // customer
  app.post("/orders", auth, orderController().store);
  app.get("/customers/orders", auth, orderController().index);
  app.get("/customer/orders/:id", auth, orderController().show);
  // +++++ ADMIN +++++
  app.get("/admin/orders", admin, AdminOrderController().index);
  app.post("/admin/order/status", admin, statusController().update);
}

module.exports = initWebRoutes;
