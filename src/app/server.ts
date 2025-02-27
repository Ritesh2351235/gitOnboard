import express, { type Request, type Response } from 'express';
import { createServer } from 'http';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = Number(process.env.PORT || 3000);

// Initialize Next.js
const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

// API Routes
const userRouter = express.Router();

userRouter.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Get all users' });
});

userRouter.post('/', (req: Request, res: Response) => {
  const { name } = req.body;
  res.status(201).json({ message: `User ${name} created` });
});

// Setup Express with Next.js
const initServer = async () => {
  try {
    await nextApp.prepare();

    const app = express();

    // Middleware
    app.use(express.json());

    // API routes
    app.use('/api/users', userRouter);

    // Let Next.js handle all other routes
    app.all('*', (req: Request, res: Response) => {
      return handle(req, res);
    });

    // Create server
    const server = createServer(app);

    server.listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Start the server
initServer();

// For TypeScript type checking
export type ExpressApp = typeof express;