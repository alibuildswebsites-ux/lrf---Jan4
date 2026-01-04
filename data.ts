import { Home, Star, Award, Clock, Key, TrendingUp, PiggyBank, Target, Users, MapPin } from 'lucide-react';
import { LocationArea, Stat } from './types';

export const LOCATIONS: LocationArea[] = [
  { 
    id: '1', 
    name: 'Houston, TX', 
    description: 'Urban luxury & high-rises', 
    longDescription: 'Houston, Texas offers a diverse mix of established neighborhoods, new construction homes, and thriving job centers, making it a great choice for buyers looking for long-term value in the Greater Houston area. From downtown lofts to suburban estates, explore real estate in America’s fourth-largest city.',
    image: 'https://images.unsplash.com/photo-1582457601550-9f5068422739?auto=format&fit=crop&w=800&q=80',
    propertyCount: 142,
    pattern: 'grid',
    stats: { label: 'Avg. DOM', value: '14 Days', trend: 'up' }
  },
  { 
    id: '2', 
    name: 'Galveston, TX', 
    description: 'Coastal living specialists', 
    longDescription: 'Galveston, Texas combines coastal living, historic architecture, and strong short-term rental potential, ideal for both full-time residents and investors seeking beach properties. Discover charming Victorian homes and modern waterfront condos along the Gulf Coast.',
    image: 'https://images.unsplash.com/photo-1621532936750-4824b077a284?auto=format&fit=crop&w=800&q=80',
    propertyCount: 38,
    pattern: 'waves',
    stats: { label: 'Active Listings', value: '245', trend: 'neutral' }
  },
  { 
    id: '3', 
    name: 'Austin, TX', 
    description: 'Tech hub & hill country', 
    longDescription: 'Austin, Texas is a vibrant hub of technology and culture, offering stunning hill country views and a dynamic real estate market. Whether you are seeking a modern downtown condo or a spacious family home near top-rated schools, Austin delivers exceptional lifestyle and growth.',
    image: 'https://images.unsplash.com/photo-1531218536973-5f8bbb3760b6?auto=format&fit=crop&w=800&q=80',
    propertyCount: 56,
    pattern: 'topo',
    stats: { label: 'YoY Growth', value: '+12.4%', trend: 'up' }
  },
  { 
    id: '4', 
    name: 'Louisiana', 
    description: 'Southern charm estates', 
    longDescription: 'Experience the unique charm of Louisiana real estate, from historic French Quarter style condos to sprawling southern estates with rich history. Our team connects buyers with distinctive properties that capture the soul and culture of the Pelican State.',
    image: 'https://images.unsplash.com/photo-1571508216395-46f9063c63aa?auto=format&fit=crop&w=800&q=80',
    propertyCount: 24,
    pattern: 'grid',
    stats: { label: 'Med. Price', value: '$385k', trend: 'up' }
  },
  { 
    id: '5', 
    name: 'Mississippi', 
    description: 'Gulf coast opportunities', 
    longDescription: 'The Mississippi Gulf Coast offers affordable coastal living and lucrative investment opportunities in emerging markets. Discover hidden gems, beachfront value, and welcoming communities perfect for retirement or vacation rental portfolios.',
    image: 'https://images.unsplash.com/photo-1627393430636-6e5472aa5e1c?auto=format&fit=crop&w=800&q=80',
    propertyCount: 19,
    pattern: 'waves',
    stats: { label: 'Rental Yield', value: '8.2%', trend: 'up' }
  },
  { 
    id: '6', 
    name: 'Florida', 
    description: 'Sunshine state expansion', 
    longDescription: 'Florida real estate remains a top choice for sunshine, tax benefits, and luxury coastal living. Our select portfolio includes exclusive vacation homes and high-yield investment properties across the Sunshine State’s most desirable destinations.',
    image: 'https://images.unsplash.com/photo-1535916041692-2df27f66299d?auto=format&fit=crop&w=800&q=80',
    propertyCount: 45,
    pattern: 'waves',
    stats: { label: 'New Devs', value: '50+', trend: 'up' }
  },
];

export const STATS: Stat[] = [
  { label: 'Properties Sold', value: 500, suffix: '+', icon: Home },
  { label: 'Client Satisfaction', value: 98, suffix: '%', icon: Star },
  { label: 'Years Experience', value: 15, suffix: '+', icon: Award },
  { label: 'Availability', value: 24, suffix: '/7', icon: Clock },
];

export const SERVICES = [
  { 
    title: 'Find Your Perfect Home', 
    desc: 'Expert guidance for first-time buyers and seasoned homeowners. Access to exclusive MLS listings, personalized property matching, and support throughout the entire buying process.',
    icon: Key 
  },
  { 
    title: 'Maximize Your Sale', 
    desc: 'Strategic marketing, professional staging consultation, and expert pricing strategies to get top dollar for your property. We handle everything from listing to closing.',
    icon: TrendingUp 
  },
  { 
    title: 'Build Your Portfolio', 
    desc: 'Investment property guidance, comprehensive market analysis, and rental strategy development for long-term wealth building and passive income generation.',
    icon: PiggyBank 
  },
];

export const FEATURES = [
  { title: "24/7 Client Availability", desc: "Always here when you need us, day or night", icon: Clock },
  { title: "Expert Market Knowledge", desc: "Deep understanding of local markets and trends", icon: Target },
  { title: "Personalized Service", desc: "Tailored strategies for your unique goals", icon: Users },
  { title: "Proven Track Record", desc: "500+ successful transactions and counting", icon: Award },
  { title: "Multi-Market Expertise", desc: "Serving Texas, Louisiana, Mississippi, and Florida", icon: MapPin },
];