import { validateAddress } from '../utils/validateAddress'; 
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/router'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

export default function Profile() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    firstName: '',
    birthDate: '',
    address: '',
    phoneNumber: ''
  });
  const [distance, setDistance] = useState<number | null>(null);
  const router = useRouter(); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, distance } = await validateAddress(formData.address);  
    setDistance(distance); 

    if (isValid) {
      console.log('Adresse validée et informations mises à jour.');
      alert('Adresse validée avec succès !');
    } else {
      console.log(`L'adresse est hors de la zone autorisée. Elle est à ${distance} km de Paris.`);
      alert(`L'adresse est à ${distance.toFixed(2)} km de Paris, ce qui dépasse la limite de 50 km.`);
    }
  };

  if (!session || !session.user) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Profil de {session.user.name}</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Nom :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Prénom :</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
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
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Numéro de téléphone :</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Mettre à jour </button>
        <button className="btn btn-secondary" onClick={() => router.push('/login')}>
        Retour
      </button>
      </form>

      {distance !== null && (
        <div className="alert alert-info">
          Distance de l'adresse à Paris : {distance.toFixed(2)} km
        </div>
      )}


    </div>
  );
}
