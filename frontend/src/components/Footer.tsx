'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export function Footer() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <footer className="border-t bg-white mt-auto">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Kontakt</h3>
            <div className="mt-4 space-y-2">
              <a href="mailto:kontakt@gefylenquiz.fun" className="text-gray-600 hover:text-indigo-600">kontakt@gefylenquiz.fun</a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Åpningstider</h3>
            <div className="mt-4 space-y-2">
              <p className="text-gray-600">Alltid</p>
            </div>
          </div>
        </div>

        {/* Copyright and Logout */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col items-center">
          <p className="text-center text-gray-500 text-sm mb-4">
            © {new Date().toLocaleDateString('nb-NO', { year: 'numeric' })} Gefylen Quiz. Alle rettigheter reservert.
          </p>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200"
            >
              Logg ut
            </button>
          )}
        </div>
      </div>
    </footer>
  );
} 