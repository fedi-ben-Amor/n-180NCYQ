import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

interface User {
  id: string;
  nom?: string | null;
  prenom?: string | null;
  birthDate?: string | null;
  adresse?: string | null;
  numTel?: string | null;
}

interface Database {
  users: User[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const data = fs.readFileSync(dbPath, 'utf-8');
      const db: Database = JSON.parse(data);
      const user = db.users.find(user => user.id === id);

      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
    } catch (err) { 
      return res.status(500).json({ error: 'Erreur lors de la récupération des données.'+err });
    }
  } else {
    return res.setHeader('Allow', ['GET']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}
