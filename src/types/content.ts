// Locked content types for saadanddanial.com — data-driven, type-safe updates

export interface Program {
  id: number;
  category: 'masters' | 'bachelors' | 'ausbildung' | 'engineering';
  level: string;
  title: string;
  unis: string;
  duration: string;
  cost: string;
  highlight: string;
}

export interface Video {
  id: string;
  videoId: string;
  title: string;
  duration: string;
  views: string;
  meta?: string;
  ytUrl: string;
}

export interface Testimonial {
  id: string;
  initials: string;
  name: string;
  route: string;
  quote: string;
  tag: string;
  hasVideo?: boolean;
  videoId?: string;
  videoTitle?: string;
  videoUrl?: string;
}