import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";

interface ScratchCardProps {
  reward: string;
  rewardLabel: string;
  onComplete: () => void;
}

export default function ScratchCard({ reward, rewardLabel, onComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Définir la taille du canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // Résolution plus haute
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Créer le fond argenté à gratter
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#f0f0f0");
    gradient.addColorStop(0.5, "#d0d0d0");
    gradient.addColorStop(1, "#e8e8e8");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Ajouter du texte "GRATTEZ ICI"
    ctx.fillStyle = "#888";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎁 GRATTEZ ICI 🎁", rect.width / 2, rect.height / 2);
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Gratter en mode "destination-out" (efface le gris)
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc((x - rect.left) * scaleX, (y - rect.top) * scaleY, 30 * scaleX, 0, Math.PI * 2);
    ctx.fill();

    // Calculer le pourcentage gratté
    calculateScratchPercentage();
  };

  const calculateScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    // Si plus de 60% est gratté, révéler complètement
    if (percentage > 60 && !isRevealed) {
      setIsRevealed(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScratching) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isScratching) {
      e.preventDefault();
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl">
      {/* Le cadeau en dessous */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isRevealed ? 1 : 0.5, opacity: isRevealed ? 1 : 0.3 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center"
        >
          <div className="bg-white/20 backdrop-blur p-6 rounded-3xl mb-4 inline-block">
            <Gift className="w-20 h-20 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">
            🎉 Félicitations !
          </h3>
          <p className="text-white text-xl font-semibold">
            {rewardLabel}
          </p>
        </motion.div>
      </div>

      {/* La couche à gratter */}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer touch-none"
          style={{ 
            cursor: isScratching ? "grabbing" : "grab",
            touchAction: "none"
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      )}

      {/* Barre de progression */}
      {!isRevealed && scratchPercentage > 0 && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/30 backdrop-blur rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scratchPercentage}%` }}
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
            />
          </div>
          <p className="text-center text-white text-sm font-semibold mt-2">
            {Math.round(scratchPercentage)}% gratté
          </p>
        </div>
      )}

      {/* Message révélé */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 text-center"
        >
          <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-2xl border-2 border-white/40">
            <p className="text-white font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Contactez-nous pour récupérer votre cadeau !
              <Sparkles className="w-5 h-5" />
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

