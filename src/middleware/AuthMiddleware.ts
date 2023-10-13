//@ts-nocheck
import { verifyToken } from "../utils/JWT/jwtUtils";
import ERROR_CODE from "../utils/constant/ERROR_CODE";

export function isLoggedIn(req, res, next) {
  const accessToken = req.cookies.access_token;
  const compareResult = verifyToken(accessToken);
  if (!compareResult.validity) {
    return res
      .status(ERROR_CODE[compareResult.data].code)
      .send(ERROR_CODE[compareResult.data]);
  }
  next();
}
