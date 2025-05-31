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
    const skip = (page - 1) * limit;

    const news = await News.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name color')
      .populate('author', 'name avatar');

    const total = await News.countDocuments();

    res.json({
      news,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNews: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
      return res.status(404).json({ msg: 'News article not found' });
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.json(news);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'News article not found' });
    }
    res.status(500).send('Server Error');
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

    await news.save();
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/news/:id
// @desc    Update a news article
// @access  Private (Author/Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ msg: 'News article not found' });
    }

    // Check if user is the author or admin
    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { title, excerpt, content, category, image, featured } = req.body;

    // Update fields
    if (title) news.title = title;
    if (excerpt) news.excerpt = excerpt;
    if (content) news.content = content;
    if (category) news.category = category;
    if (image) news.image = image;
    if (featured !== undefined) news.featured = featured;

    await news.save();
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/news/:id
// @desc    Delete a news article
// @access  Private (Author/Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ msg: 'News article not found' });
    }

    // Check if user is the author or admin
    if (news.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await news.remove();
    res.json({ msg: 'News article removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/news/like/:id
// @desc    Like/Unlike a news article
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ msg: 'News article not found' });
    }

    // Check if the article has already been liked by this user
    const likeIndex = news.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      // Unlike
      news.likes.splice(likeIndex, 1);
    } else {
      // Like
      news.likes.push(req.user.id);
    }

    await news.save();
    res.json(news.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/news/comment/:id
// @desc    Comment on a news article
// @access  Private
router.post('/comment/:id', [
  auth,
  [
    check('text', 'Text is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ msg: 'News article not found' });
    }

    const newComment = {
      text: req.body.text,
      user: req.user.id
    };

    news.comments.unshift(newComment);
    await news.save();
    res.json(news.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 