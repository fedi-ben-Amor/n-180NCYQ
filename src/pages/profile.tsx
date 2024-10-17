import { validateAddress } from '../utils/validateAddress';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

interface UserData {
  id: string;
  nom?: string | null;
  prenom?: string | null;
  birthDate?: string | null;
  adresse?: string | null;
  numTel?: string | null;
}

export default function Profile() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: session?.user?.id || '',
    nom: '',
    prenom: '',
    birthDate: '',
    adresse: '',
    numTel: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        const response = await fetch(`/api/getUser?id=${session.user.id}`);
        if (response.ok) {
          const user: UserData = await response.json();
          setFormData({
            id: user.id,
            nom: user.nom || '',
            prenom: user.prenom || '',
            birthDate: user.birthDate || '',
            adresse: user.adresse || '',
            numTel: user.numTel || '',
          });
        } else {
          console.error('Utilisateur non trouvé ou erreur lors de la récupération.');
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, distance } = await validateAddress(formData.adresse);
    setDistance(distance);

    if (isValid) {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedSession = await response.json();
        update(updatedSession.user); 
        alert('Informations mises à jour avec succès !');
      } else {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.error || 'Erreur lors de la mise à jour.'}`);
      }
    } else {
      alert(`L'adresse est à ${distance?.toFixed(2)} km de Paris, ce qui dépasse la limite de 50 km.`);
    }
  };

  if (loading) {
    return <p>Chargement des données...</p>; 
  }

  if (!session || !session.user) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Profil de {formData.nom} {formData.prenom}</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Nom :</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Prénom :</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date de naissance :</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Adresse :</label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Numéro de téléphone :</label>
          <input
            type="text"
            name="numTel"
            value={formData.numTel}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Mettre à jour</button>
        <button type="button" className="btn btn-secondary" onClick={() => router.push('/login')}>
          Retour
        </button>
      </form>

      {distance !== null && (
        <div className="alert alert-info">
          Distance de l&apos;adresse à Paris : {distance.toFixed(2)} km
        </div>
      )}
    </div>
  );
}
