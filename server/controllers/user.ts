import express from "express";
import {
  addUser,
  allUsers,
  deleteUser,
  loginUser,
  updateUser,
  userById,
} from "../services/user";
import { IUser } from "../models/IUser";
import { getUserById } from "../models/user";

const router = express.Router();

router.get("/getUserById/:userId([0-9]+)", async (req, res) => {
  const userId = req.params.userId;
  try {
    if (getUserById(userId) !== undefined) {
      res.status(200).json(await userById(userId));
    } else {
      res.status(400).send("User does not exist");
    }
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong!");
  }
});

router.get("/allUsers", async (req, res) => {
  try {
    res.status(200).json(await allUsers());
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong!");
  }
});

router.get("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await loginUser(email, password);
    if (user === undefined) {
      res.status(404).send("Email or password incorrect!");
    } else {
      res.status(200).json(user);
    }
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong!");
  }
});

router.post("/addUser", async (req, res) => {
  try {
    const user: IUser = {
      userName: req.body.userName,
      email: req.body.email,
      street: req.body.street,
      houseNumber: req.body.houseNumber,
      postcode: req.body.postcode,
      city: req.body.city,
      password: req.body.password,
      isVendor: req.body.isVendor,
      bic: req.body.bic,
      iban: req.body.iban,
      shippingCost: req.body.shippingCost,
      shippingFreeFrom: req.body.shippingFreeFrom,
    };
    res.status(200).json(await addUser(user));
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong!");
  }
});

router.put("/updateUserById/:userId([0-9]+)", async (req, res) => {
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

router.delete("/deleteUserById/:userId([0-9]+)", async (req, res) => {
  const userId = req.params.userId;
  try {
    if (getUserById(userId) !== undefined) {
      res.status(200).json(await deleteUser(userId));
    } else {
      res.status(400).send("User not existing");
    }
  } catch (e: unknown) {
    res.status(404).send("Error: Something went wrong. User was not deleted!");
  }
});

export { router as userController };
