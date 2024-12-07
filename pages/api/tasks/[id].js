import { PrismaClient } from "@prisma/client"; // Import Prisma Client
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // Extract task ID from the query parameters

  if (req.method === "PUT") {
    const { name, status, userId } = req.body;

    try {
      // Update the task and link the user
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
          name,
          status,
          userId: userId ? parseInt(userId, 10) : null, // Link userId to task
        },
        include: {
          user: true, // Include associated user in the response
        },
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Failed to update task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { deleteUser } = req.query;

      const deletedTask = await prisma.task.delete({
        where: { id: parseInt(id) },
      });

      if (deleteUser) {
        await prisma.user.delete({
          where: { id: deletedTask.userId },
        });
      }

      res.status(204).end();
    } catch (error) {
      console.error("Failed to delete task or user:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
