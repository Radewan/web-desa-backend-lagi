import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { PrivateService } from "../service/private-service";

export class PrivateController {
  static async alreadyRated(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await PrivateService.alreadyRated(
        req.params.productId,
        req.user!
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async createRating(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await PrivateService.createRating(
        req.body,
        req.params.productId,
        req.user!
      );
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateRating(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await PrivateService.updateRating(
        req.params.ratingId,
        req.body,
        req.user!
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteRating(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await PrivateService.deleteRating(req.params.ratingId, req.user!);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}
