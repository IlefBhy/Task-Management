import { PrismaClient } from '@prisma/client'; // Import Prisma Client
const prisma = new PrismaClient(); // Create Prisma instance

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Destructure request body
      const { name, status, userId, userFirstName, userLastName } = req.body;

      console.log('Request body:', req.body); // Log the request body

      // Validate task name
      if (!name) {
        return res.status(400).json({ error: 'Task name is required.' });
      }

      // Initialize user variable
      let user = null;

      // Log user details
      console.log('User details:', { userId, userFirstName, userLastName });

      // Upsert user if both first and last names are provided
      if (userFirstName && userLastName) {
        user = await prisma.user.upsert({
          where: { id: parseInt(userId) || 0 },
          update: {}, // No updates for now
          create: {
            firstName: userFirstName,
            lastName: userLastName,
          },
        });
        console.log('User created or found:', user); // Log the created or found user
      }

      // Create a new task
      const newTask = await prisma.task.create({
        data: {
          name,
          status: status || 'en cours', // Default status if not provided
          userId: user ? user.id : parseInt(userId) || null, // Use user.id or provided userId
        },
        include: { user: true }, // Include user in the response
      });

      console.log('New task created:', newTask); // Log the created task

      // Return the created task
      return res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);

      // Handle Prisma-specific errors
      if (error instanceof prisma.PrismaClientKnownRequestError) {
        console.error('Prisma error code:', error.code);
      }

      // Return a detailed error response
      return res.status(500).json({
        error: 'An unexpected error occurred while creating the task.',
        details: error.message,
      });
    }
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
