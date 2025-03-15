import { Request, Response, NextFunction } from "express";

const asyncHandle = (
  handle: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    handle(req, res, next).catch(next);
  };
};

export default asyncHandle;
