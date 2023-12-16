import express from "express";
import { IProduct } from "../models/IProduct";
import {
  addArticle,
  allArticles,
  allVendorProducts,
  articleById,
  deleteArticle,
  updateArticle,
} from "../services/product";
import { ProductNotExisting } from "../util/customProductErrors";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const id = req.query["vendorId"];
    if (req.query.vendorId) {
      // @ts-ignore
      console.log(id);
      // @ts-ignore
      res.status(200).json(await allVendorProducts(id));
    } else {
      res.status(200).json(await allArticles());
    }
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

router.post("/", async (req, res) => {
  try {
    const article: IProduct = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      discount: req.body.discount,
      price: req.body.price,
      vendorId: req.body.vendorId,
      purchases: 0,
      inventory: req.body.inventory,
      isVisible: req.body.isVisible,
    };
    res.status(200).json(await addArticle(article));
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

router.put("/:productId", async (req, res) => {
  try {
    const articleId = req.params.productId;
    const article = await articleById(articleId);
    if (article != undefined) {
      const articleMap = new Map<string, string>();
      for (let key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          if (key === "isVisible") {
            let temp = req.body[key];
            articleMap.set(key, temp.toString());
          } else if (key === "vendor") {
            articleMap.set("vendorId", req.body.vendor.id);
          } else {
            articleMap.set(key, req.body[key]);
          }
        }
      }
      res.status(200).json(await updateArticle(articleMap, articleId));
    } else {
      throw new ProductNotExisting();
    }
  } catch (error) {
    if (error instanceof ProductNotExisting) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.delete("/:productId", async (req, res) => {
  const articleId = req.params.productId;
  try {
    if (articleById(articleId) !== undefined) {
      const user = await deleteArticle(articleId);
      res.sendStatus(200);
    } else {
      throw new ProductNotExisting();
    }
  } catch (error) {
    if (error instanceof ProductNotExisting) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error! Product was not deleted!");
    }
  }
});

router.get("/:productId", async (req, res) => {
  const articleId = req.params.productId;
  try {
    if (articleById(articleId) !== undefined) {
      res.status(200).json(await articleById(articleId));
    } else {
      throw new ProductNotExisting();
    }
  } catch (error) {
    if (error instanceof ProductNotExisting) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

export { router as articleController };
