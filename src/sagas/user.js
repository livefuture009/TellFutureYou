import {
  put, call, takeLatest, select,
} from 'redux-saga/effects';
import { get } from 'lodash';
import Types from '../actions/actionTypes';
import api from '../api';
import Messages from '../theme/Messages'

const {
  loginUser,
  loginWithSocial,
  registerUser,
  forgotPassword,
  verifyCodePassword,
  resetPassword,
  changePassword,
  getUser,
  updateProfile,
} = api;

function* GetCurrentUser(action) {
  yield put({ type: Types.GET_CURRENT_USER_REQUEST });
  try {
    yield put({ type: Types.GET_CURRENT_USER_SUCCESS });
  } catch (error) {
    yield put({ type: Types.GET_CURRENT_USER_FAILURE, error: Messages.NetWorkError });
  }
}

function* LoginUser(action) {
  yield put({ type: Types.LOGIN_REQUEST });
  try {
    const res = yield call(loginUser, action.email, action.password, action.player_id, action.lat, action.lng);
    if (res.result) {
      yield put({ type: Types.LOGIN_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.LOGIN_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.LOGIN_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* LoginWithSocial(action) {
  yield put({ type: Types.LOGIN_WITH_SOCIAL_REQUEST });
  try {
    const res = yield call(loginWithSocial, action.user, action.player_id, action.lat, action.lng);
    if (res.result) {
      yield put({ type: Types.LOGIN_WITH_SOCIAL_SUCCESS, payload: res });
    } else {
      yield put({ type: Types.LOGIN_WITH_SOCIAL_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.LOGIN_WITH_SOCIAL_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* RestoreUser(action) {
  yield put({ type: Types.RESTORE_USER_REQUEST });
  try {
    const res = yield call(getUser, action.user_id);
    if (res.result) {
      yield put({ type: Types.RESTORE_USER_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.RESTORE_USER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.RESTORE_USER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* RegisterUser(action) {
  yield put({ type: Types.REGISTER_USER_REQUEST });
  try {
    const res = yield call(registerUser, action.user);
    if (res.result) {
      yield put({ type: Types.REGISTER_USER_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.REGISTER_USER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.REGISTER_USER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* ForgotPassword(action) {
  yield put({ type: Types.FORGOT_PASSWORD_REQUEST });
  try {
    const res = yield call(forgotPassword, action.email);
    if (res.result) {
      yield put({ type: Types.FORGOT_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.FORGOT_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.FORGOT_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* VerifyCodePassword(action) {
  yield put({ type: Types.VERIFY_CODE_PASSWORD_REQUEST });
  try {
    const res = yield call(verifyCodePassword, action.email, action.code);
    if (res.result) {
      yield put({ type: Types.VERIFY_CODE_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.VERIFY_CODE_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.VERIFY_CODE_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* ResetPassword(action) {
  yield put({ type: Types.RESET_PASSWORD_REQUEST });
  try {
    const res = yield call(resetPassword, action.email, action.password);
    if (res.result) {
      yield put({ type: Types.RESET_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.RESET_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.RESET_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* ChangePassword(action) {
  yield put({ type: Types.CHANGE_PASSWORD_REQUEST });
  try {
    const res = yield call(changePassword, action.user_id, action.old_password, action.new_password);
    if (res.result) {
      yield put({ type: Types.CHANGE_PASSWORD_SUCCESS, payload: res.message });
    } else {
      yield put({ type: Types.CHANGE_PASSWORD_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.CHANGE_PASSWORD_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

function* GetUser(action) {
  yield put({ type: Types.GET_USER_REQUEST });
  try {
    const res = yield call(getUser, action.user_id, action.is_update);
    if (res.result) {
      yield put({ type: Types.GET_USER_SUCCESS, payload: res, is_update: action.is_update});
    } else {
      yield put({ type: Types.GET_USER_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.GET_USER_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}


function* UpdateProfile(action) {
  yield put({ type: Types.UPDATE_PROFILE_REQUEST });
  try {
    const res = yield call(updateProfile, action.user);
    if (res.result) {
      yield put({ type: Types.UPDATE_PROFILE_SUCCESS, payload: res.user });
    } else {
      yield put({ type: Types.UPDATE_PROFILE_FAILURE, error: res.error });      
    }
  } catch (error) {
    yield put({ type: Types.UPDATE_PROFILE_FAILURE, error: Messages.NetWorkError });
    console.log(error);
  }
}

export default [
  takeLatest(Types.LOGIN_USER, LoginUser),
  takeLatest(Types.LOGIN_WITH_SOCIAL, LoginWithSocial),
  takeLatest(Types.RESTORE_USER, RestoreUser),
  takeLatest(Types.REGISTER_USER, RegisterUser),  
  takeLatest(Types.FORGOT_PASSWORD, ForgotPassword),
  takeLatest(Types.VERIFY_CODE_PASSWORD, VerifyCodePassword),
  takeLatest(Types.RESET_PASSWORD, ResetPassword),
  takeLatest(Types.CHANGE_PASSWORD, ChangePassword),
  takeLatest(Types.GET_USER, GetUser),
  takeLatest(Types.UPDATE_PROFILE, UpdateProfile),
];
