import { Button } from "@/components/ui/button";
import { Clock, Shield, Bell } from "lucide-react";
import heroImage from "@/assets/hero-elderly.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      
      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="animate-fade-in">
            Never Miss Your Medicine Again
          </h1>
          
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-powered medication reminders with visual verification and caregiver alerts
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button variant="senior" size="xl">
              <Clock className="w-8 h-8" />
              Set Medicine Time
            </Button>
            <Button variant="outline" size="xl">
              Learn More
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border-2 border-border shadow-lg">
              <Clock className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl mb-3">Smart Reminders</h3>
              <p className="text-xl text-muted-foreground">
                Set personalized medication schedules with gentle audio and visual alerts
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border-2 border-border shadow-lg">
              <Shield className="w-16 h-16 mx-auto mb-4 text-secondary" />
              <h3 className="text-2xl mb-3">Visual Verification</h3>
              <p className="text-xl text-muted-foreground">
                Camera confirms medication was taken correctly and on time
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border-2 border-border shadow-lg">
              <Bell className="w-16 h-16 mx-auto mb-4 text-accent" />
              <h3 className="text-2xl mb-3">Caregiver Alerts</h3>
              <p className="text-xl text-muted-foreground">
                Automatic notifications to family when medicine is missed
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
