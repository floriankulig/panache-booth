import express from "express";
import { IArticle } from "../models/IArticle";
import { addUser, allUsers, deleteUser, updateUser, userById } from "../services/user";
import { addArticle, allArticles, articleById, deleteArticle, updateArticle } from "../services/article";
import { IUser } from "../models/IUser";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json(await allArticles());
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong!");
  }
});

router.post("/", async (req, res) => {
  try {
    const article: IArticle = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      coupon: req.body.coupon,
      price: req.body.price,
      vendorId: req.body.vendorId,
      purchases: req.body.purchases,
      inventory: req.body.inventory,
      isVisible: req.body.isVisible
    };
    res.status(200).json(await addArticle(article));
  } catch (e: unknown) {
    console.log(e)
    res.status(404).send("Error: Something went wrong!");
  }
});

router.put("/:articleId", async (req, res) => {
  try {
    const articleId = req.params.articleId;
    const article = await articleById(articleId);
    if (article != undefined) {
      const articleMap = new Map<string, string>();
      for (let key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          if (key === "isVisible") {
            let temp = req.body[key];
            articleMap.set(key, temp.toString());
          } else {
            articleMap.set(key, req.body[key]);
          }
        }
      }
      res.status(200).json(await updateArticle(articleMap, articleId));
    } else {
      res.status(400).send("User not existing!");
    }
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong!");
  }
});

router.delete("/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  try {
    if (articleById(articleId) !== undefined) {
      const user = await deleteArticle(articleId);
      res.sendStatus(200);
    } else {
      res.status(400).send("User not existing");
    }
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong. User was not deleted!");
  }
});

router.get("/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  try {
    if (articleById(articleId) !== undefined) {
      res.status(200).json(await articleById(articleId));
    } else {
      res.status(400).send("User does not exist");
    }
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong!");
  }
});

export { router as articleController };