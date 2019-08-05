import { ErrorDebugInterface } from './error-debug.interface';

export interface ErrorInterface {
  code: number;
  message: string;
  status: number;
  debug?: Array<ErrorDebugInterface>;
}
