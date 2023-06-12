import express from 'express';
import { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Application works!');
});

app.listen(3001, () => {
  console.log('Application started on port 3001');
});