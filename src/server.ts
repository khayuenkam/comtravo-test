import express from 'express';
import * as Routes from './routes';

const app = express();

app.use('/api', Routes.router);

app.use((_, res) => {
  res.status(404).send({
    error: {
      message: 'Unrecognized request url'
    }
  });
})

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
