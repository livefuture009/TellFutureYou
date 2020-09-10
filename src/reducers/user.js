import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
  id: null,
  currentUser: null,
  needToSignUp: false,
  selectedUser: {},
  friends: [],
  playerId: null,
  errorMessage: '',
  resultMessage: '',
  unreadMessages: 0,
  activePage: 0,

  loginUserStatus: Status.NONE,
  loginWithSocialStatus: Status.NONE,
  checkEmailStatus: Status.NONE,
  registerUserStatus: Status.NONE,
  forgotPasswordStatus: Status.NONE,
  verifyCodePasswordStatus: Status.NONE,
  resetPasswordStatus: Status.NONE,
  changePasswordStatus: Status.NONE,
  getUserStatus: Status.NONE,
  getUserByEmailStatus: Status.NONE,
  restoreUserStatus: Status.NONE,
  updateProfileStatus: Status.NONE,

  importContactsStatus: Status.NONE,
  sendInviteStatus: Status.NONE,
  addContactStatus: Status.NONE,
  editContactStatus: Status.NONE,
  removeContactStatus: Status.NONE,
  getContactsStatus: Status.NONE,

  getMyFriendsStatus: Status.NONE,
  sendFriendRequestStatus: Status.NONE,
  acceptFriendRequestStatus: Status.NONE,
  declineFriendRequestStatus: Status.NONE,
  removeFriendStatus: Status.NONE,

  changeActiveFriendPageStatus: Status.NONE,
};

//////////////////////////////////////////////////////////////////
/////////////////////////// Login //// ///////////////////////////
/////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
/////////////////////// Login With Social ////////////////////////
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
///////////////////////// Restore User ///////////////////////////
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
//////////////////////// Register User ///////////////////////////
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
/////////////////////// Forgot Password //////////////////////////
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
///////////////////// Verify Code Password ///////////////////////
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
////////////////////// Reset Password ////////////////////////////
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
////////////////////// Change Password ///////////////////////////
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
//////////////////////// Get User ////////////////////////////////
//////////////////////////////////////////////////////////////////
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
  state.selectedUser = user;
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

//////////////////////////////////////////////////////////////////
////////////////////// Get User By Email /////////////////////////
//////////////////////////////////////////////////////////////////
const getUserByEmailRequest = (state) => ({
  ...state,
  getUserByEmailStatus: Status.REQUEST,
});

const getUserByEmailSuccess = (state, action) => ({
  ...state,
  selectedUser: action.payload,
  getUserByEmailStatus: Status.SUCCESS,
});

const getUserByEmailFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getUserByEmailStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
////////////////////// Update Profile ////////////////////////////
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
///////////////////// Import Contacts ////////////////////////////
//////////////////////////////////////////////////////////////////
const importContactsRequest = (state) => ({
  ...state,
  importContactsStatus: Status.REQUEST,
});

const importContactsSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  importContactsStatus: Status.SUCCESS,
});

const importContactsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  importContactsStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
///////////////////////// Send Invite ////////////////////////////
//////////////////////////////////////////////////////////////////
const sendInviteRequest = (state) => ({
  ...state,
  sendInviteStatus: Status.REQUEST,
});

const sendInviteSuccess = (state, action) => ({
  ...state,
  sendInviteStatus: Status.SUCCESS,
});

const sendInviteFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  sendInviteStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
///////////////////////// Add Contact ////////////////////////////
//////////////////////////////////////////////////////////////////
const addContactRequest = (state) => ({
  ...state,
  addContactStatus: Status.REQUEST,
});

const addContactSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  addContactStatus: Status.SUCCESS,
});

const addContactFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  addContactStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
///////////////////////// Edit Contact ////////////////////////////
//////////////////////////////////////////////////////////////////
const editContactRequest = (state) => ({
  ...state,
  editContactStatus: Status.REQUEST,
});

const editContactSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  editContactStatus: Status.SUCCESS,
});

const editContactFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  editContactStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
/////////////////////// Remove Contact ///////////////////////////
//////////////////////////////////////////////////////////////////
const removeContactRequest = (state) => ({
  ...state,
  removeContactStatus: Status.REQUEST,
});

const removeContactSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  removeContactStatus: Status.SUCCESS,
});

const removeContactFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  removeContactStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
////////////////////// Get Contact Status ////////////////////////
//////////////////////////////////////////////////////////////////
const getContactStatusRequest = (state) => ({
  ...state,
  getContactsStatus: Status.REQUEST,
});

const getContactStatusSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  getContactsStatus: Status.SUCCESS,
});

const getContactStatusFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getContactsStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
/////////////////////// Get My Friends ///////////////////////////
//////////////////////////////////////////////////////////////////
const getMyFriendsRequest = (state) => ({
  ...state,
  getMyFriendsStatus: Status.REQUEST,
});

const getMyFriendsSuccess = (state, action) => ({
  ...state,
  friends: action.payload,
  getMyFriendsStatus: Status.SUCCESS,
});

const getMyFriendsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getMyFriendsStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
///////////////////// Send Friend Request ////////////////////////
//////////////////////////////////////////////////////////////////
const sendFriendRequestRequest = (state) => ({
  ...state,
  sendFriendRequestStatus: Status.REQUEST,
});

const sendFriendRequestSuccess = (state, action) => {
  state.sendFriendRequestStatus = Status.SUCCESS;
  const { friend, contact_id } = action.payload;
  var friends = [...state.friends];
  if (!friends) {
    friends = [];
  }

  friends.push(friend);
  state.friends = friends;

  // Update Contacts.
  const { currentUser } = state;
  var contacts = currentUser.contacts;
  if (contacts) {
    contacts.forEach(c => {
      if (c._id == contact_id) {
        c.status = 2;
        c.friendId = friend._id;
        return;
      }
    });
    currentUser.contacts = contacts;
  }
  state.currentUser = currentUser;
  return {
    ...state,
  };
};

const sendFriendRequestFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  sendFriendRequestStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
//////////////////// Accept Friend Request ///////////////////////
//////////////////////////////////////////////////////////////////
const acceptFriendRequestRequest = (state) => ({
  ...state,
  acceptFriendRequestStatus: Status.REQUEST,
});

const acceptFriendRequestSuccess = (state, action) => {
  state.acceptFriendRequestStatus = Status.SUCCESS;
  const { friend } = action.payload;
  var friends = [...state.friends];

  for (var i = 0; i < friends.length; i++) {
    if (friends[i]._id === friend._id) {
      friends[i] = friend;
      break;
    }
  }

  state.friends = friends;

  // Update Contacts.
  const { currentUser } = state;
  var contacts = currentUser.contacts;
  if (contacts) {
    contacts.forEach(c => {
      if (c.friendId == friend._id) {
        c.status = 3;
        return;
      }
    });
    currentUser.contacts = contacts;
  }
  state.currentUser = currentUser;
  return {
    ...state,
  };
};

const acceptFriendRequestFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  declineFriendRequestStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
//////////////////// Decline Friend Request //////////////////////
//////////////////////////////////////////////////////////////////
const declineFriendRequestRequest = (state) => ({
  ...state,
  declineFriendRequestStatus: Status.REQUEST,
});

const declineFriendRequestSuccess = (state, action) => {
  state.declineFriendRequestStatus = Status.SUCCESS;
  const { friend_id } = action.payload;
  var friends = [...state.friends];

  for (var i = 0; i < friends.length; i++) {
    if (friends[i]._id === friend_id) {
      friends.splice(i, 1);
      break;
    }
  }

  state.friends = friends;

  // Update Contacts.
  const { currentUser } = state;
  var contacts = currentUser.contacts;
  if (contacts) {
    contacts.forEach(c => {
      if (c.friendId == friend_id) {
        c.status = 1;
        return;
      }
    });
    currentUser.contacts = contacts;
  }
  state.currentUser = currentUser;
  return {
    ...state,
  };
};

const declineFriendRequestFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  declineFriendRequestStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
//////////////////////// Remove Friend ///////////////////////////
//////////////////////////////////////////////////////////////////
const removeFriendRequest = (state) => ({
  ...state,
  removeFriendStatus: Status.REQUEST,
});

const removeFriendSuccess = (state, action) => {
  state.removeFriendStatus = Status.SUCCESS;
  const { friend_id } = action.payload;
  var friends = [...state.friends];

  for (var i = 0; i < friends.length; i++) {
    if (friends[i]._id === friend_id) {
      friends.splice(i, 1);
      break;
    }
  }

  state.friends = friends;

  // Update Contacts.
  const { currentUser } = state;
  var contacts = currentUser.contacts;
  if (contacts) {
    contacts.forEach(c => {
      if (c.friendId && c.friendId == friend_id) {
        c.friendId = null;
        c.status = 1;
      }
    });
  }

  currentUser.contacts = contacts;
  state.currentUser = currentUser;

  return {
    ...state,
  };
};

const removeFriendFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  removeFriendStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
///////////////////// Set Current User ///////////////////////////
//////////////////////////////////////////////////////////////////
const setCurrentUser = (state, action) => ({
  ...state,
  currentUser: action.user,
});

//////////////////////////////////////////////////////////////////
/////////////////// Set Onesignal Player Id //////////////////////
//////////////////////////////////////////////////////////////////
const setPlayerId = (state, action) => ({
  ...state,
  playerId: action.payload,
});

//////////////////////////////////////////////////////////////////
//////////////////// Set Unread Message //////////////////////////
//////////////////////////////////////////////////////////////////

const setUnreadMessage = (state, action) => {
  state.unreadMessages = action.number;
  return {
    ...state,
  };
};

//////////////////////////////////////////////////////////////////
///////////////// Change Friend Active Page //////////////////////
//////////////////////////////////////////////////////////////////

const changeFriendActivePage = (state, action) => {
  state.activePage = action.page;
  state.changeActiveFriendPageStatus = Status.SUCCESS;
  return {
    ...state,
  };
};

const resetFriendPage = (state, action) => {
  state.changeActiveFriendPageStatus = Status.NONE;
  return {
    ...state,
  };
};

//////////////////////////////////////////////////////////////////
////////////////////// RESET /////////////////////////////////////
//////////////////////////////////////////////////////////////////
const resetUser = (state, action) => {
  state.id = null;
  state.currentUser = null;
  state.needToSignUp = false;
  state.user = {};
  state.friends = [];
  state.playerId = null;
  state.errorMessage = '';
  state.resultMessage = '';
  state.activePage = 0;

  state.loginUserStatus = Status.NONE;
  state.loginWithSocialStatus = Status.NONE;
  state.checkEmailStatus = Status.NONE;
  state.registerUserStatus = Status.NONE;
  state.forgotPasswordStatus = Status.NONE;
  state.verifyCodePasswordStatus = Status.NONE;
  state.resetPasswordStatus = Status.NONE;
  state.changePasswordStatus = Status.NONE;
  state.getUserStatus = Status.NONE;
  state.getUserByEmailStatus = Status.NONE;
  state.restoreUserStatus = Status.NONE;
  state.updateProfileStatus = Status.NONE;

  state.importContactsStatus = Status.NONE;
  state.sendInviteStatus = Status.NONE;
  state.addContactStatus = Status.NONE;
  state.editContactStatus = Status.NONE;
  state.getContactsStatus = Status.NONE;

  state.getMyFriendsStatus = Status.NONE;
  state.sendFriendRequestStatus = Status.NONE;
  state.acceptFriendRequestStatus = Status.NONE;
  state.declineFriendRequestStatus = Status.NONE;
  state.removeFriendStatus = Status.NONE;

  state.changeActiveFriendPageStatus= Status.NONE;
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

  [Types.GET_USER_BY_EMAIL_REQUEST]: getUserByEmailRequest,
  [Types.GET_USER_BY_EMAIL_SUCCESS]: getUserByEmailSuccess,
  [Types.GET_USER_BY_EMAIL_FAILURE]: getUserByEmailFailure,

  [Types.UPDATE_PROFILE_REQUEST]: updateProfileRequest,
  [Types.UPDATE_PROFILE_SUCCESS]: updateProfileSuccess,
  [Types.UPDATE_PROFILE_FAILURE]: updateProfileFailure,

  [Types.IMPORT_CONTACTS_REQUEST]: importContactsRequest,
  [Types.IMPORT_CONTACTS_SUCCESS]: importContactsSuccess,
  [Types.IMPORT_CONTACTS_FAILURE]: importContactsFailure,

  [Types.SEND_INVITE_REQUEST]: sendInviteRequest,
  [Types.SEND_INVITE_SUCCESS]: sendInviteSuccess,
  [Types.SEND_INVITE_FAILURE]: sendInviteFailure,

  [Types.ADD_CONTACT_REQUEST]: addContactRequest,
  [Types.ADD_CONTACT_SUCCESS]: addContactSuccess,
  [Types.ADD_CONTACT_FAILURE]: addContactFailure,

  [Types.EDIT_CONTACT_REQUEST]: editContactRequest,
  [Types.EDIT_CONTACT_SUCCESS]: editContactSuccess,
  [Types.EDIT_CONTACT_FAILURE]: editContactFailure,

  [Types.REMOVE_CONTACT_REQUEST]: removeContactRequest,
  [Types.REMOVE_CONTACT_SUCCESS]: removeContactSuccess,
  [Types.REMOVE_CONTACT_FAILURE]: removeContactFailure,

  [Types.GET_CONTACT_STATUS_REQUEST]: getContactStatusRequest,
  [Types.GET_CONTACT_STATUS_SUCCESS]: getContactStatusSuccess,
  [Types.GET_CONTACT_STATUS_FAILURE]: getContactStatusFailure,

  [Types.GET_MY_FRIENDS_REQUEST]: getMyFriendsRequest,
  [Types.GET_MY_FRIENDS_SUCCESS]: getMyFriendsSuccess,
  [Types.GET_MY_FRIENDS_FAILURE]: getMyFriendsFailure,

  [Types.SEND_FRIEND_REQUEST_REQUEST]: sendFriendRequestRequest,
  [Types.SEND_FRIEND_REQUEST_SUCCESS]: sendFriendRequestSuccess,
  [Types.SEND_FRIEND_REQUEST_FAILURE]: sendFriendRequestFailure,

  [Types.ACCEPT_FRIEND_REQUEST_REQUEST]: acceptFriendRequestRequest,
  [Types.ACCEPT_FRIEND_REQUEST_SUCCESS]: acceptFriendRequestSuccess,
  [Types.ACCEPT_FRIEND_REQUEST_FAILURE]: acceptFriendRequestFailure,

  [Types.DECLINE_FRIEND_REQUEST_REQUEST]: declineFriendRequestRequest,
  [Types.DECLINE_FRIEND_REQUEST_SUCCESS]: declineFriendRequestSuccess,
  [Types.DECLINE_FRIEND_REQUEST_FAILURE]: declineFriendRequestFailure,

  [Types.REMOVE_FRIEND_REQUEST]: removeFriendRequest,
  [Types.REMOVE_FRIEND_SUCCESS]: removeFriendSuccess,
  [Types.REMOVE_FRIEND_FAILURE]: removeFriendFailure,

  [Types.SET_CURRENT_USER]: setCurrentUser,
  [Types.SET_PLAYER_ID]: setPlayerId, 
  [Types.SET_UNREAD_MESSAGE]: setUnreadMessage,
  [Types.CHANGE_FRIEND_ACTIVE_PAGE]: changeFriendActivePage,
  [Types.RESET_FRIEND_PAGE]: resetFriendPage,
  [Types.RESET_USER]: resetUser,
};

export default createReducer(initialState, actionHandlers);
