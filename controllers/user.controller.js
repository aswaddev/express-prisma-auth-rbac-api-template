import asyncHandler from 'express-async-handler';
import argon2 from 'argon2';
import { generateToken } from '../utils/jwt.utils.js';
import prisma from '../utils/prisma.utils.js';

// @desc Register a new user
// @route POST /api/users
// @access Public
export const store = asyncHandler(async (req, res) => {
  const { name, username, password, roles } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
      password: await argon2.hash(password),
      roles: {
        connect: roles.map((roleId) => {
          return {
            id: roleId,
          };
        }),
      },
    },
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  delete user.password;

  user.token = generateToken(user.id);

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Get logged in user's profile
// @route GET /api/users/profile
// @access Private
export const profile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  delete user.password;

  if (user) {
    res.json(user);
  } else {
    res.status(401);
    throw new Error("Unauthorized, user doesn't exist");
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (user) {
    if (req.body.username) {
      const usernameNotUnique = await prisma.user.findFirst({
        where: {
          id: {
            not: req.user.id,
          },
          username: req.body.username,
        },
      });

      if (usernameNotUnique) {
        res.status(400);
        throw new Error('Username already in use');
      }
    }

    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;

    let password = user.password;

    if (req.body.password) {
      user.password = await argon2.hash(req.body.password);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name: req.body.name || user.name,
        username: req.body.username || user.username,
        password,
      },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    delete updatedUser.password;

    res.json(updatedUser);
  } else {
    res.status(401);

    throw new Error("Unauthorized, user doesn't exist");
  }
});
