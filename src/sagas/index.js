import { all } from 'redux-saga/effects';
import globalsSagas from './globals';
import notificationsSagas from './notifications';
import userSagas from './user';
import scheduledMessagesSagas from './scheduledMessages';

export default function* sagas() {
  yield all([
    ...globalsSagas,
    ...notificationsSagas,
    ...userSagas,
    ...scheduledMessagesSagas
  ]);
}
