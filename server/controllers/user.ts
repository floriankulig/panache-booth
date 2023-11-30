import express from "express";
import { addUser, userById } from "../services/user";
import { IUser } from "../models/IUser";

const router = express.Router();

router.get('/:userId', async (req, res) => {
  console.log('1');
  const id = req.params.userId;
  res.status(200).json(await userById(id));
})

router.post('/new', async (req, res) => {
  console.log('test')
  const user: IUser = {
    username: req.body.username,
    id: req.body.id
  }
  console.log(user);
  res.status(200).json(await addUser(user));
})

export { router as userController }