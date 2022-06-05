import asyncHandler from 'express-async-handler';
import prisma from '../utils/prisma.utils.js';

// @desc Return all permissions
// @route GET /api/permissions
// @access Private
export const index = asyncHandler(async (req, res) => {
  const permissions = await prisma.permission.findMany({
    include: {
      roles: true,
    },
  });

  res.status(200).json(permissions);
});
