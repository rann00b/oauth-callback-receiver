import express from 'express';
import cors from 'cors';
import * as routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

Object.values(routes).forEach(route => {
  route(app);
});

app.use(cors());
app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
