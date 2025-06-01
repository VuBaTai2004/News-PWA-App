const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const News = require('../models/News');

// @route   GET api/news
// @desc    Get all news articles with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$text = { $search: search };
    }

    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await News.countDocuments(query);

    res.json({
      news,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNews: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET api/news/featured
// @desc    Get featured news articles
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredNews = await News.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(featuredNews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET api/news/category/:category
// @desc    Get news articles by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const news = await News.find({ category: req.params.category })
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET api/news/:id
// @desc    Get news article by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('category', 'name color')
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST api/news
// @desc    Create a news article
// @access  Private (Author/Admin only)
router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('excerpt', 'Excerpt is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('image', 'Image URL is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, excerpt, content, category, image, featured } = req.body;

    const news = new News({
      title,
      excerpt,
      content,
      category,
      image,
      featured: featured || false,
      author: req.user.id
    });

    const newNews = await news.save();
    res.status(201).json(newNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT api/news/:id
// @desc    Update a news article
// @access  Private (Author/Admin only)
router.patch('/:id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Check if user is the author or admin
    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    Object.keys(req.body).forEach(key => {
      news[key] = req.body[key];
    });

    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE api/news/:id
// @desc    Delete a news article
// @access  Private (Author/Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Check if user is the author or admin
    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await news.remove();
    res.json({ message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST api/news/:id/view
// @desc    Increment views for a news article
// @access  Private
router.post('/:id/view', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.views += 1;
    await news.save();
    res.json({ views: news.views });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST api/news/:id/like
// @desc    Toggle like for a news article
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const likeIndex = news.likes.indexOf(req.user._id);
    if (likeIndex === -1) {
      news.likes.push(req.user._id);
    } else {
      news.likes.splice(likeIndex, 1);
    }

    await news.save();
    res.json({ likes: news.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST api/news/:id/comment
// @desc    Add a comment to a news article
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.comments.push({
      user: req.user._id,
      text: req.body.text
    });

    await news.save();
    res.json(news.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 