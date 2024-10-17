// pages/index.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur notre Application</h1>
      <p className="mb-6 text-lg">Connectez-vous pour accéder à votre compte.</p>
      <Link href="/login" className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
        Login
      </Link>
    </div>
  );
}
