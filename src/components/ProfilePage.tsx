import React, { useMemo, useState } from 'react';
import {
    User, LogOut, LogIn, ChevronLeft, Calendar,
    Crown, Star, Settings, Bell, BellOff, HelpCircle,
    Globe, Moon, Sun, ChevronRight, Mail, Check, Zap, Droplet,
    TrendingUp, Image as ImageIcon, Shield, Download, Trophy, Share, X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
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
        objectifsInitiaux,
        bonusProgress
    } = useStore();

    const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
    const [showInstallDrawer, setShowInstallDrawer] = useState(false);
    const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

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
        <div className="pb-28 bg-[#F7F8FA] dark:bg-stone-900 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Background decoration */}
            <div className="fixed top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#F7F8FA] to-transparent dark:from-[#1c2e2c] pointer-events-none" />

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

                        <button
                            onClick={() => setShowInstallDrawer(true)}
                            className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/5 hover:bg-white/20 transition-colors"
                        >
                            <Download className="w-6 h-6 text-emerald-100" />
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

                    <div className="w-full space-y-4">
                        {/* Progress Box */}
                        <div className="bg-gradient-to-br from-pink-50 to-white dark:from-stone-800 dark:to-stone-900 rounded-[2rem] p-5 shadow-lg shadow-pink-100/50 dark:shadow-none hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden border border-pink-100 dark:border-stone-700 group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                                <Trophy className="w-32 h-32 text-pink-600" />
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-stone-700 flex items-center justify-center mb-4 shadow-sm text-pink-500">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <p className="text-4xl font-extrabold text-slate-800 dark:text-white mb-1 tracking-tight">
                                {bonusProgress?.smallWins?.length || 0}
                            </p>
                            <p className="text-xs font-bold text-pink-500/80 uppercase tracking-wider">
                                {language === 'fr' ? 'Petits Succès' : language === 'en' ? 'Small Wins' : 'Pequeños Éxitos'}
                            </p>
                        </div>


                    </div>
                </div>

                {/* Goals Section - "Get tested" style list */}

                {/* Settings List - "Visualisation" style or "Get tested" checkmarks */}
                <div className="space-y-4 mb-8">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg px-2">
                        {language === 'fr' ? 'Paramètres' : 'Settings'}
                    </h3>


                    {/* Notifications */}
                    <div className="bg-white dark:bg-stone-800 rounded-[2rem] p-2 pr-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => setShowNotificationDrawer(true)}>
                        <div className="w-14 h-14 rounded-[1.5rem] bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center group-hover:scale-95 transition-transform">
                             <Bell className="w-6 h-6 text-rose-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-700 dark:text-slate-200">Notifications</span>
                             <span className="text-xs text-slate-400">
                                {language === 'fr' ? 'Toucher pour activer' : 'Tap to enable'}
                            </span>
                        </div>
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
                    <button
                        onClick={() => setShowPrivacyDialog(true)}
                        className="bg-white dark:bg-stone-800 p-4 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2 text-center text-slate-600 dark:text-slate-400 group"
                    >
                        <Shield className="w-6 h-6 mb-1 text-emerald-500 group-hover:scale-110 transition-transform" />
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
            {/* Privacy Dialog */}
            <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
                <DialogContent className="max-w-xs mx-auto rounded-3xl bg-white dark:bg-stone-800 border border-gray-100 dark:border-stone-700 p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white text-center mb-2">
                            {language === 'fr' ? 'Confidentialité' : 'Privacy'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 dark:text-slate-300 text-center font-medium leading-relaxed">
                            {language === 'fr'
                                ? "Nous ne collectons aucune donnée, tout est enregistré sur votre téléphone localement."
                                : "We do not collect any data, everything is stored locally on your phone."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center mt-6">
                        <Button
                            onClick={() => setShowPrivacyDialog(false)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8 shadow-lg shadow-emerald-500/20"
                        >
                            OK
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Install App Drawer */}
            <Drawer open={showInstallDrawer} onOpenChange={setShowInstallDrawer}>
                <DrawerContent className="max-w-lg mx-auto bg-white rounded-t-[2rem]">
                    <DrawerHeader className="border-b pb-4">
                        <div className="flex items-center justify-between">
                            <DrawerTitle className="text-xl font-bold">
                                {language === 'fr' ? 'Installer l\'application' : language === 'en' ? 'Install the app' : 'Instalar la aplicación'}
                            </DrawerTitle>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                                    <X className="w-5 h-5" />
                                </Button>
                            </DrawerClose>
                        </div>
                    </DrawerHeader>

                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        {/* iOS Instructions */}
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">🍎</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">iOS</h3>
                                    <p className="text-xs text-gray-500">iPhone & iPad</p>
                                </div>
                            </div>
                            <ol className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                    <span>Ouvrez <strong>Safari</strong> et visitez cette app</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                    <span>Appuyez sur le bouton <Share className="w-3 h-3 inline mx-1" /> <strong>Partager</strong></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                    <span>Faites défiler et appuyez sur <strong>"Ajouter à l'écran d'accueil"</strong></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                    <span>Appuyez sur <strong>Ajouter</strong> en haut à droite</span>
                                </li>
                            </ol>
                        </div>

                        {/* Android Instructions */}
                        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-5 border border-emerald-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">Android</h3>
                                    <p className="text-xs text-gray-500">Chrome recommandé</p>
                                </div>
                            </div>
                            <ol className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                    <span>Ouvrez <strong>Chrome</strong> et visitez cette app</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                    <span>Appuyez sur le menu <strong>⋮</strong> (3 points en haut)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                    <span>Sélectionnez <strong>"Ajouter à l'écran d'accueil"</strong> ou <strong>"Installer"</strong></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                    <span>Confirmez en appuyant sur <strong>Ajouter</strong></span>
                                </li>
                            </ol>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-5 border border-purple-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-lg flex-shrink-0">
                                    💡
                                </div>
                                <p className="text-sm text-gray-700">
                                    <strong>Astuce :</strong> Une fois installée, l'application fonctionne hors-ligne et offre une expérience optimale !
                                </p>
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Notification Drawer */}
            <Drawer open={showNotificationDrawer} onOpenChange={setShowNotificationDrawer}>
                <DrawerContent className="max-w-lg mx-auto bg-white rounded-t-[2rem]">
                    <DrawerHeader className="border-b pb-4">
                        <div className="flex items-center justify-between">
                            <DrawerTitle className="text-xl font-bold">
                                {language === 'fr' ? 'Notifications' : language === 'en' ? 'Notifications' : 'Notificaciones'}
                            </DrawerTitle>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                                    <X className="w-5 h-5" />
                                </Button>
                            </DrawerClose>
                        </div>
                    </DrawerHeader>

                    <div className="p-6 space-y-6">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-10 h-10 text-rose-500" />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2">
                                {language === 'fr' ? 'Activez les notifications' : language === 'en' ? 'Enable notifications' : 'Activa las notificaciones'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {language === 'fr' 
                                    ? "Pour une meilleure expérience, nous vous recommandons d'installer l'application avant d'activer les notifications."
                                    : language === 'en' 
                                        ? "For a better experience, we recommend installing the app before enabling notifications."
                                        : "Para una mejor experiencia, le recomendamos instalar la aplicación antes de activar las notificaciones."}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white text-lg flex-shrink-0">
                                    📱
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 mb-1">
                                        {language === 'fr' ? 'Conseil' : language === 'en' ? 'Tip' : 'Consejo'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {language === 'fr' 
                                            ? "Installez l'application pour recevoir des rappels quotidiens et ne jamais manquer vos objectifs !"
                                            : language === 'en' 
                                                ? "Install the app to receive daily reminders and never miss your goals!"
                                                : "¡Instale la aplicación para recibir recordatorios diarios y nunca pierda sus objetivos!"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button 
                            onClick={() => {
                                setShowNotificationDrawer(false);
                                setShowInstallDrawer(true);
                            }}
                            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl py-6 font-bold shadow-lg shadow-rose-500/30"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            {language === 'fr' ? "Installer l'application" : language === 'en' ? "Install the app" : "Instalar la aplicación"}
                        </Button>

                        <Button 
                            variant="ghost"
                            onClick={() => setShowNotificationDrawer(false)}
                            className="w-full text-gray-500"
                        >
                            {language === 'fr' ? 'Plus tard' : language === 'en' ? 'Later' : 'Más tarde'}
                        </Button>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};
