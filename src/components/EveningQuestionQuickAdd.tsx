import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Moon, Plus } from 'lucide-react';

interface EveningQuestionQuickAddProps {
  theme?: 'light' | 'dark';
}

export function EveningQuestionQuickAdd({ theme = 'light' }: EveningQuestionQuickAddProps) {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

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

