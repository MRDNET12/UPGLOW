import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Timeline design
old_timeline = r'{/\* DESIGN 2: Timeline.*?{/\* DESIGN 3: Celebrate'
new_timeline = '''{/* DESIGN 2: Timeline - Chronologie moderne et épurée */}
                  {prideJournalDesign === 'timeline' && (
                    <div className="space-y-4">
                      {bonusProgress.smallWins.slice(0, 15).map((win, index) => (
                        <div key={win.id || index} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {index + 1}
                            </div>
                            {index < bonusProgress.smallWins.slice(0, 15).length - 1 && (
                              <div className="w-0.5 h-full bg-gradient-to-b from-pink-300 to-transparent mt-2" />
                            )}
                          </div>
                          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <p className="text-sm font-semibold text-gray-800">{win.text}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(win.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {bonusProgress.smallWins.length >= 15 && (
                        <button
                          onClick={() => router.push('/small-wins')}
                          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          {language === 'fr'
                            ? `+ ${bonusProgress.smallWins.length - 15} autres`
                            : language === 'en'
                              ? `+ ${bonusProgress.smallWins.length - 15} more`
                              : `+ ${bonusProgress.smallWins.length - 15} más`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* DESIGN 3: Celebrate'''

content = re.sub(old_timeline, new_timeline, content, flags=re.DOTALL)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Timeline design updated!")
