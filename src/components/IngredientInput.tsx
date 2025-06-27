
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Mic, Type, X, Plus, Upload, Image, Video } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
}

const IngredientInput = ({ ingredients, setIngredients }: IngredientInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedImage(result);
          
          // For MVP, we'll add some sample ingredients when photo is uploaded
          const sampleIngredients = ['tomato', 'onion', 'garlic'];
          sampleIngredients.forEach(ingredient => addIngredient(ingredient));
          
          toast({
            title: "Photo uploaded successfully!",
            description: "We've detected some common ingredients. You can add more manually.",
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Try to use back camera on mobile
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      toast({
        title: "Camera started",
        description: "Position your ingredients in view and click capture.",
      });
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access or use photo upload instead.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      context?.drawImage(video, 0, 0);
      
      // Convert canvas to data URL
      const dataURL = canvas.toDataURL('image/jpeg');
      setUploadedImage(dataURL);
      
      // Stop camera and hide camera view
      stopCamera();
      
      // Add sample ingredients
      const sampleIngredients = ['tomato', 'onion', 'garlic'];
      sampleIngredients.forEach(ingredient => addIngredient(ingredient));
      
      toast({
        title: "Photo captured successfully!",
        description: "We've detected some common ingredients. You can add more manually.",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const clearPhoto = () => {
    setUploadedImage(null);
    toast({
      title: "Photo removed",
      description: "Your uploaded photo has been cleared.",
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 h-12 border-orange-200 hover:bg-orange-50 w-full cursor-pointer"
                  asChild
                >
                  <div>
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </div>
                </Button>
              </label>
            </div>

            <Button
              onClick={startCamera}
              variant="outline"
              className="flex items-center gap-2 h-12 border-orange-200 hover:bg-orange-50"
              disabled={showCamera}
            >
              <Camera className="w-4 h-4" />
              Take Photo
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

          {/* Camera View */}
          {showCamera && (
            <Card className="border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-orange-800 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Camera View
                  </h4>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative flex flex-col items-center space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="max-w-full max-h-64 rounded-lg border border-orange-200"
                  />
                  <Button
                    onClick={capturePhoto}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Photo
                  </Button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>
          )}

          {/* Uploaded Image Display */}
          {uploadedImage && (
            <Card className="border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-orange-800 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Captured/Uploaded Photo
                  </h4>
                  <Button
                    onClick={clearPhoto}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <img
                    src={uploadedImage}
                    alt="Captured or uploaded ingredients"
                    className="max-h-48 max-w-full object-contain rounded-lg border border-orange-200"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Image analysis feature coming soon! For now, we've added some sample ingredients.
                </p>
              </CardContent>
            </Card>
          )}

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
