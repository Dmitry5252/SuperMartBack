import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface Req extends Request {
  id?: string;
}

const authorization = (req: Req, res: Response, next: NextFunction) => {
  let token;
  if (
    (req.method == "POST" || req.method == "PUT" || req.method == "DELETE") &&
    req.headers["x-requested-with"] != "XMLHttpRequest"
  ) {
    return res.sendStatus(401);
  }

  if (req.cookies.Authorization) {
    token = req.cookies.Authorization.split(" ")[1];
  } else {
    return res.sendStatus(401);
  }

  try {
    const result = jwt.verify(token, process.env.API_SECRET as string);
    req.id = (result as jwt.JwtPayload).id;
    next();
  } catch (e) {
    console.log(e);
    res.sendStatus(401);
  }
};

export default authorization;
