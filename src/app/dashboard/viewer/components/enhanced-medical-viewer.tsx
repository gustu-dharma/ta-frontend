// app/dashboard/viewer/components/enhanced-medical-viewer.tsx - ULTRA OPTIMIZED
'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, Brain, MessageSquare, Layers, Eye, EyeOff, Plus, Settings,
  Download, Share, Maximize, RotateCcw, ZoomIn, ZoomOut, Move, Info,
  Send, Upload, Play, Loader2, AlertCircle
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import NiiVueViewer from './niivue-viewer';

// Types
interface Comment {
  id: string;
  author: string;
  role: string;
  content: string;
  type: 'finding' | 'recommendation' | 'note' | 'question';
  position?: {
    x: number;
    y: number;
    z: number;
    slice: number;
    view: string;
  };
  timestamp: string;
  isPrivate: boolean;
}

interface SampleImage {
  id: string;
  title: string;
  description: string;
  url: string;
  overlayUrl?: string;
  type: string;
}

// Static data - moved outside to prevent recreation
const mockScanData = {
  id: 'MRI20240629001',
  patientName: 'Sarah Johnson',
  patientCode: 'P000123',
  scanType: 'T1',
  scanDate: '2024-06-29',
  bodyPart: 'Brain',
  title: 'Brain MRI - Follow-up Study'
};

const initialComments: Comment[] = [
  {
    id: '1',
    author: 'Dr. Robert Smith',
    role: 'Neurologist',
    content: 'Notable hyperintensity in the left temporal region. Consistent with demyelination.',
    type: 'finding',
    position: { x: 128, y: 156, z: 78, slice: 45, view: 'axial' },
    timestamp: '2024-06-29 14:30',
    isPrivate: false
  }
];

const sampleImages: SampleImage[] = [
  {
    id: 'mni152',
    title: 'MNI152 Brain Template',
    description: 'Standard brain template for neuroimaging',
    url: 'https://niivue.github.io/niivue/images/mni152.nii.gz',
    type: 'Anatomical'
  },
  {
    id: 'hippocampus-overlay',
    title: 'Hippocampus with Segmentation',
    description: 'Original hippocampus with segmentation overlay',
    url: '/hippo-ori.nii.gz',
    overlayUrl: '/hippo-segmentasi.nii.gz',
    type: 'Overlay Sample'
  }
];

const EnhancedMedicalViewer: React.FC = () => {
  // Core viewer state
  const [showViewer, setShowViewer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isViewerReady, setIsViewerReady] = useState(false);

  // Image state
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [overlayUrl, setOverlayUrl] = useState("");
  const [overlayFile, setOverlayFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [inputOverlayUrl, setInputOverlayUrl] = useState("");
  const [currentSample, setCurrentSample] = useState("");

  // UI state
  const [showComments, setShowComments] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState([0.7]);
  const [currentSlice, setCurrentSlice] = useState(45);
  const [currentView, setCurrentView] = useState('axial');
  const [zoom, setZoom] = useState(1.0);
  const [brightness, setBrightness] = useState([50]);
  const [contrast, setContrast] = useState([50]);
  
  // Comment system state
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState('note');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{x: number, y: number} | null>(null);

  // Viewer controls
  const [viewerMode, setViewerMode] = useState('multiplanar');
  const [crosshairVisible, setCrosshairVisible] = useState(true);
  const [colormap, setColormap] = useState('gray');

  // File refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayFileInputRef = useRef<HTMLInputElement>(null);

  // Memoized calculations
  const hasOverlay = useMemo(() => Boolean(overlayUrl || overlayFile), [overlayUrl, overlayFile]);
  const currentViewComments = useMemo(() => 
    comments.filter(comment => 
      comment.position && 
      comment.position.view === currentView && 
      comment.position.slice === currentSlice
    ), [comments, currentView, currentSlice]
  );

  // Event handlers
  const handleLoadImage = useCallback(() => {
    if (!inputUrl.trim()) return;
    
    setImageUrl(inputUrl);
    setImageFile(null);
    
    if (inputOverlayUrl.trim()) {
      setOverlayUrl(inputOverlayUrl);
      setOverlayFile(null);
    } else {
      setOverlayUrl("");
      setOverlayFile(null);
    }
    
    setCurrentSample("url-input");
    setShowViewer(true);
    setError("");
  }, [inputUrl, inputOverlayUrl]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImageUrl("");
    setCurrentSample("file-upload");
    setShowViewer(true);
    setError("");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleOverlayUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setOverlayFile(file);
    setOverlayUrl("");
    
    if (overlayFileInputRef.current) {
      overlayFileInputRef.current.value = '';
    }
  }, []);

  const loadSampleImage = useCallback((sample: SampleImage) => {
    setImageUrl(sample.url);
    setImageFile(null);
    setInputUrl(sample.url);
    
    if (sample.overlayUrl) {
      setOverlayUrl(sample.overlayUrl);
      setOverlayFile(null);
      setInputOverlayUrl(sample.overlayUrl);
    } else {
      setOverlayUrl("");
      setOverlayFile(null);
      setInputOverlayUrl("");
    }
    
    setCurrentSample(sample.id);
    setShowViewer(true);
    setError("");
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingComment) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setSelectedPosition({ x, y });
  }, [isAddingComment]);

  const addComment = useCallback(() => {
    if (!newComment.trim() || !selectedPosition) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      role: 'Doctor',
      content: newComment,
      type: commentType as any,
      position: {
        x: selectedPosition.x,
        y: selectedPosition.y,
        z: currentSlice,
        slice: currentSlice,
        view: currentView
      },
      timestamp: new Date().toISOString(),
      isPrivate: false
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
    setIsAddingComment(false);
    setSelectedPosition(null);
  }, [newComment, selectedPosition, commentType, currentSlice, currentView]);

  const getCommentIcon = useCallback((type: string) => {
    switch (type) {
      case 'finding': return <Brain className="h-4 w-4 text-blue-600" />;
      case 'recommendation': return <MessageSquare className="h-4 w-4 text-green-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  }, []);

  const resetView = useCallback(() => {
    setZoom(1.0);
    setBrightness([50]);
    setContrast([50]);
    setCurrentSlice(45);
  }, []);

  const handleBack = useCallback(() => {
    setShowViewer(false);
    setImageUrl("");
    setImageFile(null);
    setOverlayUrl("");
    setOverlayFile(null);
    setCurrentSample("");
    setError("");
    setIsLoading(false);
    setIsViewerReady(false);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsViewerReady(false);
  }, []);

  const handleLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (!loading) {
      // Quick ready state without delay
      setIsViewerReady(true);
    }
  }, []);

  // Gallery view
  if (!showViewer) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Enhanced Medical Viewer</h1>
              <p className="text-muted-foreground">
                Advanced medical imaging viewer with overlay support and annotation system
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* URL Input Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Load from URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Image URL</label>
                <Input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.com/brain.nii.gz"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Overlay URL (Optional)
                </label>
                <Input
                  type="url"
                  value={inputOverlayUrl}
                  onChange={(e) => setInputOverlayUrl(e.target.value)}
                  placeholder="https://example.com/segmentation.nii.gz"
                />
              </div>
              
              <Button
                onClick={handleLoadImage}
                disabled={!inputUrl.trim()}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Load {inputOverlayUrl.trim() ? 'with Overlay' : 'Image'}
              </Button>
            </CardContent>
          </Card>

          {/* File Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".nii,.nii.gz"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <input
                ref={overlayFileInputRef}
                type="file"
                accept=".nii,.nii.gz"
                onChange={handleOverlayUpload}
                className="hidden"
              />
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Base Image
                  {imageFile && <span className="ml-2 text-green-600">✓</span>}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => overlayFileInputRef.current?.click()}
                  className="w-full"
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Select Overlay (Optional)
                  {overlayFile && <span className="ml-2 text-green-600">✓</span>}
                </Button>
              </div>
              
              {imageFile && (
                <div className="text-xs text-muted-foreground">
                  <p><strong>Base:</strong> {imageFile.name}</p>
                  {overlayFile && <p><strong>Overlay:</strong> {overlayFile.name}</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sample Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {sampleImages.map((sample) => (
                <div
                  key={sample.id}
                  className="group p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => loadSampleImage(sample)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{sample.title}</h3>
                    <div className="flex gap-1">
                      <Badge variant="outline">{sample.type}</Badge>
                      {sample.overlayUrl && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Overlay
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{sample.description}</p>
                  <Button size="sm" variant="ghost" className="w-full">
                    <Play className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Viewer mode
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white hover:bg-gray-700" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>
          <div className="text-white">
            <h1 className="text-lg font-semibold">{mockScanData.title}</h1>
            <p className="text-sm text-gray-300">
              {mockScanData.patientName} • {mockScanData.scanType} • {mockScanData.scanDate}
            </p>
          </div>
          {hasOverlay && (
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Layers className="h-3 w-3 mr-1" />
              Overlay Active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 text-white">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
          <Button variant="ghost" className="text-white hover:bg-gray-700">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:bg-gray-700">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:bg-gray-700">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-600 text-white p-4 text-center border-b border-red-500 shrink-0">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Viewer Controls */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* View Controls */}
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">View Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white text-xs">View Mode</label>
                  <Select value={viewerMode} onValueChange={setViewerMode}>
                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiplanar">Multiplanar</SelectItem>
                      <SelectItem value="single">Single View</SelectItem>
                      <SelectItem value="3d">3D Volume</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-white text-xs">Current View</label>
                  <Select value={currentView} onValueChange={setCurrentView}>
                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="axial">Axial</SelectItem>
                      <SelectItem value="coronal">Coronal</SelectItem>
                      <SelectItem value="sagittal">Sagittal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-white text-xs">Slice</label>
                    <span className="text-white text-xs">{currentSlice}/90</span>
                  </div>
                  <Slider
                    value={[currentSlice]}
                    onValueChange={(value) => setCurrentSlice(value[0])}
                    max={90}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-white text-xs">Crosshair</label>
                  <Switch
                    checked={crosshairVisible}
                    onCheckedChange={setCrosshairVisible}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Controls */}
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Image Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-white text-xs">Brightness</label>
                    <span className="text-white text-xs">{brightness[0]}%</span>
                  </div>
                  <Slider
                    value={brightness}
                    onValueChange={setBrightness}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-white text-xs">Contrast</label>
                    <span className="text-white text-xs">{contrast[0]}%</span>
                  </div>
                  <Slider
                    value={contrast}
                    onValueChange={setContrast}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white text-xs">Colormap</label>
                  <Select value={colormap} onValueChange={setColormap}>
                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gray">Grayscale</SelectItem>
                      <SelectItem value="hot">Hot</SelectItem>
                      <SelectItem value="cool">Cool</SelectItem>
                      <SelectItem value="jet">Jet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetView}
                    className="flex-1 bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                  >
                    <Maximize className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Overlay Controls */}
            {hasOverlay && (
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Overlay Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-white text-xs">Show Overlay</label>
                    <Switch
                      checked={showOverlay}
                      onCheckedChange={setShowOverlay}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-white text-xs">Opacity</label>
                      <span className="text-white text-xs">{Math.round(overlayOpacity[0] * 100)}%</span>
                    </div>
                    <Slider
                      value={overlayOpacity}
                      onValueChange={setOverlayOpacity}
                      max={1}
                      min={0}
                      step={0.1}
                      disabled={!showOverlay}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tools */}
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                >
                  <Move className="h-3 w-3 mr-2" />
                  Pan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                >
                  <ZoomIn className="h-3 w-3 mr-2" />
                  Zoom
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingComment(!isAddingComment)}
                  className={`w-full ${isAddingComment ? 'bg-blue-600 border-blue-500' : 'bg-gray-600 border-gray-500'} text-white hover:bg-gray-500`}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Add Comment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Viewer */}
        <div className="flex-1 relative bg-black">
          {/* Canvas Container */}
          <div className="w-full h-full relative" onClick={handleCanvasClick}>
            <NiiVueViewer
              imageUrl={imageUrl}
              imageFile={imageFile}
              overlayUrl={overlayUrl}
              overlayFile={overlayFile}
              onError={handleError}
              onLoading={handleLoading}
              overlayOpacity={overlayOpacity[0]}
              showOverlay={showOverlay}
              className="w-full h-full cursor-crosshair"
            />
          </div>

          {/* Loading State */}
          {!isViewerReady && (imageUrl || imageFile) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <div className="text-center text-white">
                <Brain className="h-12 w-12 animate-pulse mx-auto mb-4" />
                <p className="text-lg">Loading medical viewer...</p>
                <p className="text-sm text-gray-400 mt-2">
                  {hasOverlay ? 'Initializing with overlay support' : 'Initializing NiiVue engine'}
                </p>
              </div>
            </div>
          )}

          {/* Comment Markers */}
          {isViewerReady && currentViewComments.map((comment) => (
            <Popover key={comment.id}>
              <PopoverTrigger asChild>
                <button
                  className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-10"
                  style={{
                    left: (comment.position?.x || 0) - 8,
                    top: (comment.position?.y || 0) - 8,
                  }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getCommentIcon(comment.type)}
                    <span className="font-medium text-sm">{comment.author}</span>
                    <Badge variant="outline" className="text-xs">
                      {comment.type}
                    </Badge>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-gray-500">{comment.timestamp}</p>
                </div>
              </PopoverContent>
            </Popover>
          ))}

          {/* Selected Position Marker */}
          {selectedPosition && isAddingComment && (
            <div
              className="absolute w-4 h-4 bg-yellow-500 border-2 border-white rounded-full shadow-lg animate-pulse z-10"
              style={{
                left: selectedPosition.x - 8,
                top: selectedPosition.y - 8,
              }}
            />
          )}

          {/* Instructions */}
          {isAddingComment && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-10">
              <p className="text-sm">Click on the image to place a comment marker</p>
            </div>
          )}

          {/* Viewer Info */}
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg z-10">
            <div className="text-xs space-y-1">
              <div>View: {currentView} | Slice: {currentSlice}/90</div>
              <div>Zoom: {zoom.toFixed(1)}x | Position: {selectedPosition ? `${selectedPosition.x}, ${selectedPosition.y}` : 'N/A'}</div>
              {hasOverlay && <div>Overlay: {showOverlay ? `${Math.round(overlayOpacity[0] * 100)}%` : 'Hidden'}</div>}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Comments */}
        {showComments && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Comments Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments ({comments.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(false)}
                  className="text-white hover:bg-gray-700"
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No comments yet</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-700 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      {getCommentIcon(comment.type)}
                      <span className="font-medium text-white text-sm">{comment.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {comment.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{comment.content}</p>
                    {comment.position && (
                      <div className="text-xs text-gray-400">
                        {comment.position.view} • Slice {comment.position.slice} • ({comment.position.x}, {comment.position.y})
                      </div>
                    )}
                    <p className="text-xs text-gray-500">{comment.timestamp}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            {selectedPosition && isAddingComment && (
              <div className="p-4 border-t border-gray-700 bg-gray-750">
                <div className="space-y-3">
                  <h4 className="font-medium text-white text-sm">Add Comment</h4>
                  
                  <Select value={commentType} onValueChange={setCommentType}>
                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="finding">Finding</SelectItem>
                      <SelectItem value="recommendation">Recommendation</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your comment..."
                    className="min-h-[80px] bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      size="sm"
                      className="flex-1"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingComment(false);
                        setSelectedPosition(null);
                        setNewComment('');
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Toggle Comments Button */}
        {!showComments && (
          <Button
            onClick={() => setShowComments(true)}
            className="absolute top-20 right-4 bg-blue-600 hover:bg-blue-700 z-10"
            size="sm"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments ({comments.length})
          </Button>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-xs text-gray-300 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <span>Patient: {mockScanData.patientName}</span>
          <span>Study: {mockScanData.scanType}</span>
          <span>Date: {mockScanData.scanDate}</span>
          {hasOverlay && <span>Overlay: Active</span>}
        </div>
        <div className="flex items-center gap-4">
          <span>Files: {1 + (hasOverlay ? 1 : 0)}</span>
          <span>Comments: {comments.length}</span>
          {isViewerReady && <span className="text-green-400">● Viewer Ready</span>}
          {isLoading && <span className="text-yellow-400">● Loading...</span>}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMedicalViewer;