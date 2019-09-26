import express from 'express';
import * as Routes from './routes';

const app = express();

app.use('/api', Routes.router);
app.use(function(_req, res) {
  res.sendStatus(404);
});

const server = app.listen(3000, () => {
  console.log('App listening on port 3000');
});

export { app, server };
