import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Celebrate design and add Minimal
old_celebrate = r'{/\* DESIGN 3: Celebrate.*?\)}\s*\)}\s*</div>\s*\)}\s*\)}'
new_celebrate_minimal = '''{/* DESIGN 3: Celebrate - Design moderne et epure */}
                  {prideJournalDesign === 'celebrate' && (
                    <div className="space-y-3">
                      {bonusProgress.smallWins.slice(0, 15).map((win, index) => {
                        const colors = ['from-pink-400 to-rose-400', 'from-purple-400 to-violet-400', 'from-orange-400 to-amber-400', 'from-emerald-400 to-teal-400', 'from-cyan-400 to-blue-400'];
                        const color = colors[index % colors.length];
                        
                        return (
                          <div key={win.id || index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm`}>
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">{win.text}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {new Date(win.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', {
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {bonusProgress.smallWins.length >= 15 && (
                        <button
                          onClick={() => router.push('/small-wins')}
                          className="w-full py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all"
                        >
                          {language === 'fr'
                            ? `Voir les ${bonusProgress.smallWins.length - 15} autres`
                            : language === 'en'
                              ? `See ${bonusProgress.smallWins.length - 15} more`
                              : `Ver ${bonusProgress.smallWins.length - 15} más`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* DESIGN 4: Minimal - Design epure et simple */}
                  {prideJournalDesign === 'minimal' && (
                    <div className="space-y-2">
                      {bonusProgress.smallWins.slice(0, 15).map((win, index) => (
                        <div key={win.id || index} className="border-b border-gray-100 last:border-0 py-3">
                          <p className="text-sm text-gray-800">{win.text}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(win.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'es-ES', {
                              day: 'numeric',
                              month: 'long'
                            })}
                          </p>
                        </div>
                      ))}
                      
                      {bonusProgress.smallWins.length >= 15 && (
                        <button
                          onClick={() => router.push('/small-wins')}
                          className="w-full py-3 text-gray-500 text-sm hover:text-gray-700 transition-colors border-t border-gray-100 mt-2"
                        >
                          {language === 'fr'
                            ? `+ ${bonusProgress.smallWins.length - 15} autres`
                            : language === 'en'
                              ? `+ ${bonusProgress.smallWins.length - 15} more`
                              : `+ ${bonusProgress.smallWins.length - 15} más`}
                        </button>
                      )}
                    </div>
                  )}'''

content = re.sub(old_celebrate, new_celebrate_minimal, content, flags=re.DOTALL)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Celebrate and Minimal designs updated!")
