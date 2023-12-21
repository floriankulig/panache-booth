import express from "express";
import {
  addUser,
  allUsers,
  deleteUser,
  loginUser,
  updateUser,
  userById,
} from "../services/user";
import { UserError } from "../util/customUserErrors";
import { SqliteError } from "better-sqlite3";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json(allUsers());
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

router.post("/login", async (req, res) => {
  try {
    res.status(200).json(await loginUser(req.body));
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).send(error.message);
    }
    res.status(500).send("Internal server error!");
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(200).json(await addUser(req.body));
  } catch (error: unknown) {
    if (error instanceof UserError) {
      res.status(400).send(error.message);
    } else if (error instanceof SqliteError && error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.status(400).send("Email already existing!");
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.put("/:userId", async (req, res) => {
  try {
    res.status(200).json(await updateUser(req.params, req.body));
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).send(error.message);
    } else if (error instanceof SqliteError && error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.status(400).send("Email already existing!");
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    deleteUser(req.params);
    res.sendStatus(200);
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

router.get("/:userId", async (req, res) => {
  try {
    res.status(200).json(userById(req.params));
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

export { router as userController };
