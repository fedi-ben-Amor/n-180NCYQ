import NextAuth from "next-auth"; 


void NextAuth;

declare module "next-auth" {
  interface User {
    id: string; 
    nom?: string | null;
    prenom?: string | null;
    email?: string | null;
    adresse?: string | null;
    birthDate?: string | null;
    numTel?: string | null;
  }

  interface Session {
    user: User;
  }
}
