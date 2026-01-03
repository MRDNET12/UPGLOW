import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Moon, Plus, History } from 'lucide-react';

export function EveningQuestion() {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const addEveningQuestion = useStore((state) => state.addEveningQuestion);
  const questionsThisMonth = useStore((state) => state.getEveningQuestionsThisMonth());
  const history = useStore((state) => state.getEveningQuestionsHistory());

  const handleAdd = () => {
    if (question.trim() && answer.trim()) {
      addEveningQuestion(question.trim(), answer.trim());
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
            <Moon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t.bonus.eveningQuestionTitle}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.bonus.eveningQuestionThisMonth}: {questionsThisMonth.length}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Input Form */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.bonus.questionPlaceholder}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t.bonus.answerPlaceholder}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
        />
        <button
          onClick={handleAdd}
          disabled={!question.trim() || !answer.trim()}
          className="w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          {t.bonus.addEveningQuestion}
        </button>
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

