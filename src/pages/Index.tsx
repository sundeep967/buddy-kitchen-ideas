
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IngredientInput from '@/components/IngredientInput';
import RecipeFinder from '@/components/RecipeFinder';
import ToolsSection from '@/components/ToolsSection';
import { ChefHat, Utensils, Settings } from 'lucide-react';

const Index = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-full">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Kitchen Buddy</h1>
            <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full">MVP</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Your AI-Powered Kitchen Assistant
            </h2>
            <p className="text-lg text-gray-600">
              Turn your ingredients into delicious recipes with voice commands, smart suggestions, and helpful tools
            </p>
          </div>

          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-sm">
              <TabsTrigger value="ingredients" className="flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Add Ingredients
              </TabsTrigger>
              <TabsTrigger value="recipes" className="flex items-center gap-2">
                <ChefHat className="w-4 h-4" />
                Find Recipes
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="animate-fade-in">
              <IngredientInput 
                ingredients={ingredients} 
                setIngredients={setIngredients} 
              />
            </TabsContent>

            <TabsContent value="recipes" className="animate-fade-in">
              <RecipeFinder ingredients={ingredients} />
            </TabsContent>

            <TabsContent value="tools" className="animate-fade-in">
              <ToolsSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Kitchen Buddy - Making cooking accessible and fun for everyone</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
