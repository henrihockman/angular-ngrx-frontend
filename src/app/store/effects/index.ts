import { AuthEffects } from './auth/auth.effects';
import { ErrorEffects } from './error/error.effects';

export * from './auth/auth.effects';
export * from './error/error.effects';

export const Effects = [
  AuthEffects,
  ErrorEffects,
];
