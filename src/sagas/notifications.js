import { put, call, takeLatest } from 'redux-saga/effects';
import Types from '../actions/actionTypes';
import api from '../api';
import Messages from '../theme/Messages'

const {
  getUnreadNumber,
  createNotification,
  getMyNofications,
  markReadNotification,
} = api;

function* GetUnreadNumber(action) {
  yield put({ type: Types.GET_UNREADNUMBER_REQUEST });
  try {
    const res = yield call(getUnreadNumber, action.user_id);
    if (res.result) {
      yield put({ type: Types.GET_UNREADNUMBER_SUCCESS, payload: res.count });
    } else {
      yield put({ type: Types.GET_UNREADNUMBER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_UNREADNUMBER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* CreateNotification(action) {
  yield put({ type: Types.CREATE_NOTIFICATION_REQUEST });
  try {
    const res = yield call(createNotification, action.notification);
    if (res.result) {
      yield put({ type: Types.CREATE_NOTIFICATION_SUCCESS, payload: res.notification });
    } else {
      yield put({ type: Types.CREATE_NOTIFICATION_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.CREATE_NOTIFICATION_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* GetMyNofications(action) {
  yield put({ type: Types.GET_MY_NOTIFICATIONS_REQUEST });
  try {
    const res = yield call(getMyNofications, action.user_id);
    if (res.result) {
      yield put({ type: Types.GET_MY_NOTIFICATIONS_SUCCESS, payload: res.notifications });
    } else {
      yield put({ type: Types.GET_MY_NOTIFICATIONS_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_MY_NOTIFICATIONS_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* MarkReadNotification(action) {
  yield put({ type: Types.MARK_READ_NOTIFICATION_REQUEST });
  try {
    const res = yield call(markReadNotification, action.notification_id);
    if (res.result) {
      yield put({ type: Types.MARK_READ_NOTIFICATION_SUCCESS, payload: res.notification });
    } else {
      yield put({ type: Types.MARK_READ_NOTIFICATION_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.MARK_READ_NOTIFICATION_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

export default [
  takeLatest(Types.GET_UNREADNUMBER, GetUnreadNumber),
  takeLatest(Types.CREATE_NOTIFICATION, CreateNotification),
  takeLatest(Types.GET_MY_NOTIFICATIONS, GetMyNofications),
  takeLatest(Types.MARK_READ_NOTIFICATION, MarkReadNotification),
];
