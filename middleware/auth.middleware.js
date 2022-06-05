import asyncHandler from 'express-async-handler';
import { verifyToken } from '../utils/jwt.utils.js';
import prisma from '../utils/prisma.utils.js';

const Auth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = verifyToken(token);

      const loggedInUser = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        include: {
          roles: {
            include: {
              permissions: true,
            },
          },
        },
      });

      loggedInUser.permissions = loggedInUser.roles
        .map((role) => role.permissions)[0]
        .map((permission) => permission.name);

      loggedInUser.roles = loggedInUser.roles.map((role) => role.name);

      delete loggedInUser.password;

      req.user = loggedInUser;

      next();
    } catch (error) {
      console.error(`Error: ${error}`);

      res.status(401);

      throw new Error('Unauthorized, token invalid.');
    }
  }

  if (!token) {
    res.status(401);

    throw new Error('Unauthorized, token missing.');
  }
});

export default Auth;
