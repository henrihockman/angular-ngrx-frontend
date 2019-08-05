import { ConfigService } from './config.service';
import { MessageService } from './message.service';
import { PathResolveService } from './path.resolve.service';

export * from './config.service';
export * from './message.service';
export * from './path.resolve.service';

export const Services = [
  ConfigService,
  MessageService,
  PathResolveService,
];
