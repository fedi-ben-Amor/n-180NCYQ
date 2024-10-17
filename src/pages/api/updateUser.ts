import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';


const dbPath = path.join(process.cwd(), 'db.json');

interface User {
  id: string;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  adresse?: string | null;
  birthDate?: string | null;
  numTel?: string | null;
}

interface Database {
  users: User[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const userData: User = req.body;

    try {
   
      const data = fs.readFileSync(dbPath, 'utf-8');
      const db: Database = JSON.parse(data);

   
      const userIndex = db.users.findIndex(user => user.id === userData.id);
      if (userIndex !== -1) {
       
        db.users[userIndex] = {
          ...db.users[userIndex],
          ...userData, 
        };
      } else {
     
        db.users.push(userData);
      }

    
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

      return res.status(200).json({
        user: userData, 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
    }
  } else {
    return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}
