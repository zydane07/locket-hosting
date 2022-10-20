import { Request, Response } from 'express';
import { ImageRepository } from 'src/repository/image.repository';
import Cloudinary from 'src/helper/cloudinary';
import { ERROR, SUCCESS, CLOUDINARY_FOLDER } from '../helper/constant';
import { Res } from '../helper/response';
import { generateID } from 'src/helper/vegenerate';

export class ImageController {
  imageRepository: ImageRepository;
  constructor(imageRepository: ImageRepository) {
    this.imageRepository = imageRepository;
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.find = this.find.bind(this);
  }

  async create(req: Request, res: Response) {
    try {
      if (!req.file) {
        return Res.error(res, ERROR.FileEmpty);
      }
      const { type } = req.body;
      if (!type) {
        return Res.error(res, ERROR.UploadTypeEmpty);
      }

      let uploadType;
      switch (type) {
        case CLOUDINARY_FOLDER.PARTICIPANT:
          uploadType = CLOUDINARY_FOLDER.PARTICIPANT;
          break;
        case CLOUDINARY_FOLDER.EVENT_ORGANIZER:
          uploadType = CLOUDINARY_FOLDER.EVENT_ORGANIZER;
          break;
        case CLOUDINARY_FOLDER.EO_PRECONDITION:
          uploadType = CLOUDINARY_FOLDER.EO_PRECONDITION;
          break;
        case CLOUDINARY_FOLDER.EVENT_PRECONDITION:
          uploadType = CLOUDINARY_FOLDER.EVENT_PRECONDITION;
          break;
        case CLOUDINARY_FOLDER.EVENT:
          uploadType = CLOUDINARY_FOLDER.EVENT;
          break;
        default:
      }
      if (!uploadType) {
        return Res.error(res, ERROR.UploadTypeEmpty);
      }

      const options = {
        folder: `locket/${uploadType}`,
      };

      const cloudinary = await Cloudinary.v2.uploader.upload(
        req.file.path,
        options,
      );
      if (!cloudinary) {
        return Res.error(res, ERROR.InternalServer);
      }

      const storeImage = await this.imageRepository.store({
        data: {
          id: generateID(),
          public_id: cloudinary.public_id,
          width: cloudinary.width,
          height: cloudinary.height,
          version: cloudinary.version,
          format: cloudinary.format,
          etag: cloudinary.etag,
          url: cloudinary.url,
          secure_url: cloudinary.secure_url,
          signature: cloudinary.signature,
        },
      });
      if (!storeImage) {
        return Res.error(res, ERROR.InternalServer);
      }
      return Res.success(res, SUCCESS.UploadFile, storeImage);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const images = await this.imageRepository.findAll();
      return Res.success(res, SUCCESS.GetAllImages, images);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async find(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const image = await this.imageRepository.find({
        where: {
          id: Number(id),
        },
      });
      if (!image) {
        return Res.error(res, ERROR.DataDoesNotExist);
      }
      return Res.success(res, SUCCESS.GetImage, image);
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
