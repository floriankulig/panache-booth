import express from "express";
import {
  createProductService,
  getAllProductsService,
  getAllVendorProductsService,
  getProductByIdService,
  deleteProductService,
  updateProductService,
} from "../services/product";
import { ProductError } from "../util/customProductErrors";
import { UserError } from "../util/customUserErrors";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (req.query.vendorId) {
      res.status(200).json(getAllVendorProductsService(req.query));
    } else {
      res.status(200).json(getAllProductsService());
    }
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

router.get("/:productId", async (req, res) => {
  try {
    let productId: string = req.params.productId;
    res.status(200).json(await getProductByIdService(productId));
  } catch (error) {
    if (error instanceof ProductError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});


router.post("/", async (req, res) => {
  try {
    res.status(200).json(await createProductService(req.body));
  } catch (error) {
    if (error instanceof ProductError || error instanceof UserError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.put("/:productId", async (req, res) => {
  try {
    res.status(200).json(await updateProductService(req.params, req.body));
  } catch (error) {
    if (error instanceof ProductError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    deleteProductService(req.params);
    res.sendStatus(200);
  } catch (error) {
    if (error instanceof ProductError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});


export { router as articleController };
