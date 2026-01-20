import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Moon, Plus, ChevronDown, ChevronUp, History } from 'lucide-react';

interface EveningQuestionQuickAddProps {
  theme?: 'light' | 'dark';
}

export function EveningQuestionQuickAdd({ theme = 'light' }: EveningQuestionQuickAddProps) {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showFaq, setShowFaq] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const addEveningQuestion = useStore((state) => state.addEveningQuestion);
  const getEveningQuestionsThisMonth = useStore((state) => state.getEveningQuestionsThisMonth);
  const getEveningQuestionsHistory = useStore((state) => state.getEveningQuestionsHistory);

  const questionsThisMonth = getEveningQuestionsThisMonth();
  const history = getEveningQuestionsHistory();

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
            {t.bonus.why || 'Pourquoi ?'}
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
              <p className="font-semibold text-gray-900 dark:text-white mb-1">{t.bonus.eveningQuestionDescription || 'Réfléchis sur ta journée'}</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>{t.bonus.eveningQuestionStep1 || 'Pose-toi une question profonde chaque soir.'}</li>
                <li>{t.bonus.eveningQuestionStep2 || 'Réponds honnêtement, sans jugement.'}</li>
                <li>{t.bonus.eveningQuestionStep3 || 'Relis tes réponses pour voir ton évolution.'}</li>
              </ol>
            </div>
            <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">{t.bonus.whyItWorks || 'Pourquoi ça marche ?'}</p>
              <p className="text-gray-700 dark:text-gray-300">
                {t.bonus.eveningQuestionExplanation || "L'introspection quotidienne aide à mieux se connaître et à grandir."}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                {language === 'fr' ? 'Le soir avant de dormir, pose toi cette question :' : language === 'en' ? 'Before going to bed, ask yourself this question:' : 'Antes de dormir, hazte esta pregunta:'}
              </p>
              <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-2 italic">
                {language === 'fr' ? '« Si mon cœur savait déjà, quelle serait sa réponse ? »' : language === 'en' ? '"If my heart already knew, what would its answer be?"' : '"Si mi corazón ya lo supiera, ¿cuál sería su respuesta?"'}
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                {language === 'fr' ? 'Exemples' : language === 'en' ? 'Examples' : 'Ejemplos'}
              </p>
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                <div>
                  <p className="font-medium">
                    {language === 'fr' ? '« Dois-je quitter ce travail ? »' : language === 'en' ? '"Should I quit this job?"' : '"¿Debería dejar este trabajo?"'}
                  </p>
                  <p className="text-indigo-600 dark:text-indigo-400">
                    → {language === 'fr' ? 'Liberté' : language === 'en' ? 'Freedom' : 'Libertad'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">
                    {language === 'fr' ? '« Est-ce que cette amitié me convient ? »' : language === 'en' ? '"Is this friendship right for me?"' : '"¿Esta amistad me conviene?"'}
                  </p>
                  <p className="text-indigo-600 dark:text-indigo-400">
                    → {language === 'fr' ? 'Épuisée' : language === 'en' ? 'Exhausted' : 'Agotada'}
                  </p>
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
      <div className="space-y-2 mb-3">
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

      {/* Dernier ajouté */}
      {questionsThisMonth.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Dernier ajouté :</p>
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {questionsThisMonth[questionsThisMonth.length - 1].question}
            </p>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
              → {questionsThisMonth[questionsThisMonth.length - 1].answer}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(questionsThisMonth[questionsThisMonth.length - 1].date).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Historique */}
      {history.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-gray-900 dark:text-white text-xs">
                Historique ({history.length})
              </span>
            </div>
            {showHistory ? (
              <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            )}
          </button>

          {showHistory && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.question}</p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">→ {item.answer}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

