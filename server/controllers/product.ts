import express from "express";
import {
  addArticle,
  allArticles,
  allVendorProducts,
  articleById,
  deleteArticle,
  updateArticle,
} from "../services/product";
import { ProductError } from "../util/customProductErrors";
import { SqliteError } from "better-sqlite3";
import { UserError } from "../util/customUserErrors";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (req.query.vendorId) {
      res.status(200).json(allVendorProducts(req.query));
    } else {
      res.status(200).json(allArticles());
    }
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("add")
    res.status(200).json(await addArticle(req.body));
  } catch (error) {
    if (error instanceof ProductError || error instanceof UserError) {
      res.status(400).send(error.message);
    } else if (error instanceof SqliteError) {
      res.status(400).send("Database error!");
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.put("/:productId", async (req, res) => {
  try {
    res.status(200).json(await updateArticle(req.params, req.body));
  } catch (error) {
    if (error instanceof ProductError) {
      res.status(400).send(error.message);
    } else if (error instanceof SqliteError) {
      res.status(400).send("Database error!");
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    deleteArticle(req.params);
    res.sendStatus(200);
  } catch (error) {
    if (error instanceof ProductError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error! Product was not deleted!");
    }
  }
});

router.get("/:productId", async (req, res) => {
  try {
    res.status(200).json(await articleById(req.params));
  } catch (error) {
    if (error instanceof ProductError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

export { router as articleController };
