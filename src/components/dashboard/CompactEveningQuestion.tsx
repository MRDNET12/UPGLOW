'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/useTranslation';
import { Moon, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CompactEveningQuestionProps {
  theme?: 'light' | 'dark';
}

export function CompactEveningQuestion({ theme = 'light' }: CompactEveningQuestionProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const addEveningQuestion = useStore((state) => state.addEveningQuestion);
  const getEveningQuestionsThisMonth = useStore((state) => state.getEveningQuestionsThisMonth);
  const removeEveningQuestion = useStore((state) => state.removeEveningQuestion);

  const questionsThisMonth = getEveningQuestionsThisMonth();
  const progress = Math.min((questionsThisMonth.length / 10) * 100, 100);

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      addEveningQuestion(newQuestion.trim(), newAnswer.trim());
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const latestQuestion = questionsThisMonth.length > 0 ? questionsThisMonth[questionsThisMonth.length - 1] : null;

  return (
    <div className={`rounded-2xl p-4 shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header - Always visible */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {t.bonus.eveningQuestionTitle}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t.bonus.eveningQuestionThisMonth}: {questionsThisMonth.length}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2 mb-3" />

      {/* Latest Question - Always visible */}
      {latestQuestion && !isExpanded && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
            {latestQuestion.question}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
            {latestQuestion.answer}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(latestQuestion.date).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 mt-3">
          {/* FAQ Info */}
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl text-sm">
            <p className="text-indigo-700 dark:text-indigo-300 font-medium italic mb-2">
              « Si mon cœur savait déjà, quelle serait sa réponse ? »
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Le soir avant de dormir, pose-toi cette question. Note le premier mot qui vient.
            </p>
          </div>

          {/* Add New Question */}
          <div className="space-y-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder={t.bonus.questionPlaceholder}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddQuestion();
                  }
                }}
                placeholder={t.bonus.answerPlaceholder}
                className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <button
                onClick={handleAddQuestion}
                disabled={!newQuestion.trim() || !newAnswer.trim()}
                className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* All Questions This Month */}
          {questionsThisMonth.length > 0 && (
            <div className="space-y-2">
              {questionsThisMonth.slice(0, 5).map((q) => (
                <div
                  key={q.id}
                  className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {q.question}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {q.answer}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(q.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeEveningQuestion(q.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 text-xs transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

