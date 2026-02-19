import re

# Read the file
with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Change type to include 'minimal'
content = content.replace(
    "type PrideJournalDesign = 'gallery' | 'timeline' | 'celebrate';",
    "type PrideJournalDesign = 'gallery' | 'timeline' | 'celebrate' | 'minimal';"
)

# 2. Change px-4 to px-5 for the section
content = content.replace(
    '{/* Section Carnet de fierté */}\n            <div className="px-4">',
    '{/* Section Carnet de fierté */}\n            <div className="px-5">'
)

# 3. Remove header from Gallery design (from "{/* Header avec statistiques */}" to "{/* Grille masonry 2 colonnes */}")
pattern1 = r'{/\* DESIGN 1: Gallery.*?{/\* Grille masonry 2 colonnes \*/}'
replacement1 = '{/* DESIGN 1: Gallery - Grille masonry élaborée */}\n                  {prideJournalDesign === \'gallery\' && (\n                    <div className="space-y-4">\n                      {/* Grille masonry 2 colonnes */}'
content = re.sub(pattern1, replacement1, content, flags=re.DOTALL)

# Write back
with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Changes applied successfully!")
