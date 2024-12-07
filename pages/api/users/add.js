import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { firstName, lastName } = req.body;

      // Validate input
      if (!firstName || !lastName) {
        return res.status(400).json({ error: 'Prénom et nom sont requis.' });
      }

      // Create new user
      const user = await prisma.user.create({
        data: { firstName, lastName },
      });

      // Return created user data
      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  }

  // Method Not Allowed if it's not a POST request
  return res.status(405).json({ error: 'Méthode non autorisée.' });
}
