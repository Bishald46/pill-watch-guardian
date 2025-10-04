import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  name: string;
  time: string;
}

const MedicationSchedule = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedName, setNewMedName] = useState("");
  const [newMedTime, setNewMedTime] = useState("");
  const { toast } = useToast();

  const addMedication = () => {
    if (!newMedName || !newMedTime) {
      toast({
        title: "Missing Information",
        description: "Please enter both medicine name and time",
        variant: "destructive",
      });
      return;
    }

    const newMed: Medication = {
      id: Date.now().toString(),
      name: newMedName,
      time: newMedTime,
    };

    setMedications([...medications, newMed]);
    setNewMedName("");
    setNewMedTime("");
    
    toast({
      title: "Medicine Added",
      description: `Reminder set for ${newMedName} at ${newMedTime}`,
    });
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    toast({
      title: "Medicine Removed",
      description: "Reminder has been deleted",
    });
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-center mb-12">My Medicine Schedule</h2>

        <Card className="p-8 mb-8 border-2">
          <h3 className="mb-6 flex items-center gap-3">
            <Plus className="w-8 h-8" />
            Add New Medicine
          </h3>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="medName" className="text-xl">Medicine Name</Label>
              <Input
                id="medName"
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                placeholder="e.g., Blood Pressure Pill"
                className="h-16 text-xl border-2"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="medTime" className="text-xl">Time to Take</Label>
              <Input
                id="medTime"
                type="time"
                value={newMedTime}
                onChange={(e) => setNewMedTime(e.target.value)}
                className="h-16 text-xl border-2"
              />
            </div>

            <Button onClick={addMedication} size="xl" className="w-full">
              <Plus className="w-6 h-6" />
              Add Medicine
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {medications.length === 0 ? (
            <Card className="p-12 text-center border-2">
              <Clock className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
              <p className="text-2xl text-muted-foreground">
                No medicines scheduled yet. Add your first one above!
              </p>
            </Card>
          ) : (
            medications.map((med) => (
              <Card key={med.id} className="p-6 border-2 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-2xl mb-2">{med.name}</h4>
                  <p className="text-xl text-muted-foreground flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    {med.time}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => removeMedication(med.id)}
                >
                  <Trash2 className="w-6 h-6" />
                  Remove
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default MedicationSchedule;
