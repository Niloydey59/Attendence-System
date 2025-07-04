"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useWebcam = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(true); // Enable debug by default for testing

  const log = (message: string, ...args: any[]) => {
    if (isDebugMode) {
      console.log(message, ...args);
    }
  };

  const startWebcam = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      log('Requesting webcam access...');
      
      // Check if video ref is available
      if (!videoRef.current) {
        console.error('Video ref is null when starting webcam');
        throw new Error('Video element not available');
      }
      
      log('Video ref is available, requesting media...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      log('Webcam access granted, stream obtained:', stream);

      if (videoRef.current) {
        log('Assigning stream to video element...');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current;
          if (!video) {
            reject(new Error('Video ref became null'));
            return;
          }

          const handleLoadedMetadata = () => {
            log('Video metadata loaded, attempting to play...');
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            resolve();
          };

          const handleError = (e: Event) => {
            console.error('Video loading error:', e);
            video.removeEventListener('error', handleError);
            reject(new Error('Video loading failed'));
          };

          if (video.readyState >= 1) { // HAVE_METADATA
            log('Video already has metadata');
            resolve();
          } else {
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('error', handleError);

            // Fallback timeout
            setTimeout(() => {
              video.removeEventListener('loadedmetadata', handleLoadedMetadata);
              video.removeEventListener('error', handleError);
              if (video.readyState >= 1) {
                resolve();
              } else {
                reject(new Error('Video loading timeout'));
              }
            }, 5000);
          }
        });
        
        // Ensure video plays
        try {
          await videoRef.current.play();
          log('Video is now playing');
          setIsWebcamActive(true);
        } catch (playError) {
          console.error('Error playing video:', playError);
          // Try manual play with muted
          videoRef.current.muted = true;
          await videoRef.current.play();
          log('Video playing with muted=true');
          setIsWebcamActive(true);
        }
      } else {
        console.error('Video ref became null during setup');
        throw new Error('Video element not found during setup');
      }
    } catch (error) {
      console.error('Error accessing webcam:', error); // Keep error logs
      setError(error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: "Webcam Error",
        description: "Failed to access webcam. Please check permissions and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, isDebugMode]);

  const stopWebcam = useCallback(() => {
    console.log('Stopping webcam...');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
    
    setIsWebcamActive(false);
    setError(null);
  }, []);

  const captureFrame = useCallback((): HTMLCanvasElement | null => {
    if (!videoRef.current || !isWebcamActive) {
      log('Cannot capture frame: video not active');
      return null;
    }

    const video = videoRef.current;
    
    // Check if video has loaded
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.warn('Video not ready for capture');
      return null;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Cannot get canvas context');
      return null;
    }

    canvas.width = video.videoWidth || video.clientWidth;
    canvas.height = video.videoHeight || video.clientHeight;
    
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      log('Frame captured successfully:', canvas.width, 'x', canvas.height);
      return canvas;
    } catch (error) {
      console.error('Error capturing frame:', error); // Keep error logs
      return null;
    }
  }, [isWebcamActive, isDebugMode]);

  // Handle video element events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded:', video.videoWidth, 'x', video.videoHeight);
    };

    const handleCanPlay = () => {
      console.log('Video can play');
    };

    const handleError = (event: Event) => {
      console.error('Video error:', event);
      setError('Video playback error');
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return {
    videoRef,
    isWebcamActive,
    isLoading,
    error,
    isDebugMode,
    setIsDebugMode,
    startWebcam,
    stopWebcam,
    captureFrame,
  };
};
