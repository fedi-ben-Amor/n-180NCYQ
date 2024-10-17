
import { validateAddress } from '../utils/validateAddress'; 
import { useSession } from "next-auth/react";
import { useState } from "react";

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
    } else {
      console.log(`L'adresse est hors de la zone autorisée. Elle est à ${distance} km de Paris.`);
      alert(`L'adresse est à ${distance.toFixed(2)} km de Paris, ce qui dépasse la limite de 50 km.`);
    }
  };

  if (!session || !session.user) {
    return <p>Veuillez vous connecter.</p>;
  }

  return (
    <div>
      <h1>Profil de {session.user.name}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nom : 
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </label>
        <label>
          Prénom :
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
        </label>
        <label>
          Date de naissance :
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} />
        </label>
        <label>
          Adresse :
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
        </label>
        <label>
          Numéro de téléphone :
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
        </label>
        <button type="submit">Mettre à jour</button>
      </form>

      {distance !== null && (
        <p>
          Distance de l'adresse à Paris : {distance.toFixed(2)} km
        </p>
      )}
    </div>
  );
}
