// app/dashboard/viewer/components/niivue-viewer.tsx - ULTRA OPTIMIZED
'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { Niivue } from "@niivue/niivue";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface NiiVueViewerProps {
  imageUrl?: string;
  imageFile?: File | null;
  overlayUrl?: string;
  overlayFile?: File | null;
  onError?: (error: string) => void;
  onLoading?: (loading: boolean) => void;
  overlayOpacity?: number;
  showOverlay?: boolean;
  className?: string;
}

const NiiVueViewer: React.FC<NiiVueViewerProps> = ({
  imageUrl,
  imageFile,
  overlayUrl,
  overlayFile,
  onError,
  onLoading,
  overlayOpacity = 0.7,
  showOverlay = true,
  className = "w-full h-full"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nvRef = useRef<Niivue | null>(null);
  const mountedRef = useRef(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [internalOverlayOpacity, setInternalOverlayOpacity] = useState([overlayOpacity]);
  const [internalShowOverlay, setInternalShowOverlay] = useState(showOverlay);

  // Stable cleanup function
  const cleanupViewer = useCallback(() => {
    if (nvRef.current) {
      try {
        nvRef.current.dispose();
      } catch (error) {
        console.warn("[NiiVue] Cleanup error:", error);
      } finally {
        nvRef.current = null;
        if (mountedRef.current) {
          setIsInitialized(false);
        }
      }
    }
  }, []);

  // Fast initialization without dependency loops
  const initializeViewer = useCallback(async () => {
    if (!canvasRef.current || (!imageUrl && !imageFile) || !mountedRef.current) return;

    try {
      onLoading?.(true);
      cleanupViewer();

      const nv = new Niivue({
        show3Dcrosshair: true,
        backColor: [0.1, 0.1, 0.1, 1],
        crosshairColor: [1, 0, 0, 1],
        multiplanarPadPixels: 8,
        multiplanarForceRender: true,
        multiplanarLayout: 2,
        isColorbar: true,
        textHeight: 0.04,
        colorbarHeight: 0.04,
        crosshairWidth: 1,
        dragMode: 1,
      });

      nv.attachToCanvas(canvasRef.current);
      
      // Build volume list
      const volumeList = [];
      
      // Base image
      if (imageFile) {
        volumeList.push({ file: imageFile });
      } else if (imageUrl) {
        volumeList.push({ url: imageUrl });
      }

      // Overlay
      if (overlayFile) {
        volumeList.push({ 
          file: overlayFile,
          opacity: internalShowOverlay ? internalOverlayOpacity[0] : 0,
          colormap: "warm",
        });
      } else if (overlayUrl) {
        volumeList.push({ 
          url: overlayUrl,
          opacity: internalShowOverlay ? internalOverlayOpacity[0] : 0,
          colormap: "warm",
        });
      }

      await nv.loadVolumes(volumeList);
      
      if (!mountedRef.current) return;
      
      nvRef.current = nv;
      setIsInitialized(true);
      onLoading?.(false);
      
    } catch (err) {
      console.error("[NiiVue] Load error:", err);
      if (mountedRef.current) {
        cleanupViewer();
        onError?.(err instanceof Error ? err.message : "Failed to load image");
        onLoading?.(false);
      }
    }
  }, [imageUrl, imageFile, overlayUrl, overlayFile, cleanupViewer]);

  // Handle overlay opacity updates
  const updateOverlayOpacity = useCallback((opacity: number) => {
    if (nvRef.current && nvRef.current.volumes.length > 1) {
      nvRef.current.setOpacity(1, opacity);
      nvRef.current.updateGLVolume();
    }
  }, []);

  // Handle overlay toggle
  const toggleOverlay = useCallback(() => {
    if (nvRef.current && nvRef.current.volumes.length > 1) {
      const newVisibility = !internalShowOverlay;
      const newOpacity = newVisibility ? internalOverlayOpacity[0] : 0;
      nvRef.current.setOpacity(1, newOpacity);
      nvRef.current.updateGLVolume();
      setInternalShowOverlay(newVisibility);
    }
  }, [internalShowOverlay, internalOverlayOpacity]);

  // Sync external overlay props
  useEffect(() => {
    if (overlayOpacity !== internalOverlayOpacity[0]) {
      setInternalOverlayOpacity([overlayOpacity]);
      if (isInitialized && internalShowOverlay) {
        updateOverlayOpacity(overlayOpacity);
      }
    }
  }, [overlayOpacity, isInitialized, internalShowOverlay, updateOverlayOpacity]);

  useEffect(() => {
    if (showOverlay !== internalShowOverlay) {
      setInternalShowOverlay(showOverlay);
      if (isInitialized) {
        updateOverlayOpacity(showOverlay ? internalOverlayOpacity[0] : 0);
      }
    }
  }, [showOverlay, isInitialized, internalOverlayOpacity, updateOverlayOpacity]);

  // Handle internal opacity changes
  useEffect(() => {
    if (isInitialized && internalShowOverlay) {
      updateOverlayOpacity(internalOverlayOpacity[0]);
    }
  }, [internalOverlayOpacity, isInitialized, internalShowOverlay, updateOverlayOpacity]);

  // Initialize on mount/image change - removed problematic dependencies
  useEffect(() => {
    const hasImage = imageUrl || imageFile;
    if (hasImage && canvasRef.current && mountedRef.current) {
      // Quick initialization without delay
      initializeViewer();
    }
  }, [imageUrl, imageFile, overlayUrl, overlayFile]); // Only essential deps

  // Mount/unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanupViewer();
    };
  }, [cleanupViewer]);

  const hasOverlay = Boolean(overlayUrl || overlayFile);

  return (
    <div className="w-full h-full relative bg-slate-900">
      {/* OVERLAY CONTROLS PANEL REMOVED */}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
      
      {/* Loading State - Simplified */}
      {!isInitialized && (imageUrl || imageFile) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20">
          <div className="text-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading medical image{hasOverlay ? ' with overlay' : ''}...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NiiVueViewer;