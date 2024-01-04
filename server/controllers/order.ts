import express from "express";
import {
  createOrderService,
  getAllOrdersService,
  getAllOrdersByUserIdService,
  getAllVendorOrdersByIdService,
  updateOrderService,
} from "../services/order";
import { UserError } from "../util/customUserErrors";
import { OrderError } from "../util/customOrderErrors";
import { ProductError } from "../util/customProductErrors";
import { customAuthGetOrder, customAuthUpdateOrder, customAuthUser } from "../util/customAuth";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json(await getAllOrdersService());
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error!");
  }
});

router.get("/:id", customAuthGetOrder, async (req, res) => {
  try {
    if (req.query.isVendor === "false") {
      res.status(200).json(await getAllOrdersByUserIdService(req.params));
    } else {
      res.status(200).json(await getAllVendorOrdersByIdService(req.params));
    }
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.post("/", customAuthUser, async (req, res) => {
  try {
    res.status(200).json(await createOrderService(req.body));
  } catch (error) {
    console.log(error);
    if (error instanceof UserError || error instanceof OrderError || error instanceof ProductError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.put("/:orderId", customAuthUpdateOrder, async (req, res) => {
  try {
    res.status(200).json(await updateOrderService(req.params, req.body));
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

export { router as orderController };
