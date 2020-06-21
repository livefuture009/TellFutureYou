import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
  id: null,
  currentUser: null,
  needToSignUp: false,
  user: {},
  playerId: null,
  errorMessage: '',
  resultMessage: '',
  unreadMessages: 0,

  loginUserStatus: Status.NONE,
  loginWithSocialStatus: Status.NONE,
  checkEmailStatus: Status.NONE,
  registerUserStatus: Status.NONE,
  forgotPasswordStatus: Status.NONE,
  verifyCodePasswordStatus: Status.NONE,
  resetPasswordStatus: Status.NONE,
  changePasswordStatus: Status.NONE,
  getUserStatus: Status.NONE,
  restoreUserStatus: Status.NONE,
  updateProfileStatus: Status.NONE,
};

/* 
***** Login *****
*/
const loginUserRequest = (state) => ({
  ...state,
  loginUserStatus: Status.REQUEST,
});

const loginUserSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  loginUserStatus: Status.SUCCESS,
});

const loginUserFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
 loginUserStatus: Status.FAILURE,
});

/* 
***** Login With Social *****
*/
const loginWithSocialRequest = (state) => ({
  ...state,
  loginWithSocialStatus: Status.REQUEST,
});

const loginWithSocialSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload.user,
  needToSignUp: action.payload.needToSignUp ? action.payload.needToSignUp : false,  
  loginWithSocialStatus: Status.SUCCESS,
});

const loginWithSocialFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
 loginWithSocialStatus: Status.FAILURE,
});

/* 
***** Restore User *****
*/
const restoreUserRequest = (state) => ({
  ...state,
  restoreUserStatus: Status.REQUEST,
});

const restoreUserSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  restoreUserStatus: Status.SUCCESS,
});

const restoreUserFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  restoreUserStatus: Status.FAILURE,
});

/* 
***** Register User *****
*/

const registerUserRequest = (state) => ({
  ...state,
  registerUserStatus: Status.REQUEST,
});

const registerUserSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  registerUserStatus: Status.SUCCESS,
});

const registerUserFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  registerUserStatus: Status.FAILURE,
});

/* 
***** Forgot Password *****
*/
const forgotPasswordRequest = (state) => ({
  ...state,
  forgotPasswordStatus: Status.REQUEST,
});

const forgotPasswordSuccess = (state, action) => ({
  ...state,
  resultMessage: action.payload,
  forgotPasswordStatus: Status.SUCCESS,
});

const forgotPasswordFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  forgotPasswordStatus: Status.FAILURE,
});

/* 
***** Verify Code Password *****
*/
const verifyCodePasswordRequest = (state) => ({
  ...state,
  verifyCodePasswordStatus: Status.REQUEST,
});

const verifyCodePasswordSuccess = (state, action) => ({
  ...state,
  resultMessage: action.payload,
  verifyCodePasswordStatus: Status.SUCCESS,
});

const verifyCodePasswordFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  verifyCodePasswordStatus: Status.FAILURE,
});

/* 
***** Reset Password *****
*/

const resetPasswordRequest = (state) => ({
  ...state,
  resetPasswordStatus: Status.REQUEST,
});

const resetPasswordSuccess = (state, action) => ({
  ...state,
  resultMessage: action.payload,
  resetPasswordStatus: Status.SUCCESS,
});

const resetPasswordFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  resetPasswordStatus: Status.FAILURE,
});

/* 
***** Reset Password *****
*/

const changePasswordRequest = (state) => ({
  ...state,
  changePasswordStatus: Status.REQUEST,
});

const changePasswordSuccess = (state, action) => ({
  ...state,
  resultMessage: action.payload,
  changePasswordStatus: Status.SUCCESS,
});

const changePasswordFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  changePasswordStatus: Status.FAILURE,
});

/* 
***** Get User *****
*/

const getUserRequest = (state) => ({
  ...state,
  getUserStatus: Status.REQUEST,
});

const getUserSuccess = (state, action) => {
  state.getUserStatus = Status.SUCCESS;
  const { user} = action.payload;
  if (action.is_update) {
    state.currentUser = user;
  }
  state.user = user;
  state.userJobs = action.payload.jobs;
  return {
    ...state,
  };
};

const getUserFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getUserStatus: Status.FAILURE,
});

/* 
***** Update Profile. *****
*/

const updateProfileRequest = (state) => ({
  ...state,
  updateProfileStatus: Status.REQUEST,
});

const updateProfileSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  updateProfileStatus: Status.SUCCESS,
});

const updateProfileFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  updateProfileStatus: Status.FAILURE,
});

/* 
***** Set Current User. *****
*/

const setCurrentUser = (state, action) => ({
  ...state,
  currentUser: action.user,
});

/* 
***** Set Onesignal Player Id. *****
*/

const setPlayerId = (state, action) => ({
  ...state,
  playerId: action.payload,
});

///////////////////////////////////////////////////////
/////////////// Set Unread Message ////////////////////
///////////////////////////////////////////////////////

const setUnreadMessage = (state, action) => {
  state.unreadMessages = action.number;
  return {
    ...state,
  };
};

/***************************************
**************** RESET *****************
***************************************/

const resetUser = (state, action) => {
  state.id = null;
  state.currentUser = null;
  state.needToSignUp = false;
  state.user = {};
  state.playerId = null;
  state.errorMessage = '';
  state.resultMessage = '';
  return {
    ...state,
  };
};


const actionHandlers = {
  [Types.LOGIN_REQUEST]: loginUserRequest,
  [Types.LOGIN_SUCCESS]: loginUserSuccess,
  [Types.LOGIN_FAILURE]: loginUserFailure,

  [Types.LOGIN_WITH_SOCIAL_REQUEST]: loginWithSocialRequest,
  [Types.LOGIN_WITH_SOCIAL_SUCCESS]: loginWithSocialSuccess,
  [Types.LOGIN_WITH_SOCIAL_FAILURE]: loginWithSocialFailure,

  [Types.RESTORE_USER_REQUEST]: restoreUserRequest,
  [Types.RESTORE_USER_SUCCESS]: restoreUserSuccess,
  [Types.RESTORE_USER_FAILURE]: restoreUserFailure,

  [Types.REGISTER_USER_REQUEST]: registerUserRequest,
  [Types.REGISTER_USER_SUCCESS]: registerUserSuccess,
  [Types.REGISTER_USER_FAILURE]: registerUserFailure,

  [Types.FORGOT_PASSWORD_REQUEST]: forgotPasswordRequest,
  [Types.FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
  [Types.FORGOT_PASSWORD_FAILURE]: forgotPasswordFailure,

  [Types.VERIFY_CODE_PASSWORD_REQUEST]: verifyCodePasswordRequest,
  [Types.VERIFY_CODE_PASSWORD_SUCCESS]: verifyCodePasswordSuccess,
  [Types.VERIFY_CODE_PASSWORD_FAILURE]: verifyCodePasswordFailure,

  [Types.RESET_PASSWORD_REQUEST]: resetPasswordRequest,
  [Types.RESET_PASSWORD_SUCCESS]: resetPasswordSuccess,
  [Types.RESET_PASSWORD_FAILURE]: resetPasswordFailure,

  [Types.CHANGE_PASSWORD_REQUEST]: changePasswordRequest,
  [Types.CHANGE_PASSWORD_SUCCESS]: changePasswordSuccess,
  [Types.CHANGE_PASSWORD_FAILURE]: changePasswordFailure,

  [Types.GET_USER_REQUEST]: getUserRequest,
  [Types.GET_USER_SUCCESS]: getUserSuccess,
  [Types.GET_USER_FAILURE]: getUserFailure,

  [Types.UPDATE_PROFILE_REQUEST]: updateProfileRequest,
  [Types.UPDATE_PROFILE_SUCCESS]: updateProfileSuccess,
  [Types.UPDATE_PROFILE_FAILURE]: updateProfileFailure,

  [Types.SET_CURRENT_USER]: setCurrentUser,
  [Types.SET_PLAYER_ID]: setPlayerId, 
  [Types.SET_UNREAD_MESSAGE]: setUnreadMessage,
  [Types.RESET_USER]: resetUser,
};

export default createReducer(initialState, actionHandlers);
