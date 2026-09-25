import pool from '../config/db.js';

/**
 * Get all tour packages (Public)
 * GET /api/packages
 */
export const getAllPackages = async (req, res) => {
  try {
    const { featured, limit } = req.query;

    let query = 'SELECT * FROM packages WHERE is_active = TRUE';
    const queryParams = [];

    if (featured === 'true') {
      query += ' AND is_featured = TRUE';
    }

    query += ' ORDER BY created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      queryParams.push(parseInt(limit, 10));
    }

    const [packages] = await pool.query(query, queryParams);

    // Parse highlights & includes if they are strings
    const formattedPackages = packages.map(pkg => ({
      ...pkg,
      highlights: typeof pkg.highlights === 'string' ? JSON.parse(pkg.highlights || '[]') : (pkg.highlights || []),
      includes: typeof pkg.includes === 'string' ? JSON.parse(pkg.includes || '[]') : (pkg.includes || [])
    }));

    return res.status(200).json({
      success: true,
      count: formattedPackages.length,
      packages: formattedPackages
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving tour packages.'
    });
  }
};

/**
 * Get single package details by ID (Public)
 * GET /api/packages/:id
 */
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query('SELECT * FROM packages WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tour package not found.'
      });
    }

    const pkg = rows[0];

    // Fetch pricing tiers
    const [pricing] = await pool.query(
      'SELECT id, pkg_tier as pkg, from_date as `from`, to_date as `to`, price FROM package_pricing WHERE package_id = ? ORDER BY id ASC',
      [id]
    );

    // Fetch gallery images
    const [galleryRows] = await pool.query(
      'SELECT image_url FROM package_gallery WHERE package_id = ? ORDER BY sort_order ASC, id ASC',
      [id]
    );

    const galleryImages = galleryRows.map(g => g.image_url);

    const fullPackage = {
      ...pkg,
      highlights: typeof pkg.highlights === 'string' ? JSON.parse(pkg.highlights || '[]') : (pkg.highlights || []),
      includes: typeof pkg.includes === 'string' ? JSON.parse(pkg.includes || '[]') : (pkg.includes || []),
      galleryImages: galleryImages.length > 0 ? galleryImages : [pkg.main_image],
      pricing: pricing
    };

    return res.status(200).json({
      success: true,
      package: fullPackage
    });
  } catch (error) {
    console.error('Error fetching package details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving package details.'
    });
  }
};

/**
 * Create a new tour package (Admin only)
 * POST /api/packages
 */
export const createPackage = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      title,
      price_range,
      season,
      nights,
      location,
      main_image,
      description,
      highlights,
      includes,
      map_src,
      is_featured,
      pricing,
      gallery
    } = req.body;

    if (!title || !price_range) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Package Title and Price Range are required.'
      });
    }

    const highlightsJson = JSON.stringify(Array.isArray(highlights) ? highlights : (highlights ? [highlights] : []));
    const includesJson = JSON.stringify(Array.isArray(includes) ? includes : (includes ? [includes] : []));

    const [pkgResult] = await connection.query(
      `INSERT INTO packages (title, price_range, season, nights, location, main_image, description, highlights, includes, map_src, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        price_range.trim(),
        season || 'All Year',
        nights || '5 Nights / 6 Days',
        location || 'India',
        main_image || '/assets/images/kerala.jpg',
        description || '',
        highlightsJson,
        includesJson,
        map_src || '',
        is_featured === true || is_featured === 'true' || is_featured === 1,
        true
      ]
    );

    const newPackageId = pkgResult.insertId;

    // Insert pricing tiers if provided
    if (Array.isArray(pricing) && pricing.length > 0) {
      for (const tier of pricing) {
        if (tier.pkg_tier || tier.pkg) {
          await connection.query(
            `INSERT INTO package_pricing (package_id, pkg_tier, from_date, to_date, price) VALUES (?, ?, ?, ?, ?)`,
            [
              newPackageId,
              tier.pkg_tier || tier.pkg || 'Standard',
              tier.from_date || tier.from || 'All Year',
              tier.to_date || tier.to || 'All Year',
              tier.price || price_range
            ]
          );
        }
      }
    } else {
      // Default pricing tier
      await connection.query(
        `INSERT INTO package_pricing (package_id, pkg_tier, from_date, to_date, price) VALUES (?, ?, ?, ?, ?)`,
        [newPackageId, 'Standard Tier', 'Jan 1', 'Dec 31', price_range]
      );
    }

    // Insert gallery images if provided
    if (Array.isArray(gallery) && gallery.length > 0) {
      for (let i = 0; i < gallery.length; i++) {
        if (gallery[i]) {
          await connection.query(
            `INSERT INTO package_gallery (package_id, image_url, sort_order) VALUES (?, ?, ?)`,
            [newPackageId, gallery[i], i]
          );
        }
      }
    } else if (main_image) {
      await connection.query(
        `INSERT INTO package_gallery (package_id, image_url, sort_order) VALUES (?, ?, ?)`,
        [newPackageId, main_image, 0]
      );
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Package created successfully and saved to database.',
      packageId: newPackageId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating package:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating package.'
    });
  } finally {
    connection.release();
  }
};

/**
 * Update a tour package (Admin only)
 * PUT /api/packages/:id
 */
export const updatePackage = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const {
      title,
      price_range,
      season,
      nights,
      location,
      main_image,
      description,
      highlights,
      includes,
      map_src,
      is_featured,
      is_active,
      pricing,
      gallery
    } = req.body;

    const highlightsJson = JSON.stringify(Array.isArray(highlights) ? highlights : (highlights ? [highlights] : []));
    const includesJson = JSON.stringify(Array.isArray(includes) ? includes : (includes ? [includes] : []));

    await connection.query(
      `UPDATE packages SET 
        title = ?, 
        price_range = ?, 
        season = ?, 
        nights = ?, 
        location = ?, 
        main_image = ?, 
        description = ?, 
        highlights = ?, 
        includes = ?, 
        map_src = ?, 
        is_featured = ?,
        is_active = ?
       WHERE id = ?`,
      [
        title,
        price_range,
        season,
        nights,
        location,
        main_image,
        description,
        highlightsJson,
        includesJson,
        map_src,
        is_featured === true || is_featured === 'true' || is_featured === 1,
        is_active !== undefined ? (is_active === true || is_active === 1) : true,
        id
      ]
    );

    // Replace pricing tiers if provided
    if (Array.isArray(pricing)) {
      await connection.query('DELETE FROM package_pricing WHERE package_id = ?', [id]);
      for (const tier of pricing) {
        if (tier.pkg_tier || tier.pkg) {
          await connection.query(
            `INSERT INTO package_pricing (package_id, pkg_tier, from_date, to_date, price) VALUES (?, ?, ?, ?, ?)`,
            [
              id,
              tier.pkg_tier || tier.pkg || 'Standard',
              tier.from_date || tier.from || 'All Year',
              tier.to_date || tier.to || 'All Year',
              tier.price || price_range
            ]
          );
        }
      }
    }

    // Replace gallery images if provided
    if (Array.isArray(gallery)) {
      await connection.query('DELETE FROM package_gallery WHERE package_id = ?', [id]);
      for (let i = 0; i < gallery.length; i++) {
        if (gallery[i]) {
          await connection.query(
            `INSERT INTO package_gallery (package_id, image_url, sort_order) VALUES (?, ?, ?)`,
            [id, gallery[i], i]
          );
        }
      }
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'Package updated successfully in database.'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating package:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating package.'
    });
  } finally {
    connection.release();
  }
};

/**
 * Delete a tour package (Admin only)
 * DELETE /api/packages/:id
 */
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM packages WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Package deleted successfully from database.'
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting package.'
    });
  }
};
