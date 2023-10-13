//@ts-nocheck
import jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
  const decodedJWT = jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return { validity: false, data: err.name };
      }
      return { validity: true, data: decoded };
    }
  );
  return decodedJWT;
};
