import { Application, Request, Response } from 'express';
import path from 'path';
import express from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/global-error-handler';
import notFoundHandler from './app/middlewares/not-found-handler';
import router from './app/routes';

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: ['https://purrfect-care-client.vercel.app'],
    credentials: true,
  }),
);

app.use('/api', router);

app.get('/', async (req: Request, res: Response) => {
  const test = 'Welcome to the Purrfect Care server';
  res.send(test);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;
