import express from "express";
import {
  createUserService,
  getAllUsersService,
  deleteUserService,
  loginUserService,
  updateUserService,
  getUserByIdService, getUserByEmailService,
} from "../services/user";
import { UserError } from "../util/customUserErrors";
import { SqliteError } from "better-sqlite3";
import { customAuthUser, customAuthGetUser } from "../util/customAuth";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).json(getAllUsersService());
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

router.get("/login", customAuthUser, async (req, res) => {

  res.status(200).json(req.user);
});

router.get("/:userId", customAuthGetUser, async (req, res) => {
  try {
    let userId: string = req.params.userId;
    res.status(200).json(getUserByIdService(userId));
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});

/*router.post("/login", customAuthUser, async (req, res) => {
  try {
    res.status(200).json(loginUserService(req.body));
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});*/

router.post("/", async (req, res) => {
  try {
    res.status(200).json(createUserService(req.body));
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

router.put("/:userId", customAuthUser, async (req, res) => {
  try {
    res.status(200).json(updateUserService(req.params, req.body));
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

router.delete("/:userId", customAuthUser, async (req, res) => {
  try {

    deleteUserService(req.params);
    res.sendStatus(200);
  } catch (error) {
    if (error instanceof UserError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Internal server error!");
    }
  }
});


export { router as userController };
