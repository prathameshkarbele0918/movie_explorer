"use client";

import { Play } from "lucide-react";
import { useState } from "react";

interface TrailerCardProps {
  title: string;
  youtubeKey: string;
}

const TrailerCard = ({ title, youtubeKey }: TrailerCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeKey}/maxresdefault.jpg`;

  if (isPlaying) {
    return (
      <div className="aspect-video overflow-hidden rounded-lg">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className="group cursor-pointer"
      onClick={() => setIsPlaying(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setIsPlaying(true);
        }
      }}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <img
          src={thumbnailUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://img.youtube.com/vi/${youtubeKey}/hqdefault.jpg`;
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 transition-colors group-hover:bg-background/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Play className="h-5 w-5 ml-0.5" />
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-card-foreground">{title}</p>
    </div>
  );
};

export default TrailerCard;
