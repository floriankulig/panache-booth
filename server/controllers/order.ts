import express from "express";
import { IOrder } from "../models/IOrder";
import { addOrder, allOrders, allOrdersById } from "../services/order";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json(await allOrders());
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong!");
  }
});

router.post("/", async (req, res) => {
  try {
    const order: IOrder = {
      userId: req.body.userId,
      vendorId: req.body.vendorId,
      productId: req.body.productId,
      price: req.body.price,
      numberOfPurchases: req.body.numberOfPurchases,
      delivered: req.body.delivered
    };
    res.status(200).json(await addOrder(order));
  } catch (e: unknown) {
    console.log(e)
    res.status(404).send("Error: Something went wrong!");
  }
});





export { router as orderController };


