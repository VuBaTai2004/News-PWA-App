import React, { useState } from 'react';
import './News.css';

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [likedArticles, setLikedArticles] = useState(new Set());

  // Sample news data
  const newsData = [
    {
      id: 1,
      title: "New AI Breakthrough in 2024",
      excerpt: "Revolutionary advances in artificial intelligence are changing how we live and work...",
      category: "technology",
      author: "John Smith",
      publishTime: "2 hours ago",
      readTime: "5 min read",
      views: 1250,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "Global Markets Show Strong Growth",
      excerpt: "Major stock markets worldwide reach new heights with record trading volumes...",
      category: "business",
      author: "Sarah Johnson",
      publishTime: "4 hours ago",
      readTime: "3 min read",
      views: 890,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Sports Championship Finals Set",
      excerpt: "Top teams prepare for the biggest championship match of the season...",
      category: "sports",
      author: "Mike Wilson",
      publishTime: "6 hours ago",
      readTime: "4 min read",
      views: 2100,
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop"
    }
  ];

  const categories = [
    { id: 'all', name: 'All', color: 'bg-blue-500' },
    { id: 'technology', name: 'Technology', color: 'bg-purple-500' },
    { id: 'business', name: 'Business', color: 'bg-green-500' },
    { id: 'sports', name: 'Sports', color: 'bg-orange-500' },
    { id: 'health', name: 'Health', color: 'bg-red-500' },
    { id: 'entertainment', name: 'Entertainment', color: 'bg-teal-500' }
  ];

  // Filter news by category and search
  const filteredNews = newsData.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = newsData.filter(article => article.featured);
  const regularNews = filteredNews.filter(article => !article.featured);

  const handleLike = (articleId) => {
    const newLikedArticles = new Set(likedArticles);
    if (newLikedArticles.has(articleId)) {
      newLikedArticles.delete(articleId);
    } else {
      newLikedArticles.add(articleId);
    }
    setLikedArticles(newLikedArticles);
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-500';
  };

  return (
    <div className="news-container">
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search news..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="categories-container">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Featured News */}
      {selectedCategory === 'all' && featuredNews.length > 0 && (
        <div className="featured-news">
          <h2>Featured News</h2>
          <div className="featured-grid">
            {featuredNews.map(article => (
              <div key={article.id} className="news-card featured">
                <img src={article.image} alt={article.title} />
                <div className="news-content">
                  <span className={`category-tag ${getCategoryColor(article.category)}`}>
                    {categories.find(c => c.id === article.category)?.name}
                  </span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="news-meta">
                    <span>{article.author}</span>
                    <span>{article.publishTime}</span>
                    <span>{article.views} views</span>
                  </div>
                  <button 
                    className={`like-button ${likedArticles.has(article.id) ? 'liked' : ''}`}
                    onClick={() => handleLike(article.id)}
                  >
                    {likedArticles.has(article.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular News */}
      <div className="regular-news">
        <h2>Latest News</h2>
        <div className="news-grid">
          {regularNews.map(article => (
            <div key={article.id} className="news-card">
              <img src={article.image} alt={article.title} />
              <div className="news-content">
                <span className={`category-tag ${getCategoryColor(article.category)}`}>
                  {categories.find(c => c.id === article.category)?.name}
                </span>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="news-meta">
                  <span>{article.author}</span>
                  <span>{article.publishTime}</span>
                  <span>{article.views} views</span>
                </div>
                <button 
                  className={`like-button ${likedArticles.has(article.id) ? 'liked' : ''}`}
                  onClick={() => handleLike(article.id)}
                >
                  {likedArticles.has(article.id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News; 