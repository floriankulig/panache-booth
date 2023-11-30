import './util/load-env';
import express from 'express';
import path from 'node:path';
import {apiRouter} from "./api";

const app = express();

app.use('/api', apiRouter);


app.listen(process.env.NODE_PORT, () => {
  console.log(`App listening at http://localhost:${process.env.NODE_PORT}`)
});

