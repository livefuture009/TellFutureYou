import globals from './globals';
import jobs from './jobs';
import notifications from './notifications';
import user from './user';

export default {
  ...globals,
  ...jobs,
  ...notifications,
  ...user,
};
