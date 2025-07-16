import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];
      const newPieces: ConfettiPiece[] = [];

      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -10,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 4,
          rotation: Math.random() * 360,
        });
      }

      setPieces(newPieces);

      // Clear confetti after animation
      const timeout = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [active, onComplete]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute confetti-piece"
          style={{
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            left: piece.x,
            top: piece.y,
          }}
          initial={{
            y: -10,
            rotation: piece.rotation,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotation: piece.rotation + 360,
            opacity: 0,
          }}
          transition={{
            duration: 3,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
