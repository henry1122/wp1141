import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { validateBody } from '../middleware/validate';
import { authRequired, AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../utils/AppError';

const router = Router();

const studentSchema = z.object({
  name: z.string().min(1),
  grade: z.string().optional(),
  phone: z.string().optional(),
  note: z.string().optional()
});

router.use(authRequired);

router.get('/', (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const rows = db
    .prepare(
      'SELECT id, name, grade, phone, note, created_at FROM students WHERE user_id = ? ORDER BY created_at DESC'
    )
    .all(userId);
  return res.json(rows);
});

router.post('/', validateBody(studentSchema), (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const { name, grade, phone, note } = req.body as z.infer<typeof studentSchema>;

  const result = db
    .prepare(
      'INSERT INTO students (user_id, name, grade, phone, note) VALUES (?, ?, ?, ?, ?)'
    )
    .run(userId, name, grade ?? null, phone ?? null, note ?? null);

  const id = Number(result.lastInsertRowid);
  const row = db
    .prepare(
      'SELECT id, name, grade, phone, note, created_at FROM students WHERE id = ? AND user_id = ?'
    )
    .get(id, userId);

  return res.status(201).json(row);
});

router.put(
  '/:id',
  validateBody(studentSchema),
  (req: AuthenticatedRequest, res) => {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw new AppError(400, 'Invalid student id');
    }

    const existing = db
      .prepare('SELECT id FROM students WHERE id = ? AND user_id = ?')
      .get(id, userId);
    if (!existing) {
      throw new AppError(404, 'Student not found');
    }

    const { name, grade, phone, note } =
      req.body as z.infer<typeof studentSchema>;

    db.prepare(
      'UPDATE students SET name = ?, grade = ?, phone = ?, note = ? WHERE id = ? AND user_id = ?'
    ).run(name, grade ?? null, phone ?? null, note ?? null, id, userId);

    const row = db
      .prepare(
        'SELECT id, name, grade, phone, note, created_at FROM students WHERE id = ? AND user_id = ?'
      )
      .get(id, userId);

    return res.json(row);
  }
);

router.delete('/:id', (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new AppError(400, 'Invalid student id');
  }

  const result = db
    .prepare('DELETE FROM students WHERE id = ? AND user_id = ?')
    .run(id, userId);

  if (result.changes === 0) {
    throw new AppError(404, 'Student not found');
  }

  return res.status(204).send();
});

export default router;



