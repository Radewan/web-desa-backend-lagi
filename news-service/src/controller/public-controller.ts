import { Request, Response, NextFunction } from "express";
import { PublicService } from "../service/public-service";

export class PublicController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      let page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      const response = await PublicService.getAll(page, limit);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await PublicService.getById(req.params.userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAllTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await PublicService.getAllTypeById(req.params.userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
