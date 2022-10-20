import jwt, { Algorithm } from 'jsonwebtoken';

export const createToken = (
  payload: object,
  secretKey: jwt.Secret,
  expires: string | number,
) => {
  const opt: jwt.SignOptions = {
    algorithm: <Algorithm>'HS256',
    expiresIn: expires,
  };
  return jwt.sign(payload, secretKey, opt);
};

export const decodeToken = (token: string, secretKey: jwt.Secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
