'use client'; // only needed in app directory

import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '../providers/UserContextProvider';

const Navbar = () => {
  const { user, loading, setUser, refreshUser } = useUser();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    refreshUser();
    // Optionally, redirect to home or login
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo + Brand Name */}
      <Link href="/">
        <Image
            src="/shrinkr_logo.svg"
            alt="Logo"
            width={100}
            height={100}
        />
      </Link>

      {/* Navigation buttons */}
      <div className="space-x-4">
        {loading ? null : user ? (
          <>
            <span className="px-4 py-2 text-gray-700">{user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 border border-red-600 rounded-xl hover:bg-red-50 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
