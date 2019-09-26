import express from 'express';
import * as Routes from './routes';
// import { NoFlightsError } from './errors/NoFlightsError';

const app = express();

app.use('/api', Routes.router);

// function errorHandler(error: Error, _: Request, res: Response): void {
//   console.log('adsfasd')
//   let status = 404;
//   let message = 'Request url not found';
//   if (error instanceof NoFlightsError) {
//     status = 500;
//     message = 'Something went wrong'
//   }

//   res.status(status).send({
//     error: {
//       message,
//     },
//   });
// }

app.use(function(_: any, res: any) {
  res.status(status).send({
        error: {
          message: 'Something went wrong'

        },
      });


  // logic
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
