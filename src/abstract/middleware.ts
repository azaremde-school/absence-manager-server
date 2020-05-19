import { Request, Response, NextFunction } from 'express';

type TMiddleware = (request: Request, response: Response, next: NextFunction) => void;

export = TMiddleware;