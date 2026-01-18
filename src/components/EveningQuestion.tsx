import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Moon, History, ChevronDown, ChevronUp } from 'lucide-react';

export function EveningQuestion() {
  const { t } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  const getEveningQuestionsThisMonth = useStore((state) => state.getEveningQuestionsThisMonth);
  const getEveningQuestionsHistory = useStore((state) => state.getEveningQuestionsHistory);

  const questionsThisMonth = getEveningQuestionsThisMonth();
  const history = getEveningQuestionsHistory();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {t.bonus.eveningQuestionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {t.bonus.eveningQuestionThisMonth}: {questionsThisMonth.length}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
        >
          <History className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* FAQ Pourquoi ? */}
      <div className="mb-4">
        <button
          onClick={() => setShowFaq(!showFaq)}
          className="w-full flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
        >
          <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
            Pourquoi ?
          </span>
          {showFaq ? (
            <ChevronUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          )}
        </button>

        {showFaq && (
          <div className="mt-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl space-y-3 text-sm">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                Le soir avant de dormir, pose toi cette question :
              </p>
              <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-3 italic">
                « Si mon cœur savait déjà, quelle serait sa réponse ? »
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Rituel (30 secondes) :</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Pense à ton blocage.</li>
                <li>Pose la question.</li>
                <li>Note le premier mot qui vient.</li>
              </ol>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Exemples</p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <div>
                  <p className="font-medium">« Dois-je quitter ce travail ? »</p>
                  <p className="text-indigo-600 dark:text-indigo-400">→ Liberté</p>
                </div>
                <div>
                  <p className="font-medium">« Est-ce que cette amitié me convient ? »</p>
                  <p className="text-indigo-600 dark:text-indigo-400">→ Épuisée</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-indigo-200 dark:border-indigo-800">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Résultat</p>
              <p className="text-gray-700 dark:text-gray-300">
                Au réveil, on est plus claire, le cœur sait déjà.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* This Month's Questions */}
      {questionsThisMonth.length > 0 && (
        <div className="space-y-3 mb-4">
          {questionsThisMonth.slice(0, 3).map((q) => (
            <div
              key={q.id}
              className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg"
            >
              <div className="flex items-start gap-2 mb-2">
                <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {q.question}
                </p>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 ml-6 mb-2">
                {q.answer}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                {new Date(q.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {showHistory && history.length > 3 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t.bonus.history}
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.slice(3).map((q) => (
              <div
                key={q.id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {q.question}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {q.answer}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(q.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

