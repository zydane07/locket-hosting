import { Response } from 'express';

export const Res = {
  success: (res: Response, msg: string, data: object) => {
    return res.status(200).json({
      success: true,
      message: msg,
      data: data,
    });
  },

  error: (res: Response, msg: any) => {
    return res.status(400).json({
      success: false,
      message: msg,
    });
  },
};
