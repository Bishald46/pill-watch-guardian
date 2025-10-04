import Hero from "@/components/Hero";
import MedicationSchedule from "@/components/MedicationSchedule";
import CameraVerification from "@/components/CameraVerification";
import CaregiverSettings from "@/components/CaregiverSettings";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <MedicationSchedule />
      <CameraVerification />
      <CaregiverSettings />
    </main>
  );
};

export default Index;
