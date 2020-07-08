import globals from './globals';
import notifications from './notifications';
import user from './user';
import scheduledMessages from './scheduledMessages';

export default {
  ...globals,
  ...notifications,
  ...user,
  ...scheduledMessages,
};
