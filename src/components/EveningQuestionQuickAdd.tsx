import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Moon, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface EveningQuestionQuickAddProps {
  theme?: 'light' | 'dark';
}

export function EveningQuestionQuickAdd({ theme = 'light' }: EveningQuestionQuickAddProps) {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showFaq, setShowFaq] = useState(false);

  const addEveningQuestion = useStore((state) => state.addEveningQuestion);
  const getEveningQuestionsThisMonth = useStore((state) => state.getEveningQuestionsThisMonth);

  const questionsThisMonth = getEveningQuestionsThisMonth();

  const handleAdd = () => {
    if (question.trim() && answer.trim()) {
      addEveningQuestion(question.trim(), answer.trim());
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <div className={`rounded-2xl p-4 shadow-sm w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {t.bonus.eveningQuestionTitle}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {questionsThisMonth.length} ce mois
          </p>
        </div>
      </div>

      {/* FAQ Pourquoi ? */}
      <div className="mb-3">
        <button
          onClick={() => setShowFaq(!showFaq)}
          className="w-full flex items-center justify-between p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
        >
          <span className="font-semibold text-gray-900 dark:text-white text-xs">
            Pourquoi ?
          </span>
          {showFaq ? (
            <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          )}
        </button>

        {showFaq && (
          <div className="mt-2 p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl space-y-2 text-xs">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                Le soir avant de dormir, pose toi cette question :
              </p>
              <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-2 italic">
                « Si mon cœur savait déjà, quelle serait sa réponse ? »
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Rituel (30 secondes) :</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Pense à ton blocage.</li>
                <li>Pose la question.</li>
                <li>Note le premier mot qui vient.</li>
              </ol>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Exemples</p>
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
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

            <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Résultat</p>
              <p className="text-gray-700 dark:text-gray-300">
                Au réveil, on est plus claire, le cœur sait déjà.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="space-y-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.bonus.questionPlaceholder}
          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t.bonus.answerPlaceholder}
          rows={2}
          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
        />
        <button
          onClick={handleAdd}
          disabled={!question.trim() || !answer.trim()}
          className="w-full px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          {t.bonus.addEveningQuestion}
        </button>
      </div>
    </div>
  );
}

