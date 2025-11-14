import { useState, useEffect } from 'react';
import { CocktailData, BuilderState, CocktailOption, BaseSpirit } from '../types';
import { ArrowLeft, CheckCircle, Star, Sparkles } from 'lucide-react';

interface CocktailBuilderProps {
  cocktailData: CocktailData;
  onBack: () => void;
  initialPath?: string[];
}

export default function CocktailBuilder({ cocktailData, onBack, initialPath }: CocktailBuilderProps) {
  const [state, setState] = useState<BuilderState | null>(() => {
    if (initialPath && initialPath.length > 0) {
      return navigateToPath(initialPath);
    }
    return null;
  });

  const [history, setHistory] = useState<BuilderState[]>([]);
  const [showFinal, setShowFinal] = useState(false);
  const [isNamedDrink, setIsNamedDrink] = useState(false);
  const [isMenuSpecial, setIsMenuSpecial] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);

  // Check if current path matches a named drink
  function checkNamedDrink(path: string[]): boolean {
    return cocktailData.namedDrinks.some(drink =>
      drink.path.length === path.length &&
      drink.path.every((step, index) => step === path[index])
    );
  }

  // Check if current path matches a menu special item
  function checkMenuSpecial(path: string[]): boolean {
    return cocktailData.menuItems.some(item =>
      item.path &&
      item.path.length === path.length &&
      item.path.every((step, index) => step === path[index])
    );
  }

  // Update named drink and menu special status when state changes
  useEffect(() => {
    if (state) {
      const isNamed = checkNamedDrink(state.path);
      const isSpecial = checkMenuSpecial(state.path);
      setIsNamedDrink(isNamed);
      setIsMenuSpecial(isSpecial);
      if (isNamed || isSpecial) {
        setShowSparkle(true);
        const timer = setTimeout(() => setShowSparkle(false), isSpecial ? 3000 : 2000);
        return () => clearTimeout(timer);
      }
    } else {
      setIsNamedDrink(false);
      setIsMenuSpecial(false);
      setShowSparkle(false);
    }
  }, [state, cocktailData.namedDrinks, cocktailData.menuItems]);

  function navigateToPath(path: string[]): BuilderState | null {
    const spiritKey = path[0];
    const spirit = cocktailData.baseSpirits[spiritKey];

    if (!spirit) return null;

    let currentName = spirit.name;
    let ingredients = [...spirit.ingredients];
    let totalPrice = spirit.price;

    let currentOptions = spirit.options;

    for (let i = 1; i < path.length; i++) {
      const optionKey = path[i];
      const option = currentOptions[optionKey];

      if (!option) return null;

      if (option.drinkName) {
        currentName = option.drinkName;
      } else if (option.finalDrink) {
        currentName = option.finalDrink;
      }

      ingredients = [...ingredients, ...option.ingredients];
      totalPrice += option.price;

      if (option.options) {
        currentOptions = option.options;
      }
    }

    return {
      spirit: spiritKey,
      path: [...path],
      currentName,
      ingredients,
      totalPrice
    };
  }

  function selectSpirit(spiritKey: string) {
    const spirit = cocktailData.baseSpirits[spiritKey];
    const newState: BuilderState = {
      spirit: spiritKey,
      path: [spiritKey],
      currentName: spirit.name,
      ingredients: [...spirit.ingredients],
      totalPrice: spirit.price
    };
    setState(newState);
    setHistory([]);
  }

  function getCurrentOptions(): Record<string, CocktailOption> | null {
    if (!state) return null;

    const spirit = cocktailData.baseSpirits[state.spirit];
    let currentOptions = spirit.options;

    for (let i = 1; i < state.path.length; i++) {
      const option = currentOptions[state.path[i]];
      if (option && option.options) {
        currentOptions = option.options;
      } else {
        return null;
      }
    }

    return currentOptions;
  }

  function selectOption(optionKey: string) {
    if (!state) return;

    const currentOptions = getCurrentOptions();
    if (!currentOptions) return;

    const option = currentOptions[optionKey];

    const newState: BuilderState = {
      ...state,
      path: [...state.path, optionKey],
      currentName: option.drinkName || option.finalDrink || state.currentName,
      ingredients: [...state.ingredients, ...option.ingredients],
      totalPrice: state.totalPrice + option.price
    };

    setHistory([...history, state]);
    setState(newState);
  }

  function goBack() {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setState(previousState);
      setHistory(history.slice(0, -1));
      setShowFinal(false);
    } else {
      setState(null);
      setHistory([]);
      setShowFinal(false);
    }
  }

  function resetBuilder() {
    setState(null);
    setHistory([]);
    setShowFinal(false);
  }

  if (showFinal && state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          <div className="bg-slate-800 rounded-lg p-8 border border-amber-500 shadow-2xl">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-2">Order Complete!</h2>
              <p className="text-slate-400">Show this screen to the bartender</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <h3 className={`text-3xl font-bold text-center ${
                  isMenuSpecial ? 'text-purple-400' : 'text-amber-500'
                }`}>
                  {state.currentName}
                </h3>
                {(isNamedDrink || isMenuSpecial) && (
                  <div className="relative">
                    <Sparkles className={`w-6 h-6 animate-pulse ${
                      isMenuSpecial ? 'text-purple-400 fill-purple-400' : 'text-amber-500 fill-amber-500'
                    }`} />
                    {isMenuSpecial && (
                      <Star className="w-3 h-3 text-purple-300 fill-purple-300 absolute -top-1 -right-1 animate-ping" />
                    )}
                  </div>
                )}
              </div>
              {isMenuSpecial ? (
                <p className="text-purple-400 text-sm text-center mb-4 italic font-semibold">
                  ⭐ House Special Cocktail ⭐
                </p>
              ) : isNamedDrink ? (
                <p className="text-amber-400 text-sm text-center mb-4 italic">
                  ✨ Classic Cocktail
                </p>
              ) : null}

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Ingredients
                </h4>
                <div className="flex flex-wrap gap-2">
                  {state.ingredients.map((ingredient, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4 border-t border-slate-700">
                <span className="text-5xl font-bold text-amber-500">
                  ${state.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetBuilder}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Build Another
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentOptions = getCurrentOptions();
  const isTerminal = currentOptions === null || Object.keys(currentOptions).length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={state ? goBack : onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{state ? 'Previous Step' : 'Back to Menu'}</span>
          </button>
          {state && (
            <button
              onClick={resetBuilder}
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Start Over
            </button>
          )}
        </div>

        {state && (
          <div className={`bg-slate-800 rounded-lg p-6 mb-8 border transition-all duration-500 ${
            isMenuSpecial
              ? 'border-purple-500 shadow-2xl shadow-purple-500/60 ring-2 ring-purple-400/30'
              : isNamedDrink
                ? 'border-amber-500 shadow-lg shadow-amber-500/50'
                : 'border-slate-700'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-3xl font-bold transition-all duration-500 ${
                isMenuSpecial ? 'text-purple-400' : 'text-amber-500'
              } ${showSparkle ? 'animate-pulse' : ''}`}>
                {state.currentName}
              </h2>
              {(isNamedDrink || isMenuSpecial) && (
                <div className={`relative transition-all duration-500 ${
                  showSparkle ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
                }`}>
                  <Sparkles className={`w-6 h-6 ${
                    isMenuSpecial ? 'text-purple-400 fill-purple-400' : 'text-amber-500 fill-amber-500'
                  }`} />
                  {isMenuSpecial && showSparkle && (
                    <>
                      <Star className="w-4 h-4 text-purple-300 fill-purple-300 absolute -top-1 -right-1 animate-ping" />
                      <Star className="w-3 h-3 text-purple-200 fill-purple-200 absolute -bottom-1 -left-1 animate-bounce" />
                    </>
                  )}
                </div>
              )}
            </div>
            {isMenuSpecial ? (
              <div className={`mb-4 transition-all duration-500 ${
                showSparkle ? 'animate-bounce' : ''
              }`}>
                <p className="text-purple-400 text-sm italic font-semibold">
                  ⭐ You've created a House Special! ⭐
                </p>
                <p className="text-purple-300 text-xs mt-1">
                  This signature cocktail is featured on our menu
                </p>
              </div>
            ) : isNamedDrink ? (
              <p className="text-amber-400 text-sm mb-4 italic">
                ✨ You've created a named cocktail!
              </p>
            ) : null}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {state.ingredients.map((ingredient, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Current Price
                </h3>
                <span className="text-3xl font-bold text-amber-500">
                  ${state.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-6">
            {!state ? 'Choose Your Spirit' : 'Next Step'}
          </h3>

          {!state ? (
            <div className="grid gap-4">
              {Object.entries(cocktailData.baseSpirits).map(([key, spirit]) => (
                <button
                  key={key}
                  onClick={() => selectSpirit(key)}
                  className="bg-slate-700 hover:bg-slate-600 transition-all duration-300 rounded-lg p-6 text-left border border-slate-600 hover:border-amber-500 group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-white group-hover:text-amber-500 transition-colors">
                      {spirit.name}
                    </span>
                    <span className="text-xl font-bold text-amber-500">
                      ${spirit.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {currentOptions && Object.entries(currentOptions).map(([key, option]) => (
                <div key={key}>
                  <button
                    onClick={() => selectOption(key)}
                    className="w-full bg-slate-700 hover:bg-slate-600 transition-all duration-300 rounded-lg p-6 text-left border border-slate-600 hover:border-amber-500 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-xl font-semibold text-white group-hover:text-amber-500 transition-colors">
                            {option.name}
                          </h4>
                          {option.isSpecial && (
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                        {option.description && (
                          <p className="text-slate-400 text-sm">
                            {option.description}
                            {option.drinkName && ` → ${option.drinkName}`}
                            {option.isSpecial && ' ★'}
                          </p>
                        )}
                      </div>
                      {option.price > 0 && (
                        <span className="text-xl font-bold text-amber-500 ml-4">
                          +${option.price}
                        </span>
                      )}
                    </div>
                  </button>
                  {isTerminal && (
                    <button
                      onClick={() => setShowFinal(true)}
                      className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/50"
                    >
                      Complete Order
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
