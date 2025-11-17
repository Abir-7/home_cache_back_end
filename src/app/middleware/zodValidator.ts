import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
