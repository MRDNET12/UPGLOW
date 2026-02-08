
import os

path = r"c:\Users\mormo\Downloads\UPGLOW2\src\app\page.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

start_index = -1
for i, line in enumerate(lines):
    if "currentView === 'settings'" in line and "&& (" in line:
        start_index = i
        break

if start_index == -1:
    print("Start not found")
    exit(1)

end_index = -1
for i in range(start_index, len(lines)):
    if "</main>" in lines[i]:
        end_index = i
        break

if end_index == -1:
    print("End not found")
    exit(1)

# We want to keep </main> (at end_index)
# The block to replace ends at end_index - 1 (which is `        )}`)
# We will replace from start_index to end_index (exclusive) with our new block.

new_block = """        {currentView === 'settings' && (
          <ProfilePage 
            setShowAuthDialog={setShowAuthDialog} 
            setShowPlanSelection={setShowPlanSelection} 
          />
        )}
"""

lines[start_index:end_index] = [new_block]

with open(path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Successfully replaced content")
