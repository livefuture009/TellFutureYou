import { combineReducers } from 'redux';
import globals from './globals';
import notifications from './notifications';
import user from './user';
import scheduledMessages from './scheduledMessages';

const applicationReducers = {
  globals,
  notifications,
  user,
  scheduledMessages,
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
