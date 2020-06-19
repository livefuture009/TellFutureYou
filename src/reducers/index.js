import { combineReducers } from 'redux';
import globals from './globals';
import jobs from './jobs';
import notifications from './notifications';
import user from './user';

const applicationReducers = {
  globals,
  notifications,
  jobs,
  user,
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
