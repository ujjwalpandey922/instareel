import React, { useRef, useEffect, useState } from "react";
import { Heart, Share2, Volume2, VolumeX, Play, Pause } from "lucide-react";
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

const VideoReel: React.FC<VideoReelProps> = ({
  videoUrl,
  products,
  isVisible,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isVisible && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Playback error:", error);
          videoRef.current.muted = true;
          setIsMuted(true);
          try {
            await videoRef.current.play();
            setIsPlaying(true);
          } catch (retryError) {
            console.log("Retry failed:", retryError);
          }
        }
      };

      playVideo();
    } else if (!isVisible && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isVisible]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const seekVideo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress((newTime / videoRef.current.duration) * 100);
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
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={videoUrl}
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        onTimeUpdate={handleProgress}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 flex flex-col justify-between p-4 sm:p-6 md:p-8">
        {/* Clickable progress bar */}
        <div
          className="absolute bottom-0 left-0 w-full h-2 bg-gray-800/50 cursor-pointer"
          onClick={seekVideo}
        >
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 right-4 flex flex-col items-end gap-4 sm:gap-3 md:gap-4">
          <button
            onClick={toggleLike}
            className="p-3 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition transform hover:scale-110"
          >
            <Heart
              className={cn(
                "w-6 h-6",
                isLiked ? "text-red-500 fill-red-500" : "text-white"
              )}
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

        {/* Product Tags */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 sm:gap-1 md:gap-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium shadow-lg animate-fade-in cursor-pointer hover:bg-white hover:scale-105 transition-all"
            >
              {product.name} - ${product.price}
            </div>
          ))}
        </div>

        {/* Play/Pause Overlay */}
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:p-3 md:p-4">
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition transform hover:scale-110 opacity-0 hover:opacity-100"
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 text-white" />
            ) : (
              <Play className="w-10 h-10 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoReel;
