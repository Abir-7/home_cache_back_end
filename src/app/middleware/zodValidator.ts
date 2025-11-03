import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod/v3";

export const validateBody =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
