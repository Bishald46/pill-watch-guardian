import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CameraVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsVerifying(true);
      
      // Simulate verification after 3 seconds
      setTimeout(() => {
        setVerified(true);
        setIsVerifying(false);
        
        // Stop camera
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        
        toast({
          title: "Medicine Verified!",
          description: "Great job! Your medicine has been confirmed.",
        });
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-center mb-12">Verify Medicine Taken</h2>

        <Card className="p-8 border-2">
          <div className="aspect-video bg-muted rounded-xl mb-8 overflow-hidden relative flex items-center justify-center">
            {!isVerifying && !verified && (
              <div className="text-center">
                <Camera className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
                <p className="text-2xl text-muted-foreground">
                  Click below to start verification
                </p>
              </div>
            )}
            
            {isVerifying && (
              <div className="absolute inset-0">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="text-center text-white">
                    <div className="animate-pulse mb-4">
                      <Camera className="w-24 h-24 mx-auto" />
                    </div>
                    <p className="text-3xl font-bold">Verifying...</p>
                  </div>
                </div>
              </div>
            )}
            
            {verified && (
              <div className="text-center">
                <CheckCircle className="w-24 h-24 mx-auto mb-4 text-secondary" />
                <p className="text-3xl font-bold text-secondary">
                  Verified Successfully!
                </p>
              </div>
            )}
          </div>

          {!verified && (
            <Button
              variant="senior"
              size="xl"
              className="w-full"
              onClick={startCamera}
              disabled={isVerifying}
            >
              <Camera className="w-8 h-8" />
              {isVerifying ? "Verifying..." : "Start Verification"}
            </Button>
          )}

          {verified && (
            <div className="space-y-4">
              <div className="bg-secondary/10 border-2 border-secondary rounded-xl p-6 text-center">
                <p className="text-2xl font-semibold text-secondary">
                  ✓ Medicine confirmed at {new Date().toLocaleTimeString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setVerified(false)}
              >
                Verify Again
              </Button>
            </div>
          )}
        </Card>

        <Card className="mt-8 p-6 border-2 bg-accent/5">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-xl font-semibold mb-2">How It Works</h4>
              <p className="text-lg text-muted-foreground">
                The camera will take a photo when you take your medicine. This confirms you've taken it on time. 
                If verification fails, your caregiver will be notified automatically.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CameraVerification;
