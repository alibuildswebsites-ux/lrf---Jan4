import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  // Calculate reading time: ~200 wpm
  const wordCount = post.content.replace(/<[^>]+>/g, '').split(' ').length;
  const readTime = Math.ceil(wordCount / 200);

  // Format date
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Create excerpt
  const excerpt = post.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-brand-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
            {post.category}
          </span>
        </div>
        <img 
          src={post.featuredImage || getOptimizedImageUrl('https://images.unsplash.com/photo-1560518883-ce09059eeffa', 600)} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 font-medium">
          <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {readTime} min read</span>
        </div>

        <h3 className="text-xl font-bold text-charcoal mb-3 group-hover:text-brand transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
          {excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="bg-gray-50 text-gray-500 px-2 py-1 rounded-md text-xs font-medium">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-brand font-bold text-sm mt-auto group/btn">
          Read Article <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};