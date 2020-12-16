import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });
import express from 'express';
import { createServer, Server } from 'http';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import sio from './io';
import router from './routes';
import db from './model/index';
const PORT = process.env.PORT || 3005;
const app: express.Application = express();
const server: Server = createServer(app);

app.use(express.json());
app.use(cookieparser());
app.use(cors());
sio(server);
app.use(router);

(async function () {
  await db();
  server.listen(PORT, () => {
    console.log(`🍍🍕 listening on ${PORT}. 🍕🍍`);
  });
})();