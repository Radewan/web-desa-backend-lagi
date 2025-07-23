import fs from "node:fs/promises";
import path from "node:path";
import { ProductValidation } from "./../validation/product-validation";
import { prismaClient } from "../application/database";
import {
  ProductCreateRequest,
  ProductUpdateRequest,
  toProductWithRatingGetAllResponse,
} from "../model/product-model";
import { UserResponse } from "../model/user-model";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { CategoryCreateRequest } from "../model/category-model";
import { CategoryValidation } from "../validation/category-validation";
import { Helper } from "../utils/helper";
import axios from "axios";

export class AdminService {
  static async getCategories() {
    const categories = await prismaClient.category.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return { categories: categories };
  }
  static async createCategory(request: CategoryCreateRequest) {
    Validation.validate(CategoryValidation.create, request);

    request.name = Helper.toTitleCase(request.name);

    const categoryCount = await prismaClient.category.count({
      where: {
        name: request.name,
      },
    });

    if (categoryCount !== 0) {
      throw new ResponseError(400, "Category already exists");
    }

    const category = await prismaClient.category.create({
      data: {
        name: request.name,
      },
    });

    return { category: category };
  }
  static async updateCategory(
    categoryId: string,
    request: CategoryCreateRequest
  ) {
    Validation.validate(CategoryValidation.create, request);

    const category = await prismaClient.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new ResponseError(404, "Category not found");
    }

    request.name = Helper.toTitleCase(request.name);
    const categoryUpdate = await prismaClient.category.update({
      where: { id: categoryId },
      data: {
        name: request.name,
      },
    });

    return { category: categoryUpdate };
  }
  static async deleteCategory(categoryId: string) {
    const category = await prismaClient.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new ResponseError(404, "Category not found");
    }
    await prismaClient.category.delete({ where: { id: categoryId } });
  }

  static async getOwn(user: UserResponse, page: number, limit: number) {
    const products = await prismaClient.product.findMany({
      where: {
        user_id: user.id,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        ratings: true,
      },
    });

    const producsWithRating = products.map((product) => {
      const averageRating =
        product.ratings.length > 0
          ? product.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            product.ratings.length
          : 0;
      return {
        product: product,
        average_rating: averageRating,
      };
    });

    const totalProduct = await prismaClient.product.count({
      where: {
        user_id: user.id,
      },
    });

    return toProductWithRatingGetAllResponse(
      totalProduct,
      page,
      limit,
      producsWithRating
    );
  }
  static async create(
    request: ProductCreateRequest,
    user: UserResponse,
    file?: Express.Multer.File
  ) {
    request.price = Number(request.price);
    if (isNaN(request.price)) {
      throw new ResponseError(404, "Price must be a number");
    }
    Validation.validate(ProductValidation.create, request);

    const category = await prismaClient.category.findUnique({
      where: { id: request.category_id },
    });

    if (!category) {
      throw new ResponseError(404, "Category not found");
    }

    if (!file) {
      throw new ResponseError(400, "Featured image is required");
    }

    const product = await prismaClient.product.create({
      data: {
        ...request,
        user_id: user.id,
        featured_image: file.filename,
      },
    });

    return { product: product };
  }
  static async update(
    request: ProductUpdateRequest,
    user: UserResponse,
    productId: string,
    file?: Express.Multer.File
  ) {
    if (request.price) {
      request.price = Number(request.price);
      if (isNaN(request.price)) {
        throw new ResponseError(404, "Price must be a number");
      }
    }

    Validation.validate(ProductValidation.update, request);

    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ResponseError(404, "Product not found");
    }

    if (product.user_id !== user.id) {
      throw new ResponseError(403, "Forbidden");
    }

    if (file) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "images",
        product.featured_image
      );
      await fs.unlink(filePath);
    }

    const productUpdate = await prismaClient.product.update({
      where: { id: product.id },
      data: {
        ...(request.title && { title: request.title }),
        ...(request.description && { description: request.description }),
        ...(request.price && { price: request.price }),
        ...(request.category_id && { category_id: request.category_id }),
        ...(request.link_whatsapp && { link_whatsapp: request.link_whatsapp }),
        ...(file && { featured_image: file.filename }),
      },
    });

    return { product: productUpdate };
  }
  static async delete(productId: string, user: UserResponse, token: string) {
    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ResponseError(404, "Product not found");
    }

    if (product.user_id !== user.id) {
      throw new ResponseError(403, "Forbidden");
    }

    await axios.delete(
      `http://localhost:3000/api/comments/delete-by-target/${productId}?targetType=PRODUCT`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "images",
      product.featured_image
    );

    Promise.all([
      await prismaClient.product.delete({
        where: { id: productId },
      }),
      await fs.unlink(filePath),
    ]);
  }
  static async deleteByAdmin(user: UserResponse, token: string) {
    const products = await prismaClient.product.findMany({
      where: { user_id: user.id },
    });

    await Promise.all(
      products.map((product) => {
        return axios.delete(
          `http://localhost:3000/api/comments/delete-by-target/${product.id}?targetType=PRODUCT`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
      })
    );

    await prismaClient.product.deleteMany({
      where: { user_id: user.id },
    });

    await Promise.all(
      products.map((product) => {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "images",
          product.featured_image
        );
        return fs.unlink(filePath);
      })
    );
  }
}
