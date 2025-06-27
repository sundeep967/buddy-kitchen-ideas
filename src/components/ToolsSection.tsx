
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Calculator, Phone, Thermometer } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import EmergencyModal from '@/components/EmergencyModal';

const ToolsSection = () => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [conversionFrom, setConversionFrom] = useState('');
  const [conversionTo, setConversionTo] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const conversions: { [key: string]: { [key: string]: number } } = {
    // Weight conversions (to grams)
    grams: { grams: 1, ounces: 0.035274, pounds: 0.002205, kilograms: 0.001 },
    ounces: { grams: 28.3495, ounces: 1, pounds: 0.0625, kilograms: 0.0283495 },
    pounds: { grams: 453.592, ounces: 16, pounds: 1, kilograms: 0.453592 },
    kilograms: { grams: 1000, ounces: 35.274, pounds: 2.20462, kilograms: 1 },
    
    // Volume conversions (to milliliters)
    milliliters: { milliliters: 1, liters: 0.001, cups: 0.00422675, tablespoons: 0.067628, teaspoons: 0.202884 },
    liters: { milliliters: 1000, liters: 1, cups: 4.22675, tablespoons: 67.628, teaspoons: 202.884 },
    cups: { milliliters: 236.588, liters: 0.236588, cups: 1, tablespoons: 16, teaspoons: 48 },
    tablespoons: { milliliters: 14.7868, liters: 0.0147868, cups: 0.0625, tablespoons: 1, teaspoons: 3 },
    teaspoons: { milliliters: 4.92892, liters: 0.00492892, cups: 0.0208333, tablespoons: 0.333333, teaspoons: 1 },
  };

  const handleConversion = () => {
    if (!amount || !conversionFrom || !conversionTo) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for conversion.",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number.",
        variant: "destructive",
      });
      return;
    }

    if (conversions[conversionFrom] && conversions[conversionFrom][conversionTo]) {
      const convertedAmount = numAmount * conversions[conversionFrom][conversionTo];
      setResult(convertedAmount.toFixed(3));
      
      toast({
        title: "Conversion complete!",
        description: `${numAmount} ${conversionFrom} = ${convertedAmount.toFixed(3)} ${conversionTo}`,
      });
    } else {
      toast({
        title: "Conversion not supported",
        description: "This conversion combination is not available.",
        variant: "destructive",
      });
    }
  };

  const clearConversion = () => {
    setAmount('');
    setResult('');
    setConversionFrom('');
    setConversionTo('');
  };

  return (
    <div className="space-y-6">
      {/* Emergency Helper */}
      <Card className="shadow-lg border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            Emergency Helper
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 mb-4">
            Need immediate help while cooking? Click the button below for emergency guidance.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowEmergencyModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              🆘 Help!
            </Button>
            <Button
              onClick={() => console.log("Calling 911...")}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 911
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metric Converter */}
      <Card className="shadow-lg border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Calculator className="w-5 h-5" />
            Metric Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <Select value={conversionFrom} onValueChange={setConversionFrom}>
                <SelectTrigger className="border-orange-200">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grams">Grams</SelectItem>
                  <SelectItem value="ounces">Ounces</SelectItem>
                  <SelectItem value="pounds">Pounds</SelectItem>
                  <SelectItem value="kilograms">Kilograms</SelectItem>
                  <SelectItem value="milliliters">Milliliters</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="cups">Cups</SelectItem>
                  <SelectItem value="tablespoons">Tablespoons</SelectItem>
                  <SelectItem value="teaspoons">Teaspoons</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Select value={conversionTo} onValueChange={setConversionTo}>
                <SelectTrigger className="border-orange-200">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grams">Grams</SelectItem>
                  <SelectItem value="ounces">Ounces</SelectItem>
                  <SelectItem value="pounds">Pounds</SelectItem>
                  <SelectItem value="kilograms">Kilograms</SelectItem>
                  <SelectItem value="milliliters">Milliliters</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="cups">Cups</SelectItem>
                  <SelectItem value="tablespoons">Tablespoons</SelectItem>
                  <SelectItem value="teaspoons">Teaspoons</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Result</label>
              <Input
                type="text"
                value={result}
                readOnly
                placeholder="Result will appear here"
                className="border-orange-200 bg-orange-50"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleConversion}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Convert
            </Button>
            <Button
              onClick={clearConversion}
              variant="outline"
              className="border-orange-200 hover:bg-orange-50"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Temperature */}
      <Card className="shadow-lg border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Thermometer className="w-5 h-5" />
            Temperature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
  <div>
    <h2 className="text-lg font-semibold mb-4">Safe Internal Temperatures for Meats</h2>
    <table className="min-w-full bg-white border border-orange-200 rounded">
      <thead className="bg-orange-50">
        <tr>
          <th className="py-2 px-4 text-left font-medium border-b">Meat</th>
          <th className="py-2 px-4 text-left font-medium border-b">Fahrenheit (°F)</th>
          <th className="py-2 px-4 text-left font-medium border-b">Celsius (°C)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-2 px-4 border-b">Beef, veal & lamb (steaks, chops, roasts) - Medium Rare</td>
          <td className="py-2 px-4 border-b">145°F</td>
          <td className="py-2 px-4 border-b">63°C</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">Beef, veal & lamb (steaks, chops, roasts) - Medium</td>
          <td className="py-2 px-4 border-b">160°F</td>
          <td className="py-2 px-4 border-b">71°C</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">Ground beef, pork, veal & lamb</td>
          <td className="py-2 px-4 border-b">160°F</td>
          <td className="py-2 px-4 border-b">71°C</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">Pork (chops, roasts)</td>
          <td className="py-2 px-4 border-b">145°F</td>
          <td className="py-2 px-4 border-b">63°C</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">Chicken & Turkey (whole or parts)</td>
          <td className="py-2 px-4 border-b">165°F</td>
          <td className="py-2 px-4 border-b">74°C</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">Ground poultry</td>
          <td className="py-2 px-4 border-b">165°F</td>
          <td className="py-2 px-4 border-b">74°C</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">Fish & Shellfish</td>
          <td className="py-2 px-4 border-b">145°F</td>
          <td className="py-2 px-4 border-b">63°C</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">Ham, fresh or smoked</td>
          <td className="py-2 px-4 border-b">145°F</td>
          <td className="py-2 px-4 border-b">63°C</td>
        </tr>
        <tr>
          <td className="py-2 px-4 border-b">Ham, fully cooked (reheat)</td>
          <td className="py-2 px-4 border-b">140°F</td>
          <td className="py-2 px-4 border-b">60°C</td>
        </tr>
      </tbody>
    </table>
  </div>
</CardContent>
      </Card>

      <EmergencyModal 
        isOpen={showEmergencyModal} 
        onClose={() => setShowEmergencyModal(false)} 
      />
    </div>
  );
};

export default ToolsSection;
