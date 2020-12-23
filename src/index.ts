import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer, Server } from 'http';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import sio from './io';
import router from './routes';
import db from './model/index';
import path from 'path';
const PORT = process.env.PORT;
const app: express.Application = express();
const server: Server = createServer(app);

app.use(express.json());
app.use(cookieparser());
app.use(cors());
app.use('/', express.static(path.join(__dirname, 'public')));
// "postinstall": "tsc && mv -i -v src/build dist/ && rm -v -rf src",

sio(server);
app.use(router);

(async function () {
  await db();
  server.listen(PORT, () => {
    console.log(`🍍🍕 listening on ${PORT}. 🍕🍍`);
  });
})();
