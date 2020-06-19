import * as globals from './globals';
import * as jobs from './jobs';
import * as notifications from './notifications';
import * as user from './user';

export default {
  ...globals,
  ...jobs,
  ...notifications,
  ...user,
};
