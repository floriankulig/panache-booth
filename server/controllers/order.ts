import express from "express";
import { IOrder } from "../models/IOrder";
import {
  addOrder,
  allOrders,
  allUserOrdersById,
  allVendorOrdersById,
  deleteOrder,
} from "../services/order";
import { deleteOrderById } from "../models/order";
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
      delivered: req.body.delivered,
    };
    res.status(200).json(await addOrder(order));
  } catch (e: unknown) {
    console.log(e);
    res.status(404).send("Error: Something went wrong!");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    console.log(req.query.isVendor);
    if (req.query.isVendor === "false") {
      res.status(200).json(await allUserOrdersById(id));
    } else {
      res.status(200).json(await allVendorOrdersById(id));
    }
  } catch (e: unknown) {
    console.log(e)
    res.status(404).send("Error: Something went wrong!");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteOrder(id);
    res.sendStatus(200);
  } catch (e: unknown) {
    console.log(e)
    res.status(404).send("Error: Something went wrong!");
  }
});

export { router as orderController };
