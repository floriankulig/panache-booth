import express from "express";
import {
  addUser,
  allUsers,
  deleteUser,
  loginUser,
  updateUser,
  userById
} from "../services/user";
import { InvalidLogin, UserNotExisting } from "../util/customUserErrors";
import { SqliteError } from "better-sqlite3";

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
      res.status(500).send("Internal server error!");
    }
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(200).json(await addUser(req.body));
  } catch (error: unknown) {
    if (error instanceof SqliteError && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).send("Email already existing!");
    } else if (error instanceof SqliteError) {
      res.status(400).send("Database error!");
    } else {
      res.status(500).send("Internal server error!");
    }

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
      throw new UserNotExisting();
    }
  } catch (error) {
    if (error instanceof UserNotExisting) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
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
    res.status(500).send("Internal server error!");
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    if (userById(userId) !== undefined) {
      res.status(200).json(await userById(userId));
    } else {
      throw new UserNotExisting();
    }
  } catch (error: unknown) {
    if (error instanceof UserNotExisting) {
      res.status(400).send("User not existing!");
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

export { router as userController };
