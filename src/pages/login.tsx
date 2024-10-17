import { signIn, signOut, useSession } from "next-auth/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const { data: session } = useSession();
  const [showWelcome, setShowWelcome] = useState(false);

  if (session && !showWelcome) {
    setTimeout(() => setShowWelcome(true), 300);
  }

  return (
    <div className="container mt-5 text-center">
      {session ? (
        <div>
          <div className="welcome-box p-5 mb-4 bg-dark text-white rounded shadow">
            <h2 className="display-4">Bienvenue, {session.user?.name} !</h2>
            <p className="lead">Ravi de vous revoir. Vous êtes connecté avec succès.</p>
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-danger me-3" onClick={() => signOut()}>
              Se déconnecter
            </button>
            <Link href="/profile" legacyBehavior>
              <a className="btn btn-info">Aller au Profil</a>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="mb-5">Connexion</h1>
  
          <div className="d-flex flex-column align-items-center">
            <button
              className="btn btn-outline-primary btn-lg mb-3 d-flex align-items-center justify-content-center"
              onClick={() => signIn("google")}
            >
              <FontAwesomeIcon icon={faGoogle} className="me-2" />
              Se connecter avec Google
            </button>
            <button
              className="btn btn-outline-dark btn-lg d-flex align-items-center justify-content-center"
              onClick={() => signIn("github")}
            >
              <FontAwesomeIcon icon={faGithub} className="me-2" />
              Se connecter avec GitHub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
