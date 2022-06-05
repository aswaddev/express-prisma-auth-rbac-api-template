import asyncHandler from 'express-async-handler';
import { generateToken } from '../utils/jwt.utils.js';
import prisma from '../utils/prisma.utils.js';
import argon2 from 'argon2';

// @desc Auth user & get token
// @route POST /api/auth/login
// @access Public
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (user) {
    const isPasswordValid = await argon2.verify(user.password, password);
    if (isPasswordValid) {
      user.token = generateToken(user.id);
      delete user.password;

      return res.json(user);
    } else {
      res.status(401);
      throw new Error('Invalid Username or Password');
    }
  } else {
    res.status(401);
    throw new Error('Invalid Username or Password');
  }
});
