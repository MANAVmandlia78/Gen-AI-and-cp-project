import pool from '../config/db.js';

/**
 * Get all blogs (Public & Admin)
 * GET /api/blogs
 * Optional query params:
 *   - search: string to match title or summary
 *   - published: 'true' | 'false' | 'all' (default 'true' for non-admin requests)
 *   - limit: number
 */
export const getAllBlogs = async (req, res) => {
  try {
    const { search, limit, all } = req.query;

    let query = 'SELECT * FROM blogs';
    const queryParams = [];
    const conditions = [];

    // Unless 'all=true' is explicitly passed (e.g. from admin), show only published blogs
    if (all !== 'true') {
      conditions.push('is_published = TRUE');
    }

    if (search && search.trim() !== '') {
      conditions.push('(title LIKE ? OR summary LIKE ? OR content LIKE ? OR author LIKE ?)');
      const term = `%${search.trim()}%`;
      queryParams.push(term, term, term, term);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      queryParams.push(parseInt(limit, 10));
    }

    const [blogs] = await pool.query(query, queryParams);

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving blogs.'
    });
  }
};

/**
 * Get single blog by ID or Slug (Public)
 * GET /api/blogs/:id
 */
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if numeric ID or slug string
    const isNumeric = /^\d+$/.test(id);
    const query = isNumeric
      ? 'SELECT * FROM blogs WHERE id = ?'
      : 'SELECT * FROM blogs WHERE slug = ?';

    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    const blog = rows[0];

    // Increment views count asynchronously
    pool.query('UPDATE blogs SET views_count = views_count + 1 WHERE id = ?', [blog.id])
      .catch(err => console.error('Failed to increment blog views:', err));

    return res.status(200).json({
      success: true,
      blog: {
        ...blog,
        views_count: (blog.views_count || 0) + 1
      }
    });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving blog post.'
    });
  }
};

/**
 * Create a new blog post (Admin Only)
 * POST /api/blogs
 */
export const createBlog = async (req, res) => {
  try {
    const { title, slug, image, author, summary, content, is_published } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Blog title is required.'
      });
    }

    // Auto-generate slug if not provided
    const cleanSlug = slug && slug.trim() !== ''
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const blogAuthor = author && author.trim() !== '' ? author.trim() : (req.user?.name || 'Maharaja Tours');
    const blogImage = image && image.trim() !== '' ? image.trim() : '/assets/images/kerala.jpg';
    const blogSummary = summary && summary.trim() !== '' ? summary.trim() : '';
    const blogContent = content && content.trim() !== '' ? content.trim() : '';
    const publishedFlag = is_published === false || is_published === 0 || is_published === 'false' ? 0 : 1;

    const [result] = await pool.query(
      `INSERT INTO blogs (title, slug, image, author, summary, content, views_count, is_published)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
      [title.trim(), cleanSlug, blogImage, blogAuthor, blogSummary, blogContent, publishedFlag]
    );

    const [newRows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully!',
      blog: newRows[0]
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating blog post.'
    });
  }
};

/**
 * Update an existing blog post (Admin Only)
 * PUT /api/blogs/:id
 */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, image, author, summary, content, is_published } = req.body;

    const [existing] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    const currentBlog = existing[0];
    const newTitle = title !== undefined ? title.trim() : currentBlog.title;
    
    let newSlug = currentBlog.slug;
    if (slug !== undefined && slug.trim() !== '') {
      newSlug = slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    } else if (title && title.trim() !== currentBlog.title) {
      newSlug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const newImage = image !== undefined ? image.trim() : currentBlog.image;
    const newAuthor = author !== undefined ? author.trim() : currentBlog.author;
    const newSummary = summary !== undefined ? summary.trim() : currentBlog.summary;
    const newContent = content !== undefined ? content.trim() : currentBlog.content;
    const newPublished = is_published !== undefined
      ? (is_published === true || is_published === 1 || is_published === 'true' ? 1 : 0)
      : currentBlog.is_published;

    await pool.query(
      `UPDATE blogs
       SET title = ?, slug = ?, image = ?, author = ?, summary = ?, content = ?, is_published = ?
       WHERE id = ?`,
      [newTitle, newSlug, newImage, newAuthor, newSummary, newContent, newPublished, id]
    );

    const [updatedRows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully!',
      blog: updatedRows[0]
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating blog post.'
    });
  }
};

/**
 * Delete a blog post (Admin Only)
 * DELETE /api/blogs/:id
 */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM blogs WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting blog post.'
    });
  }
};
