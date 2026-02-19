import os

file_path = r"c:\Users\mormo\Downloads\UPGLOW2\src\components\ProfilePage.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    line_num = i + 1
    
    # Focus Principal (189-210)
    if 189 <= line_num <= 210:
        continue 
        
    # Theme Selection (218-263)
    if 218 <= line_num <= 263:
        continue
        
    # Notifications (266-279)
    if 266 <= line_num <= 279:
        if line_num == 266:
            new_lines.append("""                    <div className="bg-white dark:bg-stone-800 rounded-[2rem] p-2 pr-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => alert(language === 'fr' ? "Il est préférable de télécharger l'application avant d'activer les notifications." : language === 'en' ? "It is preferable to download the application before enabling notifications." : "Es preferible descargar la aplicación antes de activar las notificaciones.")}>\n                        <div className="w-14 h-14 rounded-[1.5rem] bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center group-hover:scale-95 transition-transform">\n                             <Bell className="w-6 h-6 text-rose-500" />\n                        </div>\n                        <div className="flex flex-col">\n                            <span className="font-bold text-slate-700 dark:text-slate-200">Notifications</span>\n                             <span className="text-xs text-slate-400">\n                                {language === 'fr' ? 'Toucher pour activer' : 'Tap to enable'}\n                            </span>\n                        </div>\n                    </div>\n""")
        continue
        
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
