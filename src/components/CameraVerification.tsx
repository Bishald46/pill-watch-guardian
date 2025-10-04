import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, CheckCircle, AlertCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VerificationResult {
  verified: boolean;
  confidence: number;
  details: string;
}

const CameraVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setShowCamera(true);
      
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
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

  const captureAndVerify = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsVerifying(true);

    try {
      // Capture image from video
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) throw new Error('Could not get canvas context');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Stop camera before verification
      stopCamera();

      toast({
        title: "Analyzing...",
        description: "AI is checking if you took your medicine.",
      });

      // Send to edge function for AI analysis
      const { data, error } = await supabase.functions.invoke('verify-medicine', {
        body: { image: imageData }
      });

      if (error) throw error;

      const result = data as VerificationResult;
      setVerificationResult(result);

      if (result.verified && result.confidence > 50) {
        setVerified(true);
        toast({
          title: "Medicine Verified! ✓",
          description: `Confidence: ${result.confidence}% - ${result.details}`,
        });
      } else {
        toast({
          title: "Verification Failed",
          description: result.details || "Could not confirm medicine was taken. Please try again.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Error",
        description: "Failed to verify medicine. Please try again.",
        variant: "destructive",
      });
      stopCamera();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-center mb-12">Verify Medicine Taken</h2>

        <Card className="p-8 border-2">
          <div className="aspect-video bg-muted rounded-xl mb-8 overflow-hidden relative flex items-center justify-center">
            {!showCamera && !verified && !isVerifying && (
              <div className="text-center">
                <Camera className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
                <p className="text-2xl text-muted-foreground">
                  Click below to start camera
                </p>
              </div>
            )}
            
            {showCamera && (
              <div className="absolute inset-0">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={stopCamera}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            )}

            {isVerifying && (
              <div className="text-center">
                <div className="animate-pulse mb-4">
                  <Camera className="w-24 h-24 mx-auto text-primary" />
                </div>
                <p className="text-3xl font-bold">AI is analyzing...</p>
              </div>
            )}
            
            {verified && verificationResult && (
              <div className="text-center p-6">
                <CheckCircle className="w-24 h-24 mx-auto mb-4 text-secondary" />
                <p className="text-3xl font-bold text-secondary mb-4">
                  Verified Successfully!
                </p>
                <div className="bg-secondary/10 rounded-lg p-4">
                  <p className="text-lg">Confidence: {verificationResult.confidence}%</p>
                  <p className="text-sm text-muted-foreground mt-2">{verificationResult.details}</p>
                </div>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {!verified && !showCamera && !isVerifying && (
            <Button
              variant="senior"
              size="xl"
              className="w-full"
              onClick={startCamera}
            >
              <Camera className="w-8 h-8" />
              Start Camera
            </Button>
          )}

          {showCamera && !isVerifying && (
            <Button
              variant="senior"
              size="xl"
              className="w-full"
              onClick={captureAndVerify}
            >
              <Camera className="w-8 h-8" />
              Take Photo & Verify
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
                onClick={() => {
                  setVerified(false);
                  setVerificationResult(null);
                }}
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
