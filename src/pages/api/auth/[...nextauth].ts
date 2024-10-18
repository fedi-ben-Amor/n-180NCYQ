import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { v4 as uuidv4 } from 'uuid'; 
import fs from 'fs'; 
import path from 'path'; 

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: "822390554140-a5r5asbvhn95odl60gs9qspsr8pa6htb.apps.googleusercontent.com",
      clientSecret: "process.env.GOOGLE_CLIENT_SECRET!",
    }), 
    GitHubProvider({
      clientId: "Ov23liF4DkjQRgfSy20N",
      clientSecret: "e3f420a34a04589a3cab961b0bd2bf619649811e",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || uuidv4(); 
        if (user.name) {
          const nameParts = user.name.split(" ");
          token.nom = nameParts.slice(1).join(" ") || ""; 
          token.prenom = nameParts[0] || ""; 

          
          const userData: User = {
            id: token.id as string, 
            nom: token.nom as string || "",
            prenom: token.prenom as string || "", 
            email: user.email || null, 
          };

       
          const dbPath = path.join(process.cwd(), 'db.json');

  
          const dbContent: { users: User[] } = fs.existsSync(dbPath)
            ? JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
            : { users: [] };

       
          const userExists = dbContent.users.some((existingUser: User) => existingUser.email === user.email);

          if (!userExists) {
            dbContent.users.push(userData);
            fs.writeFileSync(dbPath, JSON.stringify(dbContent, null, 2)); 
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.nom = token.nom as string || null; // Valeur par défaut
        session.user.prenom = token.prenom as string || null; // Valeur par défaut
        session.user.email = token.email || null; 
      }
      return session;
    },
  },
});
