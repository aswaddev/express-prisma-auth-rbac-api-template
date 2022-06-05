import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};
