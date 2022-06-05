import asyncHandler from 'express-async-handler';
import prisma from '../utils/prisma.utils.js';

// @desc Return all roles
// @route GET /api/roles
// @access Private
export const index = asyncHandler(async (req, res) => {
  const roles = await prisma.role.findMany({
    include: {
      permissions: true,
    },
  });

  res.status(200).json(roles);
});

// @desc Create a new role
// @route POST /api/roles
// @access Private
export const store = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;

  const roleExists = await prisma.role.findFirst({
    where: {
      name,
    },
  });

  if (roleExists) {
    res.status(400);
    throw new Error('Role already exists');
  }

  const role = await prisma.role.create({
    data: {
      name,
      permissions: {
        connect: permissions.map((permissionId) => {
          return {
            id: permissionId,
          };
        }),
      },
    },
    include: {
      permissions: true,
    },
  });

  if (role) {
    res.status(201).json(role);
  } else {
    res.status(400);
    throw new Error('Invalid role data');
  }
});

// @desc Get role by id
// @route GET /api/roles/:id
// @access Private
export const show = asyncHandler(async (req, res) => {
  const role = await prisma.role.findUnique({
    where: {
      id: +req.params.id,
    },
    include: {
      permissions: true,
    },
  });

  if (role) {
    res.json(role);
  } else {
    res.status(404);
    throw new Error('Role not found');
  }
});

// @desc Update an existing role
// @route PUT /api/roles/:id
// @access Private
export const update = asyncHandler(async (req, res) => {
  const role = await prisma.role.findUnique({
    where: {
      id: +req.params.id,
    },
    include: {
      permissions: true,
    },
  });

  if (role) {
    if (req.body.name) {
      const nameNotUnique = await prisma.role.findFirst({
        where: {
          id: {
            not: +req.params.id,
          },
          name: req.body.name,
        },
      });

      if (nameNotUnique) {
        res.status(400);
        throw new Error('Role already exists');
      }
    }

    role.name = req.body.name || role.name;

    const permissions = req.body.permissions || role.permissions;

    const updatedRole = await prisma.role.update({
      where: {
        id: +req.params.id,
      },
      data: {
        name: req.body.name || role.name,
        permissions: {
          set: permissions.map((permissionId) => {
            return {
              id: permissionId,
            };
          }),
        },
      },
      include: {
        permissions: true,
      },
    });

    res.json(updatedRole);
  } else {
    res.status(404);

    throw new Error('Role not found');
  }
});

// @desc Delete a role
// @route DELETE /api/roles/:id
// @access Private
export const destroy = asyncHandler(async (req, res) => {
  try {
    await prisma.role.delete({
      where: {
        id: +req.params.id,
      },
    });

    res.json({
      messsage: 'Role deleted successfully',
    });
  } catch (error) {
    res.status(404);

    throw new Error('Role not found');
  }
});
