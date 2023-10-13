const ERROR_CODE = {
  JsonWebTokenError: {
    message: "Invalid Token",
    errorInstance: "JsonWebTokenError",
    code: 401,
  },
  TokenExpiredError: {
    message: "Expired Token",
    errorInstance: "TokenExpiredError",
    code: 498,
  },
};

export default ERROR_CODE;
