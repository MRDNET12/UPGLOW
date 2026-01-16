'use client';

import { useEffect, useState } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { getRecentEnergyLogs, getAverageEnergy } from '@/lib/firebase/goals-service';
import { useAuth } from '@/contexts/AuthContext';
import type { EnergyLog } from '@/types/goals';

export function EnergyHistory() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<EnergyLog[]>([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [energyLogs, avgEnergy] = await Promise.all([
          getRecentEnergyLogs(user.uid, 7),
          getAverageEnergy(user.uid, 7)
        ]);
        setLogs(energyLogs);
        setAverage(avgEnergy);
      } catch (error) {
        console.error('Error fetching energy history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-stone-200 rounded w-1/3"></div>
          <div className="h-32 bg-stone-200 rounded"></div>
        </div>
      </div>
    );
  }

  const maxEnergy = Math.max(...logs.map(l => l.energyLevel), 100);
  const trend = logs.length >= 2 
    ? logs[0].energyLevel - logs[logs.length - 1].energyLevel 
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-semibold text-stone-900">Ton Énergie</h3>
        </div>
        <div className="flex items-center gap-2">
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : trend < 0 ? (
            <TrendingDown className="w-4 h-4 text-orange-500" />
          ) : null}
          <span className="text-sm text-stone-600">7 derniers jours</span>
        </div>
      </div>

      {/* Moyenne */}
      <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl">
        <div className="text-sm text-stone-600 mb-1">Moyenne hebdomadaire</div>
        <div className="text-3xl font-bold text-rose-500">{average}%</div>
      </div>

      {/* Graphique simple */}
      {logs.length > 0 ? (
        <div className="space-y-4">
          <div className="h-32 flex items-end gap-2">
            {logs.slice().reverse().map((log, index) => (
              <div key={log.id} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-rose-400 to-orange-300 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${(log.energyLevel / maxEnergy) * 100}%` }}
                  title={`${log.energyLevel}%`}
                />
                <div className="text-xs text-stone-400">
                  {new Date(log.timestamp).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="pt-4 border-t border-stone-100">
            <div className="text-sm text-stone-600">
              {average >= 70 && (
                <p className="flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <span>Tu es en pleine forme ! Continue comme ça !</span>
                </p>
              )}
              {average >= 40 && average < 70 && (
                <p className="flex items-center gap-2">
                  <span className="text-lg">💫</span>
                  <span>Ton énergie est stable. Pense à prendre des pauses.</span>
                </p>
              )}
              {average < 40 && (
                <p className="flex items-center gap-2">
                  <span className="text-lg">🌙</span>
                  <span>Ton énergie est basse. Prends soin de toi. 💖</span>
                </p>
              )}
            </div>
          </div>

          {/* Détails des états */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500 mb-1">État mental fréquent</div>
              <div className="text-sm font-medium text-stone-700">
                {getMostFrequent(logs.map(l => l.mentalState))}
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500 mb-1">État physique fréquent</div>
              <div className="text-sm font-medium text-stone-700">
                {getMostFrequent(logs.map(l => l.physicalState))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-stone-400">
          <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucune donnée pour le moment</p>
          <p className="text-xs mt-1">Fais ton premier check-in ! 💫</p>
        </div>
      )}
    </div>
  );
}

// Helper pour trouver l'état le plus fréquent
function getMostFrequent(arr: string[]): string {
  const counts: Record<string, number> = {};
  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });
  
  const labels: Record<string, string> = {
    calm: '😌 Calme',
    stressed: '😰 Stressée',
    motivated: '🔥 Motivée',
    tired: '😴 Fatiguée',
    fit: '💪 En forme',
    sick: '🤒 Malade',
    energetic: '⚡ Énergique'
  };
  
  const most = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return most ? labels[most[0]] || most[0] : '-';
}

