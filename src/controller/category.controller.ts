import { Request, Response } from 'express';
import { CategoryRepository } from '../repository/category.repository';
import { Res } from '../helper/response';
import { ERROR, SUCCESS } from '../helper/constant';
import { valCreateCategory } from '../helper/validation';
import { generateID } from '../helper/vegenerate';

export class CategoryController {
  categoryRepository: CategoryRepository;
  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const result = valCreateCategory.validate(req.body);
      if (result.error) {
        return Res.error(res, result.error.details[0].message);
      }

      const findCategory = await this.categoryRepository.find({
        where: {
          name,
        },
      });
      if (findCategory) {
        return Res.error(res, ERROR.CategoryAlreadyExist);
      }

      const storeCategory = await this.categoryRepository.store({
        data: {
          id: generateID(),
          name,
          description,
        },
      });
      if (!storeCategory) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(res, SUCCESS.CreateCategory, storeCategory);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const categories = await this.categoryRepository.findAll();
      return Res.success(res, SUCCESS.GetAllCategories, categories);
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
