const Menu = require("../../models/menu");
function homeController() {
  return {
    async index(req, res) {
      try {
        const pizzas = await Menu.find();
        return res.render("home", { pizzas: pizzas });
      } catch (error) {
        console.log(error);
      }
    },
  };
}

module.exports = homeController;
