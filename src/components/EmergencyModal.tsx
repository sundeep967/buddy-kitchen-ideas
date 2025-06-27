
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Flame, Scissors, Thermometer, Phone } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyModal = ({ isOpen, onClose }: EmergencyModalProps) => {
  const emergencyInfo = [
    {
      icon: <Flame className="w-6 h-6 text-red-500" />,
      title: "Fire Emergency",
      instructions: [
        "Turn off heat source immediately",
        "Never use water on grease fires",
        "Use baking soda or fire extinguisher for small grease fires",
        "If fire is large, evacuate and call 911",
        "Cover small pan fires with a lid to smother flames"
      ]
    },
    {
      icon: <Scissors className="w-6 h-6 text-red-500" />,
      title: "Cuts & Wounds",
      instructions: [
        "Apply direct pressure with clean cloth",
        "Elevate the injured area above heart level",
        "Rinse minor cuts with clean water",
        "For deep cuts, seek medical attention immediately",
        "Don't remove objects embedded in wounds"
      ]
    },
    {
      icon: <Thermometer className="w-6 h-6 text-red-500" />,
      title: "Burns",
      instructions: [
        "Remove from heat source immediately",
        "Cool burn with cool (not ice cold) water for 10-20 minutes",
        "Don't use ice, butter, or oil on burns",
        "For severe burns, call 911 immediately",
        "Cover minor burns with clean, dry cloth"
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-800 text-xl">
            <AlertTriangle className="w-6 h-6" />
            Kitchen Emergency Guide
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-red-600" />
              <span className="font-bold text-red-800">For Life-Threatening Emergencies</span>
            </div>
            <p className="text-red-700">Call 911 immediately if someone is unconscious, severely injured, or in immediate danger.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            {emergencyInfo.map((emergency, index) => (
              <Card key={index} className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    {emergency.icon}
                    {emergency.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {emergency.instructions.map((instruction, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">General Kitchen Safety Tips</h3>
            <ul className="space-y-1 text-blue-700 text-sm">
              <li>• Keep a fire extinguisher in your kitchen</li>
              <li>• Always wash hands before and after handling food</li>
              <li>• Keep knives sharp - dull knives are more dangerous</li>
              <li>• Clean up spills immediately to prevent slipping</li>
              <li>• Never leave cooking food unattended</li>
            </ul>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={() => window.open('tel:911', '_self')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 911
            </Button>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyModal;
