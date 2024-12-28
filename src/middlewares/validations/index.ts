import { NextFunction, Request, Response, RequestHandler } from "express";
import { ZodSchema } from "zod";
import jwt from "jsonwebtoken";
import config from "config";

export const validate =
  (schema: ZodSchema): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      console.log(err, "MIDDLEWARE ERROR");
      const error = err.errors.map((e: any) => e.message);
      res.status(400).json({
        status: 0,
        message: error[0],
      });
    }
  };

// export const verifyTokens = (req: any, res: Response, next: NextFunction) => {
//   const token = req?.headers?.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({
//       status: 0,
//       message: "You are not Authenticated.",
//     });
//   } else {
//     jwt.verify(token, config.jwtSecret, async (err: any, data: any) => {
//       console.log(err);
//       if (err)
//         return res.status(403).json({
//           status: 0,
//           message: err?.message,
//         });
//       req.email = data?.token?.email;
//       next();
//     });
//   }
// };

export const verifyTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({
        status: 0,
        message: "You are not authenticated.",
      });
    }
console.log(token);

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    //@ts-ignore
    req.email = decoded?.token?.email;

    next();
  } catch (error: any) {
    res.status(403).json({
      status: 0,
      message: error.message || "Invalid token.",
    });
  }
};
