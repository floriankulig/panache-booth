import express from "express";
import {
  addUser,
  allUsers,
  deleteUser,
  loginUser,
  updateUser,
  userById
} from "../services/user";
import { InvalidLogin } from "../util/customErrors";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json(await allUsers());
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    res.status(200).json(await loginUser(email, password));
  } catch (error) {
    if (error instanceof InvalidLogin) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Error: Something went wrong!");
    }
  }
});

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    console.log(typeof req.body);
    res.status(200).json(await addUser(req.body));
  } catch (e: unknown) {
    console.log(e);
    res.status(500).send("Error: Something went wrong!");
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userById(userId);
    if (user != undefined) {
      const userMap = new Map<string, string>();
      for (let key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          if (key === "isVendor") {
            let temp = req.body[key];
            userMap.set(key, temp.toString());
          } else {
            userMap.set(key, req.body[key]);
          }
        }
      }
      res.status(200).json(await updateUser(userMap, userId));
    } else {
      res.status(400).send("User not existing!");
    }
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong!");
  }
});

router.delete("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    if (userById(userId) !== undefined) {
      const user = await deleteUser(userId);
      res.sendStatus(200);
    } else {
      res.status(400).send("User not existing");
    }
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong. User was not deleted!");
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    if (userById(userId) !== undefined) {
      res.status(200).json(await userById(userId));
    } else {
      res.status(400).send("User does not exist");
    }
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong!");
  }
});

export { router as userController };
