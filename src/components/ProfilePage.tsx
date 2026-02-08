import React, { useMemo } from 'react';
import {
    User, LogOut, LogIn, ChevronLeft, Calendar,
    Crown, Star, Settings, Bell, BellOff, HelpCircle,
    Globe, Moon, Sun, ChevronRight, Mail, Check,
    TrendingUp, Image as ImageIcon, Shield, Smartphone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/translations';

interface ProfilePageProps {
    setShowAuthDialog: (show: boolean) => void;
    setShowPlanSelection: (show: boolean) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
    setShowAuthDialog,
    setShowPlanSelection
}) => {
    const { user, userData, signOut } = useAuth();
    const {
        setCurrentView,
        subscription,
        theme,
        setTheme,
        language,
        setLanguage,
        notificationsEnabled,
        setNotificationsEnabled,
        challengeProgress,
        getProgressPercentage,
        visionBoardImages,
        objectifPrincipal,
        objectifsPrioritaires,
        objectifsInitiaux
    } = useStore();

    const handleSignOut = () => {
        if (confirm(language === 'fr' ? 'Voulez-vous vous déconnecter ?' : language === 'en' ? 'Sign out?' : '¿Cerrar sesión?')) {
            signOut();
        }
    };

    const formattedDate = new Date().toLocaleDateString(
        language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES',
        { weekday: 'long', day: 'numeric', month: 'long' }
    );

    return (
        <div className="pb-28 min-h-screen bg-[#F2F6F5] dark:bg-stone-900 font-sans">
            {/* Background decoration */}
            <div className="fixed top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#E0ECE9] to-transparent dark:from-[#1c2e2c] pointer-events-none" />

            <div className="relative z-10 max-w-md mx-auto px-5 pt-8">

                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentView('dashboard')}
                        className="w-12 h-12 rounded-full bg-white dark:bg-stone-800 shadow-sm hover:scale-105 transition-all text-slate-700 dark:text-slate-200"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-[10px]">
                        {language === 'fr' ? 'Mon Espace' : language === 'en' ? 'My Space' : 'Mi Espacio'}
                    </span>
                    <Button
                        variant="ghost"
                        onClick={user ? handleSignOut : () => setShowAuthDialog(true)}
                        className={`w-12 h-12 rounded-full shadow-sm hover:scale-105 transition-all ${user ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                            }`}
                    >
                        {user ? <LogOut className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                    </Button>
                </div>

                {/* User Card - Inspired by "Good Morning Michael" card */}
                <div className="bg-[#1A4D45] dark:bg-[#15302c] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#1A4D45]/20 mb-8 relative overflow-hidden group">
                    {/* Decorative circles */}
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-emerald-400/10 rounded-full blur-xl" />

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-[#E8F7F5] flex items-center justify-center text-3xl shadow-lg border-2 border-[#E8F7F5]/20">
                                    {user ? '👩‍🦰' : '👤'}
                                </div>
                                {user && (
                                    <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#1A4D45]">
                                        VIP
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-emerald-100/80 text-xs font-medium uppercase tracking-wider mb-1">
                                    {formattedDate}
                                </p>
                                <h2 className="text-2xl font-bold leading-tight">
                                    {user ? (
                                        <>
                                            Bonjour,<br />
                                            <span className="text-emerald-200">{user.email?.split('@')[0]}</span>
                                        </>
                                    ) : (
                                        language === 'fr' ? 'Bienvenue' : 'Welcome'
                                    )}
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        {subscription.isSubscribed ? (
                            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                                    <Crown className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-orange-200 font-bold uppercase tracking-wider">Plan Actuel</p>
                                    <p className="text-sm font-bold text-white">Glow Plus</p>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowPlanSelection(true)}
                                className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-3 flex items-center justify-between shadow-lg shadow-orange-900/20 hover:scale-[1.02] transition-transform"
                            >
                                <span className="font-bold text-sm ml-2">Upgrade to Pro</span>
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <Crown className="w-4 h-4 text-white" />
                                </div>
                            </button>
                        )}

                        <button className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors">
                            <Calendar className="w-6 h-6 text-emerald-100" />
                        </button>
                    </div>
                </div>

                {/* Quick Stats - "Health stats" style */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                            {language === 'fr' ? 'Mes Statistiques' : language === 'en' ? 'My Stats' : 'Mis Estadísticas'}
                        </h3>
                        <span className="text-xs font-medium text-slate-400 bg-white dark:bg-stone-800 px-3 py-1 rounded-full shadow-sm">
                            Today
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Progress Box */}
                        <div className="bg-white dark:bg-stone-800 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <TrendingUp className="w-24 h-24 text-emerald-600" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                                {getProgressPercentage()}<span className="text-sm text-slate-400">%</span>
                            </p>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Global Glow
                            </p>
                            <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${getProgressPercentage()}%` }} />
                            </div>
                        </div>

                        {/* Days Box */}
                        <div className="bg-white dark:bg-stone-800 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Check className="w-24 h-24 text-blue-600" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                <Check className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                                {challengeProgress.completedDays.length}
                            </p>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                {language === 'fr' ? 'Jours Complétés' : 'Days Done'}
                            </p>
                            <div className="mt-3 flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= (challengeProgress.completedDays.length % 5 || 5) ? 'bg-blue-500' : 'bg-slate-100'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Goals Section - "Get tested" style list */}
                {objectifPrincipal && (
                    <div className="bg-white dark:bg-stone-800 rounded-[2.5rem] p-6 shadow-sm mb-8">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
                            {language === 'fr' ? 'Focus Principal' : 'Main Focus'}
                        </h3>

                        <div className="bg-[#F2F6F5] dark:bg-stone-900 rounded-2xl p-4 border border-emerald-100/50 dark:border-stone-700 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-stone-800 flex items-center justify-center shadow-sm text-2xl">
                                🎯
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                    {objectifPrincipal}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {objectifsPrioritaires.length} {language === 'fr' ? 'sous-objectifs' : 'sub-goals'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings List - "Visualisation" style or "Get tested" checkmarks */}
                <div className="space-y-4 mb-8">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg px-2">
                        {language === 'fr' ? 'Paramètres' : 'Settings'}
                    </h3>

                    {/* Theme Toggle */}
                    <div className="bg-white dark:bg-stone-800 rounded-[2rem] p-2 pr-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:scale-95 transition-transform">
                                {theme === 'light' ? <Sun className="w-6 h-6 text-indigo-500" /> : <Moon className="w-6 h-6 text-indigo-400" />}
                            </div>
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                                {language === 'fr' ? 'Apparence' : 'Appearance'}
                            </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-stone-800 rounded-[2rem] p-2 pr-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-[1.5rem] bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center group-hover:scale-95 transition-transform">
                                {notificationsEnabled ? <Bell className="w-6 h-6 text-rose-500" /> : <BellOff className="w-6 h-6 text-slate-400" />}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-700 dark:text-slate-200">Notifications</span>
                                <span className="text-xs text-slate-400">
                                    {notificationsEnabled ? 'On' : 'Off'}
                                </span>
                            </div>
                        </div>
                        <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                    </div>

                    {/* Language */}
                    <div className="bg-white dark:bg-stone-800 rounded-[2rem] p-2 pr-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-95 transition-transform">
                                <Globe className="w-6 h-6 text-blue-500" />
                            </div>
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                                {language === 'fr' ? 'Langue' : 'Language'}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            {['fr', 'en', 'es'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLanguage(lang as Language);
                                    }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${language === lang
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110'
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                        }`}
                                >
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Support & Legal */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button className="bg-white dark:bg-stone-800 p-4 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 text-center text-slate-600 dark:text-slate-400">
                        <HelpCircle className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold">Help & FAQ</span>
                    </button>
                    <button className="bg-white dark:bg-stone-800 p-4 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 text-center text-slate-600 dark:text-slate-400">
                        <Shield className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold">Privacy</span>
                    </button>
                </div>

                {/* Dashboard Admin - Visible uniquement pour les admins */}
                {userData?.isAdmin && (
                    <div className="mb-20">
                        <button 
                            onClick={() => window.location.href = '/admin/dashboard'}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-3xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-white"
                        >
                            <Crown className="w-6 h-6" />
                            <span className="font-bold">Dashboard Admin</span>
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
