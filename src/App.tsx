import { useState } from 'react';
import CocktailMenu from './components/CocktailMenu';
import CocktailBuilder from './components/CocktailBuilder';
import rawCocktailData from './cocktailData.json';
import { resolveReferences } from './resolveReferences';
import { CocktailData, MenuItem } from './types';

type View = 'menu' | 'builder';

function App() {
  const [currentView, setCurrentView] = useState<View>('menu');
  const [selectedPath, setSelectedPath] = useState<string[] | undefined>(undefined);

  // Resolve references in cocktail data
  const cocktailData = resolveReferences(rawCocktailData as any);
  const data = cocktailData as unknown as CocktailData;

  function handleSelectDrink(item: MenuItem) {
    if (item.path) {
      setSelectedPath(item.path);
      setCurrentView('builder');
    }
  }

  function handleBackToMenu() {
    setCurrentView('menu');
    setSelectedPath(undefined);
  }

  function handleStartBuilder() {
    setSelectedPath(undefined);
    setCurrentView('builder');
  }

  return (
    <>
      {currentView === 'menu' ? (
        <CocktailMenu
          menuItems={data.menuItems}
          onSelectDrink={handleSelectDrink}
          onStartBuilder={handleStartBuilder}
        />
      ) : (
        <CocktailBuilder
          cocktailData={data}
          onBack={handleBackToMenu}
          initialPath={selectedPath}
        />
      )}
    </>
  );
}

export default App;
