import { Express } from 'express-serve-static-core';

interface User {
  id: number;
  email: string;
  name: string;
  role_id: number;
}

declare module 'express-serve-static-core' {
  export interface Request {
    user?: User;
  }
}
