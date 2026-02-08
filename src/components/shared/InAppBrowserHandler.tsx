'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Smartphone, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/useTranslation';

export const InAppBrowserHandler = () => {
    const [isInAppBrowser, setIsInAppBrowser] = useState(false);
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

        // Liste des in-app browsers connus
        const inAppRules = [
            'Instagram',
            'Pinterest',
            'FBAN',
            'FBAV', // Facebook
            'Line',
            'Twitter',
            'LinkedIn',
            'Snapchat',
            'TikTok'
        ];

        const isInApp = inAppRules.some(rule => userAgent.includes(rule));

        if (isInApp) {
            setIsInAppBrowser(true);

            // Tentative de redirection automatique pour Android
            const isAndroid = /android/i.test(userAgent);
            if (isAndroid) {
                // Essayer d'ouvrir dans Chrome via intent
                const url = window.location.href;
                const intentUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;

                // Fallback simple: essayer d'ouvrir une nouvelle fenêtre
                // window.open(url, '_system'); 

                // Redirection via intent
                window.location.href = intentUrl;
            }
        }
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isInAppBrowser) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-md p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
                <div className="flex flex-col items-center text-center space-y-4">

                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center shadow-inner mb-2">
                        <ExternalLink className="w-8 h-8 text-rose-500" />
                    </div>

                    <h2 className="text-xl font-bold text-gray-800">
                        Ouvrir dans le navigateur
                    </h2>

                    <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                        Pour une meilleure expérience (payement, connexion), ouvrez l'application dans votre navigateur externe (Safari ou Chrome).
                    </p>

                    <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 mt-4 space-y-3">
                        <div className="flex items-center gap-3 text-left">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-lg font-bold text-gray-400 border border-gray-100 shrink-0">
                                1
                            </div>
                            <p className="text-sm text-gray-700">
                                Appuyez sur les <span className="font-bold">...</span> ou le bouton de partage en haut/bas de l'écran
                            </p>
                        </div>

                        <div className="flex items-center gap-3 text-left">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-lg font-bold text-gray-400 border border-gray-100 shrink-0">
                                2
                            </div>
                            <p className="text-sm text-gray-700">
                                Sélectionnez <span className="font-bold">Ouvrir dans le navigateur</span>
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-400">Ou copier le lien</span>
                        </div>
                    </div>

                    <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-rose-600 transition-colors flex items-center gap-2"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Lien copié !' : 'Copier le lien'}
                    </Button>

                    <button
                        onClick={() => setIsInAppBrowser(false)}
                        className="text-xs text-gray-400 hover:text-gray-600 underline mt-4"
                    >
                        Continuer quand même dans l'app
                    </button>

                </div>
            </div>
        </div>
    );
};
