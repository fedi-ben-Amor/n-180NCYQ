import { signIn, signOut, useSession } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Connecté en tant que {session.user?.name}</p>
        <button onClick={() => signOut()}>Se déconnecter</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Connexion</h1>
      <button onClick={() => signIn("google")}>Se connecter avec Google</button>
      <button onClick={() => signIn("github")}>Se connecter avec GitHub</button>
    </div>
  );
}
