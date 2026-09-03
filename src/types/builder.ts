export type GenreType = 
  | 'shop_business' 
  | 'personal_bio' 
  | 'portfolio' 
  | 'blog_column' 
  | 'event_notice' 
  | 'scratch';

export type BlockType = 
  | 'heading' 
  | 'text' 
  | 'image' 
  | 'button'
  | 'card_grid'
  | 'contact_form'
  | 'access_map'
  | 'divider';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  text: string;
  subtext?: string;
  align: 'left' | 'center' | 'right';
  badge?: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  text: string;
  align: 'left' | 'center' | 'right';
  size: 'sm' | 'base' | 'lg' | 'lead';
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  align: 'left' | 'center' | 'right';
  maxWidth: 'small' | 'medium' | 'large' | 'full';
  rounded: boolean;
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  label: string;
  link: string; // URL or page-slug (e.g. "contact.html" or "https://...")
  variant: 'primary' | 'secondary' | 'outline';
  align: 'left' | 'center' | 'right';
  newTab?: boolean;
}

export interface CardItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  priceOrDate?: string;
  tag?: string;
}

export interface CardGridBlock extends BaseBlock {
  type: 'card_grid';
  columns: 2 | 3 | 4;
  items: CardItem[];
}

export interface ContactFormBlock extends BaseBlock {
  type: 'contact_form';
  title: string;
  description: string;
  buttonLabel: string;
  fields: { id: string; label: string; type: 'text' | 'email' | 'textarea'; required: boolean }[];
}

export interface AccessMapBlock extends BaseBlock {
  type: 'access_map';
  title: string;
  address: string;
  accessInfo: string;
  businessHours: string;
  phone: string;
  mapEmbedQuery?: string;
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  style: 'solid' | 'dashed' | 'dots' | 'space';
}

export type BlockData = 
  | HeadingBlock 
  | TextBlock 
  | ImageBlock 
  | ButtonBlock 
  | CardGridBlock 
  | ContactFormBlock 
  | AccessMapBlock 
  | DividerBlock;

export interface PageData {
  id: string;
  name: string; // e.g. "トップ", "メニュー・商品"
  slug: string; // e.g. "index", "menu", "access", "contact"
  description?: string;
  blocks: BlockData[];
}

export type BackgroundType = 'template_default' | 'image' | 'video';

export interface BackgroundConfig {
  type: BackgroundType;
  src?: string; // image URL or data URI
  preset_id?: string; // e.g. "video_waves", "video_nature", "video_particles"
  overlayOpacity?: number; // 0 to 80%
  color?: string; // solid or gradient background
}

export interface SiteTheme {
  primaryColor: string; // Hex e.g. "#2563eb"
  accentColor: string;
  fontFamily: 'sans' | 'serif' | 'rounded';
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  uploadedAt: string;
}

export interface SiteData {
  site_id: string;
  name: string;
  genre: GenreType;
  theme: SiteTheme;
  pages: PageData[];
  background: BackgroundConfig;
  images: UploadedImage[];
  updatedAt: string;
}

export interface VideoPreset {
  id: string;
  name: string;
  category: '自然・海' | '都市・カフェ' | '幾何学・テクノロジー' | 'グラデーションアニメーション';
  description: string;
  videoUrl: string;
  fallbackImageUrl: string;
  thumbnailUrl: string;
  duration: string; // "7s loop"
  fileSize: string; // "1.8MB"
}

export interface UserSession {
  email: string;
  token: string;
  expiresAt: number; // timestamp
}
