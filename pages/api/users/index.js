// pages/api/users.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany(); // Fetch all users from the database
      return res.status(200).json(users); // Return the users as JSON
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' }); // Handle errors
    }
  }
  
  res.status(405).json({ error: 'Method Not Allowed' }); // If method is not GET
}
