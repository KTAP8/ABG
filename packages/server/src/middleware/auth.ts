import { Request, Response, NextFunction } from 'express'
import { AppError } from './errorHandler'

export const requireAdmin = (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Stub: admin auth will be implemented in phase 2 with Better Auth
  throw new AppError(401, 'Admin authentication not yet implemented')
}
