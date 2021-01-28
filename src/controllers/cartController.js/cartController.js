const Cart = require("../../models/cart");

exports.addItemToCart = async (req, res) => {
  //check if cart for current user exist
  await Cart.findOne({ user: req.user._id }).exec( async (error, cart) => {
    if (cart) {
      //set condition and action to reduce some lines;
      let condition, action;
      const product = req.body.cartItems.product; // get productid request body--> item that is been send by user. ** productId
      //check if product in cartItem matches the product sent by user.
      const item = cart.cartItems.find((c) => c.product == product); //return single item from cartItems array if product if matches.** single cart item
      if (item) {
        //check both useID and productId sent by user inside single cart item received above.
        condition = { user: req.user._id, "cartItems.product": product };
        action = {
          //ifmatched update quantity.
          $set: {
            "cartItems.$": {
              ...req.body.cartItems,
              quantity: item.quantity + req.body.cartItems.quantity,
            },
          },
        };
      } else {
        //if produt not match push item in crateItes array.
        condition = { user: req.user._id };
        action = {
          $push: {
            cartItems: req.body.cartItems,
          },
        };
      }
      // execute update of cart based pn the condition.
      await  Cart.findOneAndUpdate(condition, action).exec((error, cart) => {
        if (error) {
          res.status(400).json({ error });
        }else if (cart) {
          res.status(200).json({ cart });
        }else{
            res.status(400).json({ message:"something went wrong : location cartController update execution" });
        }
      });


    } else if (error) {
      return res.status(400).json({ error });
    } else {
      //if cart for current user not exist.--> create new cart save item to cart
      const cart = new Cart({
        user: req.user._id,
        cartItems: [req.body.cartItems],
      });

      await cart.save((error, cart) => {
        if (cart) {
          res.status(200).json({ cart });
        } else if (error) {
          res.status(400).json({ error });
        } else {
          res.status(400).json({
            message: "something went wrong : location : cartController",
          });
        }
      });
    }
  });
};
