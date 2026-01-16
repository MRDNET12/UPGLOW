'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/lib/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requirePaid?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = false, 
  requirePaid = false 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const { canAccessApp } = useStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    // Si l'authentification est requise
    if (requireAuth && !user) {
      router.push('/');
      return;
    }

    // Si le paiement est requis
    if (requirePaid && (!userData || !userData.hasPaid)) {
      router.push('/');
      return;
    }

    // Vérifier l'accès général à l'app (période d'essai)
    if (!canAccessApp() && (!userData || !userData.hasPaid)) {
      router.push('/');
      return;
    }

    setIsChecking(false);
  }, [user, userData, loading, requireAuth, requirePaid, router, canAccessApp]);

  // Afficher un loader pendant la vérification
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/Glowee/glowee-encouragement.webp"
              alt="Glowee"
              className="w-24 h-24 object-contain animate-bounce"
            />
          </div>
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-rose-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

