import express from "express";
import cors from "cors";

import { userController } from "./controllers/user";
import { articleController } from "./controllers/article";

export const router = express.Router();

router.use(cors());
router.use(express.json());

router.use("/user", userController);
router.use("/article", articleController);

router.use((req, res) => {
  res.status(405);
  res.send('Route does not exist');
});

export { router as apiRouter };