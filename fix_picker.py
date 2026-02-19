import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the picker drawer
old_picker_start = '{/* Drawer de selection du design pour le carnet de fierte */}'
old_picker_end = '</Drawer>'

# Find the section between these markers
start_idx = content.find(old_picker_start)
if start_idx != -1:
    # Find the end of the Drawer component
    drawer_start = content.find('<Drawer open={showPrideDesignPicker}', start_idx)
    drawer_end = content.find('</Drawer>', drawer_start) + len('</Drawer>')
    
    new_picker = '''{/* Drawer de selection du design pour le carnet de fierte */}
            <Drawer open={showPrideDesignPicker} onOpenChange={setShowPrideDesignPicker}>
              <DrawerContent className="bg-white">
                <DrawerHeader className="text-left">
                  <DrawerTitle className="text-lg font-bold text-gray-900">
                    {language === 'fr' ? 'Choisir un design' : language === 'en' ? 'Choose a design' : 'Elegir un diseño'}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-5 pb-6">
                  <div className="grid grid-cols-4 gap-3">
                    {/* Design Gallery */}
                    <button
                      onClick={() => {
                        setPrideJournalDesign('gallery');
                        setShowPrideDesignPicker(false);
                      }}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all ${prideJournalDesign === 'gallery'
                          ? 'bg-pink-100 border-2 border-pink-500 shadow-md'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-pink-300'
                        }`}
                    >
                      🖼️
                    </button>

                    {/* Design Timeline */}
                    <button
                      onClick={() => {
                        setPrideJournalDesign('timeline');
                        setShowPrideDesignPicker(false);
                      }}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all ${prideJournalDesign === 'timeline'
                          ? 'bg-pink-100 border-2 border-pink-500 shadow-md'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-pink-300'
                        }`}
                    >
                      ⏱️
                    </button>

                    {/* Design Celebrate */}
                    <button
                      onClick={() => {
                        setPrideJournalDesign('celebrate');
                        setShowPrideDesignPicker(false);
                      }}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all ${prideJournalDesign === 'celebrate'
                          ? 'bg-pink-100 border-2 border-pink-500 shadow-md'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-pink-300'
                        }`}
                    >
                      🎉
                    </button>

                    {/* Design Minimal */}
                    <button
                      onClick={() => {
                        setPrideJournalDesign('minimal');
                        setShowPrideDesignPicker(false);
                      }}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all ${prideJournalDesign === 'minimal'
                          ? 'bg-pink-100 border-2 border-pink-500 shadow-md'
                          : 'bg-gray-50 border-2 border-gray-200 hover:border-pink-300'
                        }`}
                    >
                      ⚪
                    </button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>'''
    
    content = content[:drawer_start] + new_picker + content[drawer_end:]
    
    with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Picker drawer updated with icons only!")
else:
    print("Could not find picker drawer")
