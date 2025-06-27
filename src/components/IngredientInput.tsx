
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Mic, Type, X, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
}

const IngredientInput = ({ ingredients, setIngredients }: IngredientInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue('');
      toast({
        title: "Ingredient added!",
        description: `${trimmed} has been added to your list.`,
      });
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(item => item !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addIngredient(inputValue);
      }
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak your ingredients now!",
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const ingredientsList = transcript.split(/,|\sand\s/).map((item: string) => item.trim());
        
        ingredientsList.forEach((ingredient: string) => {
          if (ingredient) addIngredient(ingredient);
        });
      };

      recognition.onerror = () => {
        toast({
          title: "Voice input error",
          description: "Please try again or use text input.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice input not supported",
        description: "Please use text input instead.",
        variant: "destructive",
      });
    }
  };

  const handlePhotoUpload = () => {
    toast({
      title: "Photo upload coming soon!",
      description: "This feature will be available in the next update.",
    });
  };

  const clearIngredients = () => {
    setIngredients([]);
    toast({
      title: "Ingredients cleared",
      description: "Your ingredient list has been reset.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Plus className="w-5 h-5" />
            Add Your Ingredients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handlePhotoUpload}
              variant="outline"
              className="flex items-center gap-2 h-12 border-orange-200 hover:bg-orange-50"
            >
              <Camera className="w-4 h-4" />
              Upload Photo
            </Button>
            
            <Button
              onClick={startVoiceInput}
              variant="outline"
              className={`flex items-center gap-2 h-12 border-orange-200 hover:bg-orange-50 ${
                isListening ? 'bg-red-100 border-red-300' : ''
              }`}
              disabled={isListening}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'text-red-500' : ''}`} />
              {isListening ? 'Listening...' : 'Voice Input'}
            </Button>
            
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-600">or type below</span>
            </div>
          </div>

          {/* Text Input */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Type ingredients (press Enter or comma to add)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-orange-200 focus:border-orange-400"
            />
            <Button
              onClick={() => addIngredient(inputValue)}
              disabled={!inputValue.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients List */}
      {ingredients.length > 0 && (
        <Card className="shadow-lg border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-orange-800">
              Your Ingredients ({ingredients.length})
            </CardTitle>
            <Button
              onClick={clearIngredients}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 hover:bg-orange-200"
                >
                  {ingredient}
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IngredientInput;
