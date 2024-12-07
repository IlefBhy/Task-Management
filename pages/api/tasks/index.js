import { PrismaClient } from '@prisma/client'; // Import Prisma Client
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const tasks = await prisma.task.findMany({
        include: { user: true }, 
      });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}