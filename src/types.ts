export interface PracticeArea {
  id: string;
  number: string;
  title: string;
  summary: string;
  fullContent: string;
  iconName: string;
}

export interface ValueItem {
  id: string;
  number: string;
  title: string;
  summary: string;
  fullContent: string;
  subtitle: string;
  iconName?: string;
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  category: 'partner' | 'associate';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  span: string;
}
