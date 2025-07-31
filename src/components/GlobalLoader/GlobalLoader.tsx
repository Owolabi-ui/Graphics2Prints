"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function GlobalLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate a short delay for the loader
    const timeout = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300">
      <div className="flex flex-col items-center">
        <Image
          src="/images/g2p_logo.png"
          alt="Company Logo"
          width={120}
          height={120}
          className="animate-beat w-20 h-20 object-contain"
          priority
        />
        <style jsx global>{`
          @keyframes beat {
            0%, 100% { transform: scale(1); }
            10% { transform: scale(1.08); }
            20% { transform: scale(0.95); }
            30% { transform: scale(1.1); }
            50% { transform: scale(0.97); }
            70% { transform: scale(1.05); }
            80% { transform: scale(0.98); }
            90% { transform: scale(1.03); }
          }
          .animate-beat {
            animation: beat 1.2s infinite;
            will-change: transform;
          }
        `}</style>
      </div>
    </div>
  );
}