import { LucideIcon } from 'lucide-react';

export interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  status: 'For Sale' | 'Sold' | 'For Rent' | 'Rented' | 'New Listing' | 'Pending' | 'Price Drop';
  type: 'House' | 'Condo' | 'Apartment' | 'Townhouse' | 'Land' | 'Other';
  description: string;
  features: string[];
  tags: string[];
  images: string[];
  videos: string[];
  createdAt?: string;
  updatedAt?: string;
  lotSize?: string;
  yearBuilt?: number;
  mlsId?: string;
  location?: string;
  views?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: 'Market Updates' | 'Buyer Tips' | 'Seller Tips' | 'Investment Advice' | 'Neighborhood Guides' | 'Home Improvement' | 'Real Estate News';
  tags: string[];
  featuredImage: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  photo: string;
  bio: string;
  phone: string;
  email: string;
  yearsOfExperience: number;
  licenseNumber: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
}

export interface LocationStats {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface LocationArea {
  id: string;
  name: string;
  description: string; 
  longDescription: string; 
  image: string; 
  propertyCount: number; 
  pattern: 'grid' | 'waves' | 'topo';
  stats: LocationStats;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  savedProperties: string[];
  createdAt: string;
}