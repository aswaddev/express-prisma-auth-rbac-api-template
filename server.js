import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';
import ErrorHandler from './middleware/errorHandler.middleware.js';
import NotFoundHandler from './middleware/notFoundHandler.middleware.js';

import users from './routes/users.route.js';
import auth from './routes/auth.route.js';
import roles from './routes/roles.route.js';
import permissions from './routes/permissions.route.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

app.get('/', (req, res) => {
  res.json({
    message: "Awesome! It's working 😎",
  });
});

// IMPORT ALL API ROUTES BELOW

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/roles', roles);
app.use('/api/permissions', permissions);

// END API ROUTES

app.use(NotFoundHandler);
app.use(ErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
