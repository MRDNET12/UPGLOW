'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import {
    Zap,
    Moon,
    Coffee,
    Wind,
    Heart,
    Sun,
    Sparkles,
    Droplets,
    Check,
    Plus,
    Lock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export const EnergyPage = () => {
    const {
        energy,
        maxEnergy,
        rechargeEnergy,
        energyActions,
        resetEnergyIfNeeded,
        language
    } = useStore();

    useEffect(() => {
        resetEnergyIfNeeded();
    }, [resetEnergyIfNeeded]);

    const rechargeCategories = [
        {
            title: language === 'fr' ? 'Physique & Dodo' : 'Physical & Sleep',
            icon: <Moon className="w-5 h-5 text-indigo-500" />,
            actions: [
                { text: 'Dormir 8h', points: 45, icon: '💤' },
                { text: 'Sieste de 20 min', points: 15, icon: '😴' },
                { text: 'Douche bien chaude', points: 10, icon: '🚿' },
                { text: 'S\'étirer ou yoga', points: 10, icon: '🧘' },
                { text: 'Manger', points: 15, icon: '🍱' },
                { text: 'Boire 1L d\'eau', points: 5, icon: '💧' },
            ]
        },
        {
            title: language === 'fr' ? 'Déconnexion & Mental' : 'Disconnect & Mental',
            icon: <Wind className="w-5 h-5 text-blue-500" />,
            actions: [
                { text: 'Lâcher le tel 1h', points: 20, icon: '📵' },
                { text: 'Lire un vrai bouquin', points: 15, icon: '📖' },
                { text: 'Méditer 10 min', points: 15, icon: '🧘‍♀️' },
                { text: 'S\'allonger 20 min', points: 15, icon: '🛌' },
                { text: 'Écrire ses pensées', points: 10, icon: '✍️' },
            ]
        },
        {
            title: language === 'fr' ? 'Dehors & Nature' : 'Nature & Outdoors',
            icon: <Sun className="w-5 h-5 text-orange-500" />,
            actions: [
                { text: 'Marcher 30 min (forêt)', points: 25, icon: '🌲' },
                { text: '15 min au soleil', points: 10, icon: '☀️' },
                { text: 'Arroser ses plantes', points: 10, icon: '🌿' },
                { text: 'Ouvrir les fenêtres', points: 5, icon: '🪟' },
            ]
        },
        {
            title: language === 'fr' ? 'Plaisir & Social' : 'Pleasure & Social',
            icon: <Heart className="w-5 h-5 text-pink-500" />,
            actions: [
                { text: 'Faire un câlin', points: 15, icon: '🫂' },
                { text: 'Boire un café', points: 10, icon: '☕' },
                { text: 'Discuter et rire', points: 10, icon: '😂' },
                { text: 'Dessin ou puzzle', points: 10, icon: '🎨' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FD] pb-24 animate-in fade-in duration-500">
            {/* Energy Header */}
            <div className="bg-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-sm border-b border-blue-50">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Ma Recharge</h1>
                        <p className="text-sm text-gray-500 font-medium">Récupère ton Mana biologique</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-blue-500" fill="currentColor" />
                    </div>
                </div>

                {/* Main Energy Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-4xl font-black text-blue-600">
                            {energy} <span className="text-lg text-blue-400">Mana</span>
                        </span>
                        <span className="text-sm font-bold text-gray-400">Objetif: {maxEnergy}</span>
                    </div>
                    <div className="relative h-6 bg-blue-100 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="absolute inset-x-0 h-full bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 transition-all duration-1000 ease-out"
                            style={{ width: `${(energy / maxEnergy) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripe_2s_linear_infinite]" />
                        </div>
                    </div>
                    {energy < 20 && (
                        <p className="text-xs font-bold text-red-500 animate-pulse flex items-center gap-1 mt-2">
                            <Lock className="w-3 h-3" /> Énergie critique ! Recharge-toi pour agir.
                        </p>
                    )}
                </div>
            </div>

            {/* Recharge Sections */}
            <div className="px-5 mt-8 space-y-8">
                {rechargeCategories.map((cat, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            {cat.icon}
                            <h2 className="text-lg font-bold text-gray-800">{cat.title}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {cat.actions.map((action, actionIdx) => (
                                <button
                                    key={actionIdx}
                                    onClick={() => rechargeEnergy(action.points, action.text, cat.title)}
                                    className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-start gap-2 hover:border-blue-200 hover:shadow-md active:scale-95 transition-all group"
                                >
                                    <span className="text-2xl">{action.icon}</span>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-gray-800 leading-tight">{action.text}</p>
                                        <p className="text-xs font-black text-blue-500 mt-1">+{action.points} Mana</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Today's Recharge Log */}
            {energyActions.length > 0 && (
                <div className="px-5 mt-10 pb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">Activités du jour</h2>
                    <div className="space-y-3">
                        {energyActions.slice(0, 5).map((log) => (
                            <div key={log.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    <span className="text-sm font-medium text-gray-700">{log.text}</span>
                                </div>
                                <span className="text-sm font-black text-blue-500">+{log.points}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
