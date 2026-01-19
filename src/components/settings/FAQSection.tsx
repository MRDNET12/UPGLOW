'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sparkles, Download, Bell, Check, Zap } from 'lucide-react';

interface FAQSectionProps {
  theme: 'light' | 'dark';
}

export function FAQSection({ theme }: FAQSectionProps) {
  return (
    <Card className={`border-none shadow-lg ${theme === 'dark' ? 'bg-stone-900' : 'bg-white'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          FAQ
        </CardTitle>
        <CardDescription>Questions fréquentes</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem 
            value="install-pwa"
            className={`border rounded-xl px-4 ${theme === 'dark' ? 'border-purple-800/30 bg-purple-900/10' : 'border-purple-200 bg-purple-50/50'}`}
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                  <Download className="w-5 h-5 text-purple-500" />
                </div>
                <span className="font-semibold text-left">Comment installer l'application (PWA)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-5 pt-4 pb-2">
                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-stone-800/50' : 'bg-white'}`}>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    L'application fonctionne comme une application classique, mais elle s'installe directement depuis votre navigateur (sans App Store ni Play Store).
                  </p>
                </div>

                {/* iOS */}
                <div className={`p-5 rounded-xl border-2 ${theme === 'dark' ? 'border-blue-800/30 bg-blue-900/10' : 'border-blue-200 bg-blue-50'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                      <span className="text-lg">🍎</span>
                    </div>
                    <p className="font-bold text-blue-600 dark:text-blue-400">Sur iPhone (iOS – Safari uniquement)</p>
                  </div>
                  <ol className="space-y-2.5 text-sm text-stone-700 dark:text-stone-300">
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-500 shrink-0">1.</span>
                      <span>Ouvrez le lien de l'application dans <strong>Safari</strong></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-500 shrink-0">2.</span>
                      <span>Appuyez sur l'icône <strong>Partager</strong> (le carré avec une flèche vers le haut)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-500 shrink-0">3.</span>
                      <span>Défiler vers le bas</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-500 shrink-0">4.</span>
                      <span>Sélectionnez <strong>« Ajouter à l'écran d'accueil »</strong></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-500 shrink-0">5.</span>
                      <span>Confirmez</span>
                    </li>
                  </ol>
                  <div className={`mt-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100/50'}`}>
                    <p className="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>L'application apparaîtra ensuite sur votre écran d'accueil comme une app normale.</span>
                    </p>
                  </div>
                </div>

                {/* Android */}
                <div className={`p-5 rounded-xl border-2 ${theme === 'dark' ? 'border-green-800/30 bg-green-900/10' : 'border-green-200 bg-green-50'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
                      <span className="text-lg">🤖</span>
                    </div>
                    <p className="font-bold text-green-600 dark:text-green-400">Sur Android (Chrome recommandé)</p>
                  </div>
                  <ol className="space-y-2.5 text-sm text-stone-700 dark:text-stone-300">
                    <li className="flex gap-3">
                      <span className="font-bold text-green-500 shrink-0">1.</span>
                      <span>Ouvrez le lien de l'application dans <strong>Chrome</strong></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-green-500 shrink-0">2.</span>
                      <div className="flex-1">
                        <span>Un message s'affichera : <strong>« Installer l'application »</strong></span>
                        <div className={`mt-2 ml-4 p-2 rounded-lg text-xs ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100/50'}`}>
                          <span className="text-green-600 dark:text-green-400">→ Sinon, appuyez sur les <strong>3 points</strong> en haut à droite</span>
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-green-500 shrink-0">3.</span>
                      <span>Choisissez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-green-500 shrink-0">4.</span>
                      <span>Confirmez</span>
                    </li>
                  </ol>
                  <div className={`mt-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100/50'}`}>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-start gap-2">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>L'application sera installée et accessible comme une application classique.</span>
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem 
            value="notifications"
            className={`border rounded-xl px-4 ${theme === 'dark' ? 'border-amber-800/30 bg-amber-900/10' : 'border-amber-200 bg-amber-50/50'}`}
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
                  <Bell className="w-5 h-5 text-amber-500" />
                </div>
                <span className="font-semibold text-left">Notifications</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 pb-2">
                <div className={`p-5 rounded-xl border-2 ${theme === 'dark' ? 'border-amber-800/30 bg-amber-900/10' : 'border-amber-200 bg-amber-50'}`}>
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Fonctionnalité à venir</p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        Les notifications push arriveront bientôt pour vous rappeler vos objectifs quotidiens et vous motiver ! 🚀
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

