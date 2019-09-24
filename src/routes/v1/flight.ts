import { Request, Response } from 'express';

function getFlights(_: Request, res: Response): void {
  res.sendStatus(200);
}

export { getFlights };
