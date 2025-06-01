import React, { useState, useEffect } from 'react';
import './News.css';

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { id: 'all', name: 'All', color: 'bg-blue-500' },
    { id: 'technology', name: 'Technology', color: 'bg-purple-500' },
    { id: 'business', name: 'Business', color: 'bg-green-500' },
    { id: 'sports', name: 'Sports', color: 'bg-orange-500' },
    { id: 'health', name: 'Health', color: 'bg-red-500' },
    { id: 'entertainment', name: 'Entertainment', color: 'bg-teal-500' }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news?page=${currentPage}&limit=10`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        
        // Validate that data has the expected structure
        if (!data.news || !Array.isArray(data.news)) {
          throw new Error('Invalid data format received from server');
        }
        
        setNewsData(data.news);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  // Filter news by category and search
  const filteredNews = Array.isArray(newsData) ? newsData.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }) : [];

  const featuredNews = Array.isArray(newsData) ? newsData.filter(article => article.featured) : [];
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

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
              <div key={article._id} className="news-card featured">
                <img src={article.image} alt={article.title} />
                <div className="news-content">
                  <span className={`category-tag ${getCategoryColor(article.category)}`}>
                    {categories.find(c => c.id === article.category)?.name}
                  </span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="news-meta">
                    <span>{article.author}</span>
                    <span>{new Date(article.publishTime).toLocaleDateString()}</span>
                    <span>{article.views} views</span>
                  </div>
                  <button 
                    className={`like-button ${likedArticles.has(article._id) ? 'liked' : ''}`}
                    onClick={() => handleLike(article._id)}
                  >
                    {likedArticles.has(article._id) ? '❤️' : '🤍'}
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
            <div key={article._id} className="news-card">
              <img src={article.image} alt={article.title} />
              <div className="news-content">
                <span className={`category-tag ${getCategoryColor(article.category)}`}>
                  {categories.find(c => c.id === article.category)?.name}
                </span>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="news-meta">
                  <span>{article.author}</span>
                  <span>{new Date(article.publishTime).toLocaleDateString()}</span>
                  <span>{article.views} views</span>
                </div>
                <button 
                  className={`like-button ${likedArticles.has(article._id) ? 'liked' : ''}`}
                  onClick={() => handleLike(article._id)}
                >
                  {likedArticles.has(article._id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default News; 