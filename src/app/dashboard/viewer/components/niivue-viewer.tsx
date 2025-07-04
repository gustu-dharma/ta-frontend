// app/dashboard/viewer/components/niivue-viewer.tsx - ULTRA OPTIMIZED WITH WORKING CONTROLS
'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { Niivue } from "@niivue/niivue";
import { Loader2 } from "lucide-react";

interface NiiVueViewerProps {
  imageUrl?: string;
  imageFile?: File | null;
  overlayUrl?: string;
  overlayFile?: File | null;
  onError?: (error: string) => void;
  onLoading?: (loading: boolean) => void;
  overlayOpacity?: number;
  showOverlay?: boolean;
  brightness?: number;
  contrast?: number;
  colormap?: string;
  activeTool?: 'pan' | 'zoom' | 'comment' | null;
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
  brightness = 50,
  contrast = 50,
  colormap = 'gray',
  activeTool = null,
  className = "w-full h-full"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nvRef = useRef<any>(null);
  const mountedRef = useRef(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [internalOverlayOpacity, setInternalOverlayOpacity] = useState([overlayOpacity]);
  const [internalShowOverlay, setInternalShowOverlay] = useState(showOverlay);
  
  // Store previous values to prevent unnecessary updates
  const prevControlsRef = useRef({ brightness, contrast, colormap });

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

  // Apply image controls function - STABLE with no dependencies
  const applyImageControls = useCallback((brightVal: number, contrastVal: number, colormapVal: string) => {
    if (!nvRef.current || !isInitialized) return;

    try {
      const nv = nvRef.current;
      if (!nv.volumes || nv.volumes.length === 0) return;

      const vol = nv.volumes[0];
      
      // Store original values only once
      if (typeof vol.originalCalMin === 'undefined') {
        vol.originalCalMin = vol.cal_min;
        vol.originalCalMax = vol.cal_max;
        vol.originalGlobalMin = vol.global_min;
        vol.originalGlobalMax = vol.global_max;
      }
      
      // Apply brightness/contrast
      const originalRange = vol.originalCalMax - vol.originalCalMin;
      const brightnessOffset = (brightVal - 50) / 50;
      const center = (vol.originalCalMin + vol.originalCalMax) / 2;
      const newCenter = center + (brightnessOffset * originalRange * 0.5);
      const contrastFactor = contrastVal / 50;
      const newWidth = originalRange * contrastFactor;
      
      vol.cal_min = newCenter - (newWidth / 2);
      vol.cal_max = newCenter + (newWidth / 2);
      
      // Ensure bounds
      if (vol.originalGlobalMin !== undefined && vol.originalGlobalMax !== undefined) {
        vol.cal_min = Math.max(vol.cal_min, vol.originalGlobalMin);
        vol.cal_max = Math.min(vol.cal_max, vol.originalGlobalMax);
      }
      
      // Apply colormap
      if (vol.colormap !== colormapVal) {
        vol.colormap = colormapVal;
        try {
          if (nv.setColormap) nv.setColormap(0, colormapVal);
        } catch (e) {
          // Ignore setColormap errors
        }
      }
      
      // Force update
      if (nv.updateGLVolume) nv.updateGLVolume();
      if (nv.drawScene) nv.drawScene();
      
    } catch (error) {
      console.error("[NiiVue] Error applying image controls:", error);
    }
  }, [isInitialized]);

  // Fast initialization - ORIGINAL STABLE VERSION
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

  // Handle overlay opacity updates - STABLE
  const updateOverlayOpacity = useCallback((opacity: number) => {
    if (nvRef.current && nvRef.current.volumes && nvRef.current.volumes.length > 1) {
      try {
        if (nvRef.current.setOpacity) nvRef.current.setOpacity(1, opacity);
        if (nvRef.current.updateGLVolume) nvRef.current.updateGLVolume();
      } catch (error) {
        console.warn("[NiiVue] Overlay opacity error:", error);
      }
    }
  }, []);

  // Handle overlay toggle - STABLE
  const toggleOverlay = useCallback(() => {
    if (nvRef.current && nvRef.current.volumes && nvRef.current.volumes.length > 1) {
      const newVisibility = !internalShowOverlay;
      const newOpacity = newVisibility ? internalOverlayOpacity[0] : 0;
      try {
        if (nvRef.current.setOpacity) nvRef.current.setOpacity(1, newOpacity);
        if (nvRef.current.updateGLVolume) nvRef.current.updateGLVolume();
      } catch (error) {
        console.warn("[NiiVue] Overlay toggle error:", error);
      }
      setInternalShowOverlay(newVisibility);
    }
  }, [internalShowOverlay, internalOverlayOpacity]);

  // Update drag mode when tool changes - STABLE
  useEffect(() => {
    if (nvRef.current && isInitialized) {
      try {
        const dragMode = activeTool === 'pan' ? 1 : activeTool === 'zoom' ? 3 : 1;
        if (nvRef.current.opts) {
          nvRef.current.opts.dragMode = dragMode;
        }
      } catch (error) {
        console.warn("[NiiVue] Drag mode error:", error);
      }
    }
  }, [activeTool, isInitialized]);

  // Apply image controls only when values actually change - PERFORMANCE OPTIMIZED
  useEffect(() => {
    if (isInitialized && nvRef.current) {
      const prev = prevControlsRef.current;
      
      // Only apply if values actually changed
      if (prev.brightness !== brightness || prev.contrast !== contrast || prev.colormap !== colormap) {
        applyImageControls(brightness, contrast, colormap);
        
        // Update stored values
        prevControlsRef.current = { brightness, contrast, colormap };
      }
    }
  }, [brightness, contrast, colormap, isInitialized, applyImageControls]);

  // Sync external overlay props - STABLE
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

  // Handle internal opacity changes - STABLE
  useEffect(() => {
    if (isInitialized && internalShowOverlay) {
      updateOverlayOpacity(internalOverlayOpacity[0]);
    }
  }, [internalOverlayOpacity, isInitialized, internalShowOverlay, updateOverlayOpacity]);

  // Initialize on mount/image change - ORIGINAL DEPENDENCIES
  useEffect(() => {
    const hasImage = imageUrl || imageFile;
    if (hasImage && canvasRef.current && mountedRef.current) {
      initializeViewer();
    }
  }, [imageUrl, imageFile, overlayUrl, overlayFile]); // ONLY essential deps - no loops!

  // Mount/unmount - STABLE
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

      {/* Debug Info - Optional */}
      {isInitialized && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded z-20">
          <div>B: {brightness}% | C: {contrast}% | {colormap}</div>
          <div>Tool: {activeTool || 'none'}</div>
        </div>
      )}
    </div>
  );
};

export default NiiVueViewer;