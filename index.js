const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// Routes will be added here
const users = [];

// Create a new user
router.post('/users', (ctx) => {
  const newUser = ctx.request.body;
  // don't allow duplicate user [name, email]
  const duplicateUser = users.find((user) => user.email === newUser.email);
  if (duplicateUser) {
    // duplicate user
    ctx.status = 409;
    ctx.body = { message: 'This user already exists' };
  } else {
    // insert new user
    newUser.id = users.length + 1;
    users.push(newUser);
    ctx.body = { message: 'User created', user: newUser };
  }
});

// Get all users
router.get('/users', (ctx) => {
  ctx.body = users;
});

// Get a specific user by ID
router.get('/users/:id', (ctx) => {
  const userId = parseInt(ctx.params.id);
  const user = users.find((user) => user.id === userId);
  if (user) {
    ctx.body = user;
  } else {
    ctx.status = 404;
    ctx.body = { message: 'User not found' };
  }
});

// Update a user by ID
router.put('/users/:id', (ctx) => {
  const userId = parseInt(ctx.params.id);
  const updatedUser = ctx.request.body;
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    ctx.body = { message: 'User updated', user: users[index] };
  } else {
    ctx.status = 404;
    ctx.body = { message: 'User not found' };
  }
});

// Delete a user by ID
router.delete('/users/:id', (ctx) => {
  const userId = parseInt(ctx.params.id);
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    ctx.body = { message: 'User deleted' };
  } else {
    ctx.status = 404;
    ctx.body = { message: 'User not found' };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

