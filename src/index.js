import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 3000;

Object.values(routes).forEach(route => {
  route(app);
});

app.use(cors());
app.use(cookieParser());
app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
