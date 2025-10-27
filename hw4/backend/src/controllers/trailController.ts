import { Request, Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import { dbRun, dbGet, dbAll } from '../utils/initDatabase';
import { CreateTrailRequest, UpdateTrailRequest, Trail, TrailCoordinate } from '../types';
import { createError } from '../middleware/errorHandler';

// Validation rules
export const createTrailValidation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Trail name must be between 1 and 100 characters'),
  body('description')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard', 'expert'])
    .withMessage('Difficulty must be one of: easy, medium, hard, expert'),
  body('distance')
    .isFloat({ min: 0.1, max: 1000 })
    .withMessage('Distance must be between 0.1 and 1000 kilometers'),
  body('duration')
    .isInt({ min: 1, max: 1440 })
    .withMessage('Duration must be between 1 and 1440 minutes'),
  body('elevation_gain')
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Elevation gain must be between 0 and 10000 meters'),
  body('coordinates')
    .isArray({ min: 0 })
    .withMessage('Coordinates must be an array'),
  body('coordinates.*.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('coordinates.*.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('start_location')
    .isLength({ min: 1, max: 200 })
    .withMessage('Start location must be between 1 and 200 characters'),
  body('end_location')
    .isLength({ min: 1, max: 200 })
    .withMessage('End location must be between 1 and 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

export const updateTrailValidation = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Trail name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'expert'])
    .withMessage('Difficulty must be one of: easy, medium, hard, expert'),
  body('distance')
    .optional()
    .isFloat({ min: 0.1, max: 1000 })
    .withMessage('Distance must be between 0.1 and 1000 kilometers'),
  body('duration')
    .optional()
    .isInt({ min: 1, max: 1440 })
    .withMessage('Duration must be between 1 and 1440 minutes'),
  body('elevation_gain')
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Elevation gain must be between 0 and 10000 meters'),
  body('coordinates')
    .optional()
    .isArray({ min: 2 })
    .withMessage('Coordinates must be an array with at least 2 points'),
  body('start_location')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Start location must be between 1 and 200 characters'),
  body('end_location')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('End location must be between 1 and 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

export const getTrails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      difficulty, 
      min_distance, 
      max_distance,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build query conditions
    let whereConditions = [];
    let queryParams: any[] = [];

    if (difficulty) {
      whereConditions.push('difficulty = ?');
      queryParams.push(difficulty);
    }

    if (min_distance) {
      whereConditions.push('distance >= ?');
      queryParams.push(parseFloat(min_distance as string));
    }

    if (max_distance) {
      whereConditions.push('distance <= ?');
      queryParams.push(parseFloat(max_distance as string));
    }

    if (search) {
      whereConditions.push('(name LIKE ? OR description LIKE ? OR start_location LIKE ? OR end_location LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Validate sort parameters
    const allowedSortFields = ['name', 'distance', 'duration', 'rating', 'created_at', 'updated_at'];
    const sortField = allowedSortFields.includes(sort_by as string) ? sort_by : 'created_at';
    const sortDirection = sort_order === 'asc' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM trails ${whereClause}`;
    const countResult = await dbGet(countQuery, queryParams) as { total: number };

    // Get trails
    const trailsQuery = `
      SELECT 
        t.*,
        u.username as author_username
      FROM trails t
      LEFT JOIN users u ON t.user_id = u.id
      ${whereClause}
      ORDER BY t.${sortField} ${sortDirection}
      LIMIT ? OFFSET ?
    `;

    const trails = await dbAll(trailsQuery, [...queryParams, limitNum, offset]) as Trail[];

    // Parse JSON fields
    const parsedTrails = trails.map(trail => ({
      ...trail,
      coordinates: JSON.parse(trail.coordinates),
      tags: JSON.parse(trail.tags)
    }));

    res.json({
      success: true,
      data: {
        trails: parsedTrails,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get trails error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trails'
    });
  }
};

export const getTrailById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const trail = await dbGet(`
      SELECT 
        t.*,
        u.username as author_username
      FROM trails t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [id]) as Trail;

    if (!trail) {
      res.status(404).json({
        success: false,
        error: 'Trail not found'
      });
      return;
    }

    // Parse JSON fields
    const parsedTrail = {
      ...trail,
      coordinates: JSON.parse(trail.coordinates),
      tags: JSON.parse(trail.tags)
    };

    res.json({
      success: true,
      data: parsedTrail
    });
  } catch (error) {
    console.error('Get trail by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trail'
    });
  }
};

export const createTrail = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const trailData: CreateTrailRequest = req.body;
    
    // Use user ID if authenticated, otherwise use null for anonymous users
    const userId = req.user ? req.user.id : null;

    // Insert trail
    const result = await dbRun(`
      INSERT INTO trails (
        name, description, difficulty, distance, duration, elevation_gain,
        coordinates, start_location, end_location, tags, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      trailData.name,
      trailData.description || '',
      trailData.difficulty,
      trailData.distance,
      trailData.duration,
      trailData.elevation_gain,
      JSON.stringify(trailData.coordinates),
      trailData.start_location,
      trailData.end_location,
      JSON.stringify(trailData.tags || []),
      userId
    ]);

    const trailId = (result as any).lastID;

    // Get created trail
    const newTrail = await dbGet(`
      SELECT 
        t.*,
        u.username as author_username
      FROM trails t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [trailId]) as Trail;

    const parsedTrail = {
      ...newTrail,
      coordinates: JSON.parse(newTrail.coordinates),
      tags: JSON.parse(newTrail.tags)
    };

    res.status(201).json({
      success: true,
      data: parsedTrail,
      message: 'Trail created successfully'
    });
  } catch (error) {
    console.error('Create trail error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create trail'
    });
  }
};

export const updateTrail = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;
    const updateData: Partial<CreateTrailRequest> = req.body;

    // Check if trail exists and user owns it
    const existingTrail = await dbGet(
      'SELECT * FROM trails WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    ) as Trail;

    if (!existingTrail) {
      res.status(404).json({
        success: false,
        error: 'Trail not found or you do not have permission to update it'
      });
      return;
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (updateData.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(updateData.name);
    }
    if (updateData.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(updateData.description);
    }
    if (updateData.difficulty !== undefined) {
      updateFields.push('difficulty = ?');
      updateValues.push(updateData.difficulty);
    }
    if (updateData.distance !== undefined) {
      updateFields.push('distance = ?');
      updateValues.push(updateData.distance);
    }
    if (updateData.duration !== undefined) {
      updateFields.push('duration = ?');
      updateValues.push(updateData.duration);
    }
    if (updateData.elevation_gain !== undefined) {
      updateFields.push('elevation_gain = ?');
      updateValues.push(updateData.elevation_gain);
    }
    if (updateData.coordinates !== undefined) {
      updateFields.push('coordinates = ?');
      updateValues.push(JSON.stringify(updateData.coordinates));
    }
    if (updateData.start_location !== undefined) {
      updateFields.push('start_location = ?');
      updateValues.push(updateData.start_location);
    }
    if (updateData.end_location !== undefined) {
      updateFields.push('end_location = ?');
      updateValues.push(updateData.end_location);
    }
    if (updateData.tags !== undefined) {
      updateFields.push('tags = ?');
      updateValues.push(JSON.stringify(updateData.tags));
    }

    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
      return;
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    await dbRun(
      `UPDATE trails SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated trail
    const updatedTrail = await dbGet(`
      SELECT 
        t.*,
        u.username as author_username
      FROM trails t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [id]) as Trail;

    const parsedTrail = {
      ...updatedTrail,
      coordinates: JSON.parse(updatedTrail.coordinates),
      tags: JSON.parse(updatedTrail.tags)
    };

    res.json({
      success: true,
      data: parsedTrail,
      message: 'Trail updated successfully'
    });
  } catch (error) {
    console.error('Update trail error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update trail'
    });
  }
};

export const deleteTrail = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;

    // Check if trail exists and user owns it
    const existingTrail = await dbGet(
      'SELECT * FROM trails WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    ) as Trail;

    if (!existingTrail) {
      res.status(404).json({
        success: false,
        error: 'Trail not found or you do not have permission to delete it'
      });
      return;
    }

    await dbRun('DELETE FROM trails WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Trail deleted successfully'
    });
  } catch (error) {
    console.error('Delete trail error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete trail'
    });
  }
};


