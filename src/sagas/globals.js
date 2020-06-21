import { put, call, takeLatest } from 'redux-saga/effects';
import Types from '../actions/actionTypes';
import api from '../api';
import * as Storage from '../services/Storage';
import Messages from '../theme/Messages'

const {
  getGlobalInfo,
  getAvailabilities,
  getRates,
  getServices,
  getGeoData,
  uploadFile,
} = api;

function* GetGlobalInfo(action) {
  yield put({ type: Types.GET_GLOBAL_INFO_REQUEST });
  try {
    const res = yield call(getGlobalInfo);
    if (res.result) {
      yield put({ type: Types.GET_GLOBAL_INFO_SUCCESS, payload: res.data });
    } else {
      yield put({ type: Types.GET_GLOBAL_INFO_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_GLOBAL_INFO_FAILURE, error: error.message });
    console.log(error);
  }
}

function* GetAvailabilities(action) {
  yield put({ type: Types.GET_AVAILABILITIES_REQUEST });
  try {
    const res = yield call(getAvailabilities);
    if (res.result) {
      yield put({ type: Types.GET_AVAILABILITIES_SUCCESS, payload: res.availabilities });
    } else {
      yield put({ type: Types.GET_AVAILABILITIES_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_AVAILABILITIES_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* GetRates(action) {
  yield put({ type: Types.GET_RATES_REQUEST });
  try {
    const res = yield call(getRates);
    if (res.result) {
      yield put({ type: Types.GET_RATES_SUCCESS, payload: res.rates });
    } else {
      yield put({ type: Types.GET_RATES_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_RATES_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* GetServices(action) {
  yield put({ type: Types.GET_SERVICES_REQUEST });
  try {
    const res = yield call(getServices);
    if (res.result) {
      yield put({ type: Types.GET_SERVICES_SUCCESS, payload: res.services });
    } else {
      yield put({ type: Types.GET_SERVICES_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_SERVICES_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* GetGeoData(action) {
  yield put({ type: Types.GET_GEODATA_REQUEST });
  try {
    const res = yield call(getGeoData, action.address);
    if (res.result) {
      yield put({ type: Types.GET_GEODATA_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.GET_GEODATA_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_GEODATA_FAILURE, error: Messages.NetWorkError });
  }
}

function* UploadFile(action) {
  yield put({ type: Types.UPLOAD_ATTACH_FILE_REQUEST });
  try {
    const res = yield call(uploadFile, action.file);
    if (res.result) {
      yield put({ type: Types.UPLOAD_ATTACH_FILE_SUCCESS, payload: res});
    } else {
      yield put({ type: Types.UPLOAD_ATTACH_FILE_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.UPLOAD_ATTACH_FILE_FAILURE, error: Messages.NetWorkError });
  }
}

function* LogOut() {
  yield Promise.all([
	Storage.CurrentUser.remove(),
  ]).catch(() => {});

  // yield put({ type: Types.SET_NAVIGATOR, nav: action.nav });
}


export default [
  takeLatest(Types.GET_GLOBAL_INFO, GetGlobalInfo),
  takeLatest(Types.GET_GEODATA, GetGeoData),
  takeLatest(Types.UPLOAD_ATTACH_FILE, UploadFile),
  takeLatest(Types.LOG_OUT, LogOut),
];
