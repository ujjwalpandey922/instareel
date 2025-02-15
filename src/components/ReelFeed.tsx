
import React, { useRef, useEffect, useState } from "react";
import VideoReel from "./VideoReel";

// Sample data with valid video URLs
const SAMPLE_VIDEOS = [
  {
    id: "1",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    products: [
      {
        id: "p1",
        name: "Premium Collection",
        price: 129.99,
        description: "Limited edition set",
      },
    ],
  },
  {
    id: "2",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    products: [
      {
        id: "p2",
        name: "Designer Special",
        price: 299.99,
        description: "Luxury collection",
      },
    ],
  },
  {
    id: "3",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    products: [
      {
        id: "p3",
        name: "Featured Items",
        price: 399.99,
        description: "Premium selection",
      },
    ],
  },
];

const ReelFeed: React.FC = () => {
  const [visibleVideoIndex, setVisibleVideoIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (feedRef.current) {
        const { scrollTop, clientHeight } = feedRef.current;
        const newIndex = Math.round(scrollTop / clientHeight);
        setVisibleVideoIndex(newIndex);
      }
    };

    const feedElement = feedRef.current;
    if (feedElement) {
      feedElement.addEventListener("scroll", handleScroll);
      return () => feedElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div
      ref={feedRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {SAMPLE_VIDEOS.map((video, index) => (
        <div key={video.id} className="h-screen snap-start">
          <VideoReel
            videoUrl={video.videoUrl}
            products={video.products}
            isVisible={index === visibleVideoIndex}
          />
        </div>
      ))}
    </div>
  );
};

export default ReelFeed;
