import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Save, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CaregiverSettings = () => {
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverPhone, setCaregiverPhone] = useState("");
  const [caregiverEmail, setCaregiverEmail] = useState("");
  const { toast } = useToast();

  const saveCaregiver = () => {
    if (!caregiverName || (!caregiverPhone && !caregiverEmail)) {
      toast({
        title: "Missing Information",
        description: "Please enter name and at least phone or email",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Caregiver Saved",
      description: `${caregiverName} will be notified if medicine is missed`,
    });
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-center mb-12">Caregiver Notifications</h2>

        <Card className="p-8 border-2">
          <div className="flex items-center gap-4 mb-8">
            <Bell className="w-12 h-12 text-accent" />
            <div>
              <h3 className="mb-2">Set Up Emergency Contact</h3>
              <p className="text-xl text-muted-foreground">
                They'll be notified if you miss your medicine
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="caregiverName" className="text-xl">
                Caregiver Name
              </Label>
              <Input
                id="caregiverName"
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                placeholder="e.g., John Smith"
                className="h-16 text-xl border-2"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="caregiverPhone" className="text-xl">
                Phone Number
              </Label>
              <Input
                id="caregiverPhone"
                type="tel"
                value={caregiverPhone}
                onChange={(e) => setCaregiverPhone(e.target.value)}
                placeholder="e.g., (555) 123-4567"
                className="h-16 text-xl border-2"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="caregiverEmail" className="text-xl">
                Email Address (Optional)
              </Label>
              <Input
                id="caregiverEmail"
                type="email"
                value={caregiverEmail}
                onChange={(e) => setCaregiverEmail(e.target.value)}
                placeholder="e.g., john@example.com"
                className="h-16 text-xl border-2"
              />
            </div>

            <Button onClick={saveCaregiver} variant="senior" size="xl" className="w-full">
              <Save className="w-6 h-6" />
              Save Caregiver
            </Button>
          </div>
        </Card>

        <Card className="mt-8 p-6 border-2 bg-primary/5">
          <h4 className="text-xl font-semibold mb-4 flex items-center gap-3">
            <UserPlus className="w-6 h-6" />
            When Will They Be Notified?
          </h4>
          <ul className="space-y-3 text-lg text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">•</span>
              <span>If you don't take your medicine within 15 minutes of the scheduled time</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">•</span>
              <span>If camera verification fails 3 times in a row</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">•</span>
              <span>If you dismiss the alarm without verification</span>
            </li>
          </ul>
        </Card>
      </div>
    </section>
  );
};

export default CaregiverSettings;
