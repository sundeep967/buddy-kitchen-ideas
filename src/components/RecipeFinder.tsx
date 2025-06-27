
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Users, Volume2, Search, Filter } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Recipe {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  image: string;
  dishTypes: string[];
}

interface RecipeFinderProps {
  ingredients: string[];
}

const RecipeFinder = ({ ingredients }: RecipeFinderProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [fontSize, setFontSize] = useState([16]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
  });
  const { toast } = useToast();

  // Mock recipe data for MVP
  const mockRecipes: Recipe[] = [
    {
      id: 1,
      title: "Classic Vegetable Stir Fry",
      readyInMinutes: 20,
      servings: 4,
      summary: "A quick and healthy vegetable stir fry perfect for any day of the week.",
      instructions: "1. Heat oil in a large pan or wok over high heat. 2. Add vegetables and stir-fry for 3-4 minutes. 3. Add sauce and cook for another 2 minutes. 4. Serve immediately over rice.",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400",
      dishTypes: ["dinner", "lunch"]
    },
    {
      id: 2,
      title: "Hearty Chicken Soup",
      readyInMinutes: 45,
      servings: 6,
      summary: "Comforting chicken soup with vegetables and herbs.",
      instructions: "1. In a large pot, heat oil and sauté onions until soft. 2. Add chicken and cook until browned. 3. Add vegetables and broth. 4. Simmer for 30 minutes until chicken is tender. 5. Season with salt and pepper to taste.",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
      dishTypes: ["soup", "dinner"]
    },
    {
      id: 3,
      title: "Fresh Garden Salad",
      readyInMinutes: 10,
      servings: 2,
      summary: "Light and refreshing salad with mixed greens and vegetables.",
      instructions: "1. Wash and dry all vegetables. 2. Chop vegetables into bite-sized pieces. 3. Mix all ingredients in a large bowl. 4. Dress with olive oil and vinegar. 5. Toss and serve immediately.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400",
      dishTypes: ["salad", "lunch"]
    }
  ];

  const searchRecipes = () => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients added",
        description: "Please add some ingredients first!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredRecipes = mockRecipes;
      
      // Apply dietary filters
      if (filters.vegetarian || filters.vegan) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.title.toLowerCase().includes('vegetable') || 
          recipe.title.toLowerCase().includes('salad')
        );
      }
      
      setRecipes(filteredRecipes);
      setIsLoading(false);
      
      toast({
        title: "Recipes found!",
        description: `Found ${filteredRecipes.length} recipes matching your ingredients.`,
      });
    }, 1000);
  };

  const speakInstructions = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      speechSynthesis.speak(utterance);
      
      toast({
        title: "Reading instructions",
        description: "Listen to your recipe instructions!",
      });
    } else {
      toast({
        title: "Text-to-speech not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
    }
  };

  const updateFilter = (filterName: keyof typeof filters, checked: boolean) => {
    setFilters(prev => ({ ...prev, [filterName]: checked }));
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card className="shadow-lg border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Search className="w-5 h-5" />
            Find Recipes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4" />
              Dietary Preferences
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(filters).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => updateFilter(key as keyof typeof filters, !!checked)}
                  />
                  <label htmlFor={key} className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={searchRecipes}
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search Recipes'}
          </Button>

          {ingredients.length > 0 && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Using ingredients:</span> {ingredients.join(', ')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recipes List */}
      {recipes.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="shadow-lg border-orange-200 hover:shadow-xl transition-shadow cursor-pointer">
              <div onClick={() => setSelectedRecipe(recipe)}>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800">{recipe.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {recipe.readyInMinutes} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {recipe.servings} servings
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">{recipe.summary}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {recipe.dishTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <Card className="shadow-2xl border-orange-200 fixed inset-4 z-50 overflow-auto bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-orange-800">{selectedRecipe.title}</CardTitle>
            <Button
              onClick={() => setSelectedRecipe(null)}
              variant="outline"
              size="sm"
            >
              Close
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedRecipe.readyInMinutes} minutes
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedRecipe.servings} servings
                </div>
              </div>
              
              <Button
                onClick={() => speakInstructions(selectedRecipe.instructions)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Read Aloud
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Font Size</label>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={24}
                min={12}
                step={1}
                className="w-full"
              />
            </div>

            <div style={{ fontSize: `${fontSize[0]}px` }} className="space-y-4">
              <div>
                <h3 className="font-bold text-orange-800 mb-2">Summary</h3>
                <p className="text-gray-700">{selectedRecipe.summary}</p>
              </div>
              
              <div>
                <h3 className="font-bold text-orange-800 mb-2">Instructions</h3>
                <p className="text-gray-700 leading-relaxed">{selectedRecipe.instructions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecipeFinder;
