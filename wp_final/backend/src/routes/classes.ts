import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { validateBody } from '../middleware/validate';
import { authRequired, AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../utils/AppError';

const router = Router();

const classSchema = z.object({
  title: z.string().min(1),
  teacher: z.string().optional(),
  room: z.string().optional(),
  weekday: z.number().int().min(1).max(7),
  start_time: z.string().regex(/^\d{2}:\d{2}$/),
  end_time: z.string().regex(/^\d{2}:\d{2}$/)
});

router.use(authRequired);

router.get('/', (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const rows = db
    .prepare(
      'SELECT id, title, teacher, room, weekday, start_time, end_time, created_at FROM classes WHERE user_id = ? ORDER BY weekday, start_time'
    )
    .all(userId);
  return res.json(rows);
});

router.post('/', validateBody(classSchema), (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const { title, teacher, room, weekday, start_time, end_time } =
    req.body as z.infer<typeof classSchema>;

  const result = db
    .prepare(
      'INSERT INTO classes (user_id, title, teacher, room, weekday, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .run(
      userId,
      title,
      teacher ?? null,
      room ?? null,
      weekday,
      start_time,
      end_time
    );

  const id = Number(result.lastInsertRowid);
  const row = db
    .prepare(
      'SELECT id, title, teacher, room, weekday, start_time, end_time, created_at FROM classes WHERE id = ? AND user_id = ?'
    )
    .get(id, userId);

  return res.status(201).json(row);
});

router.put('/:id', validateBody(classSchema), (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new AppError(400, 'Invalid class id');
  }

  const existing = db
    .prepare('SELECT id FROM classes WHERE id = ? AND user_id = ?')
    .get(id, userId);
  if (!existing) {
    throw new AppError(404, 'Class not found');
  }

  const { title, teacher, room, weekday, start_time, end_time } =
    req.body as z.infer<typeof classSchema>;

  db.prepare(
    'UPDATE classes SET title = ?, teacher = ?, room = ?, weekday = ?, start_time = ?, end_time = ? WHERE id = ? AND user_id = ?'
  ).run(
    title,
    teacher ?? null,
    room ?? null,
    weekday,
    start_time,
    end_time,
    id,
    userId
  );

  const row = db
    .prepare(
      'SELECT id, title, teacher, room, weekday, start_time, end_time, created_at FROM classes WHERE id = ? AND user_id = ?'
    )
    .get(id, userId);

  return res.json(row);
});

router.delete('/:id', (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new AppError(400, 'Invalid class id');
  }

  const result = db
    .prepare('DELETE FROM classes WHERE id = ? AND user_id = ?')
    .run(id, userId);

  if (result.changes === 0) {
    throw new AppError(404, 'Class not found');
  }

  return res.status(204).send();
});

export default router;



