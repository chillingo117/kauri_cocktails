import { MenuItem } from '../types';
import { Wine } from 'lucide-react';

interface CocktailMenuProps {
  menuItems: MenuItem[];
  onSelectDrink: (item: MenuItem) => void;
  onStartBuilder: () => void;
}

export default function CocktailMenu({ menuItems, onSelectDrink, onStartBuilder }: CocktailMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Wine className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">Kauri Bar</h1>
        </div>

        <div className="grid gap-6 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => onSelectDrink(item)}
              className="bg-slate-800 hover:bg-slate-700 transition-all duration-300 rounded-lg p-4 text-left border border-slate-700 hover:border-amber-500 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-2xl font-semibold text-white group-hover:text-amber-500 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-slate-400 text-sm italic">{item.flavorText}</p>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="text-sm px-3 py-1 bg-slate-700 text-slate-300 rounded-full border border-slate-600"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center pt-8 border-t border-slate-700">
          <button
            onClick={onStartBuilder}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8 py-4 rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-amber-500/50"
          >
            Build Your Own Cocktail
          </button>
        </div>
      </div>
    </div>
  );
}
