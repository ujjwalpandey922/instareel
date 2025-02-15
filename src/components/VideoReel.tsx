
import React, { useRef, useEffect, useState } from "react";
import { Heart, Share2, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface VideoReelProps {
  videoUrl: string;
  products: Product[];
  isVisible: boolean;
}

const VideoReel: React.FC<VideoReelProps> = ({ videoUrl, products, isVisible }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const { toast } = useToast();

  // Updated playback logic
  useEffect(() => {
    if (isVisible && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Playback error:", error);
          // If autoplay fails, ensure the video is muted and try again
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            try {
              await videoRef.current.play();
              setIsPlaying(true);
            } catch (retryError) {
              console.log("Retry failed:", retryError);
            }
          }
        }
      };

      playVideo();
    } else if (!isVisible && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    // Preload the video
    if (videoRef.current) {
      videoRef.current.preload = "auto";
    }
  }, [isVisible]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowControls(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setShowControls(true);
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from likes" : "Added to likes",
      duration: 1500,
    });
  };

  const handleShare = () => {
    toast({
      title: "Sharing functionality coming soon!",
      duration: 1500,
    });
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={videoUrl}
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        onClick={() => setShowControls(true)}
        onTimeUpdate={handleProgress}
      />

      {/* Controls overlay - now always visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20">
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800/50">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 right-4 flex flex-col items-end gap-4">
          <button
            onClick={toggleLike}
            className="p-3 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition transform hover:scale-110"
          >
            <Heart
              className={cn("w-6 h-6", isLiked ? "text-red-500 fill-red-500" : "text-white")}
            />
          </button>

          <button
            onClick={handleShare}
            className="p-3 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition transform hover:scale-110"
          >
            <Share2 className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={toggleMute}
            className="p-3 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition transform hover:scale-110"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Product tags */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm 
                       text-sm font-medium shadow-lg animate-fade-in cursor-pointer
                       hover:bg-white hover:scale-105 transition-all"
            >
              {product.name} - ${product.price}
            </div>
          ))}
        </div>

        {/* Play/Pause overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition transform hover:scale-110 opacity-0 hover:opacity-100"
          >
            <span className="text-white text-lg font-medium">
              {isPlaying ? "Pause" : "Play"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoReel;
