import express from "express";
import { IOrder } from "../models/IOrder";
import {
  addOrder,
  allOrders,
  allUserOrdersById,
  allVendorOrdersById,
  deleteOrder, updateOrder,
} from "../services/order";
import { deleteOrderById } from "../models/order";
import { SqliteError } from "better-sqlite3";
import { UserError } from "../util/customUserErrors";
import { OrderError } from "../util/customOrderErrors";
import { ProductError } from "../util/customProductErrors";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json(await allOrders());
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (req.query.isVendor === "false") {
      res.status(200).json(await allUserOrdersById(req.params));
    } else {
      res.status(200).json(await allVendorOrdersById(req.params));
    }
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(200).json(await addOrder(req.body));
  } catch (error) {
    if (error instanceof UserError || error instanceof OrderError || error instanceof ProductError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.put("/:orderId", async (req, res) => {
  try {
    res.status(200).json(await updateOrder(req.params, req.body));
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteOrder(id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

export { router as orderController };
