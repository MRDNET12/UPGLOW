'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Crown, 
  TrendingUp, 
  Users, 
  CreditCard, 
  ArrowLeft,
  Loader2,
  BarChart3,
  Calendar,
  Smartphone,
  UserPlus,
  Timer,
  Target
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  glowStartSubscribers: number;
  glowPlusSubscribers: number;
  totalSubscribers: number;
  monthlyRevenue: number;
  conversionRate: number;
  freeUsers: number;
  activeToday: number;
  // Nouvelles stats
  conversion3Days: number; // Taux de conversion après 3 jours
  androidInstalls: number;
  newRegistrations: number; // Inscriptions des 7 derniers jours
  usersExceeded3Days: number; // Utilisateurs ayant dépassé 3 jours
  subscribedAfter3Days: number; // Abonnés après avoir dépassé 3 jours
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Attendre que les données utilisateur soient chargées
    if (loading) return;
    
    // Vérifier si l'utilisateur est admin
    console.log('Admin check - User:', user?.email);
    console.log('Admin check - UserData:', userData);
    console.log('Admin check - isAdmin:', userData?.isAdmin);
    
    if (!user || !userData?.isAdmin) {
      console.log('Redirecting to home - Not admin');
      router.push('/');
      return;
    }

    fetchStats();
  }, [user, userData, router, loading]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      if (!db) {
        throw new Error('Firebase non configuré');
      }
      
      // Récupérer tous les utilisateurs
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      let totalUsers = 0;
      let glowStartSubscribers = 0;
      let glowPlusSubscribers = 0;
      let freeUsers = 0;
      let activeToday = 0;
      let usersExceeded3Days = 0;
      let subscribedAfter3Days = 0;
      let newRegistrations = 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        totalUsers++;
        
        // Compter les abonnés par plan
        if (data.hasPaid) {
          if (data.planType === 'glow_plus') {
            glowPlusSubscribers++;
          } else if (data.planType === 'glow_start') {
            glowStartSubscribers++;
          } else {
            // Anciens utilisateurs sans planType défini
            glowStartSubscribers++;
          }
        } else {
          freeUsers++;
        }
        
        // Vérifier si actif aujourd'hui
        if (data.lastActive) {
          const lastActive = data.lastActive.toDate ? data.lastActive.toDate() : new Date(data.lastActive);
          if (lastActive >= today) {
            activeToday++;
          }
        }
        
        // Vérifier si l'utilisateur a dépassé 3 jours
        if (data.firstOpenDate) {
          const firstOpen = new Date(data.firstOpenDate);
          const daysSince = Math.floor((today.getTime() - firstOpen.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSince >= 3) {
            usersExceeded3Days++;
            if (data.hasPaid) {
              subscribedAfter3Days++;
            }
          }
        }
        
        // Compter les nouvelles inscriptions (7 derniers jours)
        if (data.createdAt) {
          const created = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          if (created >= sevenDaysAgo) {
            newRegistrations++;
          }
        } else if (data.registrationDate) {
          const regDate = new Date(data.registrationDate);
          if (regDate >= sevenDaysAgo) {
            newRegistrations++;
          }
        }
      });
      
      // Calculer les revenus mensuels
      const monthlyRevenue = (glowStartSubscribers * 1.99) + (glowPlusSubscribers * 3.99);
      
      // Calculer le taux de conversion global
      const totalSubscribers = glowStartSubscribers + glowPlusSubscribers;
      const conversionRate = totalUsers > 0 ? (totalSubscribers / totalUsers) * 100 : 0;
      
      // Calculer le taux de conversion après 3 jours
      const conversion3Days = usersExceeded3Days > 0 ? (subscribedAfter3Days / usersExceeded3Days) * 100 : 0;
      
      // Récupérer les installations Android (depuis analytics ou collection dédiée)
      let androidInstalls = 0;
      try {
        const installsRef = collection(db, 'installs');
        const installsSnapshot = await getDocs(installsRef);
        installsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.platform === 'android') {
            androidInstalls++;
          }
        });
      } catch (e) {
        // La collection n'existe peut-être pas encore
        androidInstalls = 0;
      }
      
      setStats({
        totalUsers,
        glowStartSubscribers,
        glowPlusSubscribers,
        totalSubscribers,
        monthlyRevenue,
        conversionRate,
        freeUsers,
        activeToday,
        conversion3Days,
        androidInstalls,
        newRegistrations,
        usersExceeded3Days,
        subscribedAfter3Days
      });
      
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="text-xl mb-4">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full font-semibold">
              <Crown className="w-5 h-5" />
              <span>Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Utilisateurs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            <p className="text-sm text-gray-600 mt-1">Utilisateurs inscrits</p>
          </div>

          {/* Abonnés Glow Start */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm text-gray-500">Plan Start</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.glowStartSubscribers}</p>
            <p className="text-sm text-gray-600 mt-1">à 1.99€/mois</p>
          </div>

          {/* Abonnés Glow Plus */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-violet-100 rounded-xl">
                <Crown className="w-6 h-6 text-violet-600" />
              </div>
              <span className="text-sm text-gray-500">Plan Plus</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.glowPlusSubscribers}</p>
            <p className="text-sm text-gray-600 mt-1">à 3.99€/mois</p>
          </div>

          {/* Revenus Mensuels */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Mensuel</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.monthlyRevenue.toFixed(2)}€</p>
            <p className="text-sm text-gray-600 mt-1">Revenus estimés</p>
          </div>
        </div>

        {/* NOUVELLES STATS - Section Acquisition */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-pink-500" />
          Acquisition & Conversion
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Installations Android */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Smartphone className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-500">Android</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{stats.androidInstalls}</p>
            <p className="text-sm text-gray-600 mt-1">Installations de l'app</p>
          </div>

          {/* Nouvelles Inscriptions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">7 derniers jours</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.newRegistrations}</p>
            <p className="text-sm text-gray-600 mt-1">Nouvelles inscriptions</p>
          </div>

          {/* Conversion après 3 jours */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-100 rounded-xl">
                <Timer className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-sm text-gray-500">Après 3 jours</span>
            </div>
            <p className="text-3xl font-bold text-pink-600">{stats.conversion3Days.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 mt-1">
              {stats.subscribedAfter3Days || Math.round((stats.conversion3Days / 100) * stats.usersExceeded3Days)} / {stats.usersExceeded3Days} utilisateurs
            </p>
          </div>
        </div>

        {/* Stats Secondaires */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-gray-600" />
          Statistiques Générales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Taux de Conversion Global */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800">Taux Global</h3>
            </div>
            <p className="text-4xl font-bold text-purple-600">{stats.conversionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 mt-2">
              {stats.totalSubscribers} abonnés sur {stats.totalUsers} utilisateurs
            </p>
          </div>

          {/* Utilisateurs Gratuits */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="font-bold text-gray-800">Gratuits</h3>
            </div>
            <p className="text-4xl font-bold text-gray-600">{stats.freeUsers}</p>
            <p className="text-sm text-gray-600 mt-2">
              Potentiel de conversion
            </p>
          </div>

          {/* Actifs Aujourd'hui */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800">Actifs</h3>
            </div>
            <p className="text-4xl font-bold text-green-600">{stats.activeToday}</p>
            <p className="text-sm text-gray-600 mt-2">
              Utilisateurs connectés aujourd'hui
            </p>
          </div>
        </div>

        {/* Graphiques et Détails */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition des plans */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-800">Répartition des Abonnements</h3>
            </div>
            
            <div className="space-y-4">
              {/* Glow Start Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Glow Start (1.99€)</span>
                  <span className="text-sm text-gray-600">{stats.glowStartSubscribers}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalSubscribers > 0 ? (stats.glowStartSubscribers / stats.totalSubscribers) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Glow Plus Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Glow Plus (3.99€)</span>
                  <span className="text-sm text-gray-600">{stats.glowPlusSubscribers}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalSubscribers > 0 ? (stats.glowPlusSubscribers / stats.totalSubscribers) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Gratuit Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Gratuit</span>
                  <span className="text-sm text-gray-600">{stats.freeUsers}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.freeUsers / stats.totalUsers) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Revenus détaillés */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-gray-600" />
              <h3 className="text-lg font-bold text-gray-800">Détail des Revenus</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800">Glow Start</p>
                  <p className="text-sm text-gray-600">{stats.glowStartSubscribers} abonnés × 1.99€</p>
                </div>
                <p className="text-xl font-bold text-amber-600">
                  {(stats.glowStartSubscribers * 1.99).toFixed(2)}€
                </p>
              </div>

              <div className="flex justify-between items-center p-4 bg-violet-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800">Glow Plus</p>
                  <p className="text-sm text-gray-600">{stats.glowPlusSubscribers} abonnés × 3.99€</p>
                </div>
                <p className="text-xl font-bold text-violet-600">
                  {(stats.glowPlusSubscribers * 3.99).toFixed(2)}€
                </p>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-800">Total Mensuel</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.monthlyRevenue.toFixed(2)}€
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Revenus récurrents estimés (MRR)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton refresh */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchStats}
            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-colors flex items-center gap-2 mx-auto"
          >
            <Loader2 className="w-5 h-5" />
            Actualiser les statistiques
          </button>
        </div>
      </div>
    </div>
  );
}
