'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import {
    Users,
    Flame,
    Plus,
    UserMinus,
    MessageSquare,
    Zap,
    Shield,
    Info,
    ChevronRight,
    TrendingUp,
    Heart,
    Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { createCircle, joinCircle, leaveCircle as leaveCircleFirebase, listenToCircle, validateActivity } from '@/lib/firebase/circle-service';

interface Member {
    uid: string;
    name: string;
    photoURL?: string;
    hasValidatedToday: boolean;
    lastActive: string;
    streak: number;
}

const isToday = (dateString: string) => {
    if (!dateString) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString.split('T')[0] === today;
};

export function CirclePage() {
    const { language, translations } = useStore();
    const { user } = useAuth();
    const { circle, setCircle, leaveCircle } = useStore();
    const [showCreateJoin, setShowCreateJoin] = useState(false);
    const [circleCode, setCircleCode] = useState('');
    const [newCircleName, setNewCircleName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Mock data for initial state if no circle joined
    const hasCircle = !!circle.id;

    // Sync with Firebase
    useEffect(() => {
        if (!circle.id) return;

        const unsubscribe = listenToCircle(circle.id, (updatedCircle) => {
            setCircle(updatedCircle);
        });

        return () => unsubscribe();
    }, [circle.id, setCircle]);

    // Fire Component
    const FireComponent = ({ intensity, color }: { intensity: number, color: string }) => {
        return (
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Outer glow */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <path
                        d="M50 95 C30 95 15 80 15 60 C15 40 30 20 50 5 C70 20 85 40 85 60 C85 80 70 95 50 95 Z"
                        fill={color === 'grey' ? '#E5E7EB' : '#FCA5A5'}
                        opacity="0.3"
                    />
                    <path
                        d="M50 90 C35 90 25 80 25 65 C25 50 35 35 50 20 C65 35 75 50 75 65 C75 80 65 90 50 90 Z"
                        fill={color === 'grey' ? '#D1D5DB' : '#F87171'}
                        opacity="0.6"
                        style={{ transform: `scale(${0.5 + intensity / 200})`, transformOrigin: 'center bottom' }}
                    />
                    <path
                        d="M50 85 C40 85 35 75 35 65 C35 55 40 45 50 35 C60 45 65 55 65 65 C65 75 60 85 50 85 Z"
                        fill={color === 'grey' ? '#9CA3AF' : '#EF4444'}
                        filter={color === 'grey' ? '' : 'url(#glow)'}
                        style={{ transform: `scale(${0.7 + intensity / 300})`, transformOrigin: 'center bottom' }}
                    />
                    <Flame
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 ${color === 'grey' ? 'text-gray-400' : 'text-white'} transition-all duration-1000`}
                        strokeWidth={1.5}
                    />
                </svg>
            </div>
        );
    };

    const handleCreateCircle = async () => {
        if (!user || !newCircleName) return;
        setIsLoading(true);
        try {
            const circleId = await createCircle(user.uid, user.displayName || user.email || 'Moi', newCircleName);
            if (circleId) {
                setCircle({
                    id: circleId,
                    name: newCircleName,
                    members: [{ uid: user.uid, name: user.displayName || user.email || 'Moi', hasValidatedToday: false, lastActive: new Date().toISOString(), streak: 0 }],
                    guardianUid: user.uid,
                    fireIntensity: 0,
                    fireColor: 'grey'
                });
                setShowCreateJoin(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinCircle = async () => {
        if (!user || !circleCode) return;
        setIsLoading(true);
        try {
            const joinedData = await joinCircle(user.uid, user.displayName || user.email || 'Moi', circleCode);
            if (joinedData) {
                setCircle(joinedData);
                setShowCreateJoin(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLeaveCircle = async () => {
        if (!user || !circle.id) return;
        try {
            await leaveCircleFirebase(user.uid, circle.id);
            leaveCircle();
        } catch (error) {
            console.error(error);
        }
    };

    if (!hasCircle) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 space-y-8 animate-in fade-in duration-700">
                <div className="text-center space-y-3">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Le Cercle</h1>
                    <p className="text-gray-500 max-w-xs mx-auto text-lg leading-relaxed">
                        Rejoins tes amis pour un pacte de co-responsabilité et brillez ensemble.
                    </p>
                </div>

                <FireComponent intensity={0} color="grey" />

                <div className="w-full max-w-sm space-y-4 pt-8">
                    <Dialog open={showCreateJoin} onOpenChange={setShowCreateJoin}>
                        <DialogTrigger asChild>
                            <Button
                                className="w-full h-16 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #434343 100%)' }}
                            >
                                <Plus className="mr-2 h-6 w-6" /> Créer ou Rejoindre
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-[2rem] bg-white border-none shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Le Cercle</DialogTitle>
                                <DialogDescription className="text-base text-gray-500">
                                    Lancer un pacte avec tes amis (3 à 7 personnes).
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-emerald-500" /> Créer mon cercle
                                    </h4>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Nom du cercle..."
                                            className="rounded-xl border-gray-100 bg-gray-50 h-12"
                                            value={newCircleName}
                                            onChange={(e) => setNewCircleName(e.target.value)}
                                        />
                                        <Button
                                            onClick={handleCreateCircle}
                                            disabled={!newCircleName || isLoading}
                                            className="rounded-xl bg-gray-900 h-12 px-6"
                                        >
                                            {isLoading ? '...' : 'Créer'}
                                        </Button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-100"></span>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-3 text-gray-400 font-medium">Ou</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-500" /> Rejoindre un ami
                                    </h4>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Code d'invitation..."
                                            className="rounded-xl border-gray-100 bg-gray-50 h-12"
                                            value={circleCode}
                                            onChange={(e) => setCircleCode(e.target.value)}
                                        />
                                        <Button
                                            onClick={handleJoinCircle}
                                            disabled={!circleCode || isLoading}
                                            variant="secondary"
                                            className="rounded-xl h-12 px-6"
                                        >
                                            {isLoading ? '...' : 'Rejoindre'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="bg-blue-50 rounded-2xl p-4 flex gap-3 border border-blue-100">
                        <Info className="w-6 h-6 text-blue-500 shrink-0" />
                        <p className="text-sm text-blue-700 leading-snug">
                            Tes amis verront que tu as validé tes victoires, mais jamais le contenu. Ta vie privée reste intacte.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Active Circle View
    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{circle.name}</h1>
                    <p className="text-gray-500 font-medium mt-1">Pacte de co-responsabilité</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-2xl hover:bg-gray-200 transition-colors cursor-pointer">
                    <Share2 className="w-6 h-6 text-gray-600" />
                </div>
            </header>

            <div className="flex flex-col items-center justify-center space-y-4 bg-white/50 backdrop-blur-xl rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                {/* Fire Background Element */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-50/20 to-transparent pointer-events-none" />

                <FireComponent intensity={circle.fireIntensity} color={circle.fireColor} />

                <div className="text-center space-y-2 relative z-10">
                    <Badge className={`px-4 py-1.5 rounded-full text-sm font-bold ${circle.fireColor === 'bright' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {circle.fireColor === 'bright' ? 'Feu Actif 🔥' : 'Feu Éteint 🌑'}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-800">
                        {circle.fireIntensity}% de luminosité
                    </h3>
                    <p className="text-sm text-gray-500 max-w-[200px]">
                        Chaque victoire ajoutée ravive la flamme
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold text-gray-900">Membres ({circle.members.length})</h3>
                    {circle.guardianUid === user?.uid && (
                        <Badge variant="outline" className="rounded-lg border-emerald-200 text-emerald-600 bg-emerald-50">
                            <Shield className="w-3 h-3 mr-1" /> Gardien
                        </Badge>
                    )}
                </div>

                <div className="grid gap-4">
                    {circle.members.map((member) => (
                        <Card key={member.uid} className="rounded-3xl border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                                            <AvatarImage src={member.photoURL} />
                                            <AvatarFallback className="bg-gray-100 text-gray-600 font-bold">
                                                {member.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {member.hasValidatedToday && isToday(member.lastActive) && (
                                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                                                <Check className="w-3 h-3" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900 text-lg truncate">{member.name}</span>
                                            {member.uid === user?.uid && <Badge variant="secondary" className="text-[10px] h-4">Moi</Badge>}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                                            <Flame className={`w-3.5 h-3.5 ${member.hasValidatedToday && isToday(member.lastActive) ? 'text-orange-500' : 'text-gray-300'}`} fill={member.hasValidatedToday && isToday(member.lastActive) ? 'currentColor' : 'none'} />
                                            <span>{member.hasValidatedToday && isToday(member.lastActive) ? 'A validé sa victoire' : 'En attente...'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {!(member.hasValidatedToday && isToday(member.lastActive)) && member.uid !== user?.uid && (
                                            <Button size="icon" variant="ghost" className="rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-100">
                                                <Zap className="w-5 h-5" />
                                            </Button>
                                        )}
                                        {circle.guardianUid === user?.uid && member.uid !== user?.uid && (
                                            <Button size="icon" variant="ghost" className="rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50">
                                                <UserMinus className="w-5 h-5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="pt-4 pb-12">
                <Button
                    variant="ghost"
                    onClick={handleLeaveCircle}
                    className="w-full h-14 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 font-medium"
                >
                    Quitter le cercle
                </Button>
            </div>
        </div>
    );
}
