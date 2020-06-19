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
  lat: 0,
  lng: 0,
  currentZipcode: '',
  transactions: [],
  jobCount: 0,
  avgHourlyRate: 0,
  totalPaid: 0,
  providers: [],
  provider: {},
  paypalClientToken: '',
  userJobs: [],
  unreadMessages: 0,

  loginUserStatus: Status.NONE,
  loginWithSocialStatus: Status.NONE,
  checkEmailStatus: Status.NONE,
  registerCustomerStatus: Status.NONE,
  registerProviderStatus: Status.NONE,
  createUserStatus: Status.NONE,
  forgotPasswordStatus: Status.NONE,
  verifyCodePasswordStatus: Status.NONE,
  resetPasswordStatus: Status.NONE,
  changePasswordStatus: Status.NONE,
  getUserStatus: Status.NONE,
  restoreUserStatus: Status.NONE,
  getTransactionsStatus: Status.NONE,
  withdrawWithPaypalStatus: Status.NONE,
  withdrawWithBankStatus: Status.NONE,
  getNearbyProvidersStatus: Status.NONE,
  depositStatus: Status.NONE,
  getPaypalClientTokenStatus: Status.NONE,
  processPaypalDepositStatus: Status.NONE,
  updateCustomerStatus: Status.NONE,
  updateProviderStatus: Status.NONE,
  getCurrentUserStatus: Status.NONE,
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
***** Create User *****
*/

const createUserRequest = (state) => ({
  ...state,
  createUserStatus: Status.REQUEST,
});

const createUserSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  createUserStatus: Status.SUCCESS,
});

const createUserFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  createUserStatus: Status.FAILURE,
});

/* 
***** Check Email *****
*/

const checkEmailRequest = (state) => ({
  ...state,
  checkEmailStatus: Status.REQUEST,
});

const checkEmailSuccess = (state, action) => ({
  ...state,
  checkEmailStatus: Status.SUCCESS,
});

const checkEmailFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  checkEmailStatus: Status.FAILURE,
});

/* 
***** Register Customer *****
*/

const registerCustomerRequest = (state) => ({
  ...state,
  registerCustomerStatus: Status.REQUEST,
});

const registerCustomerSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  registerCustomerStatus: Status.SUCCESS,
});

const registerCustomerFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  registerCustomerStatus: Status.FAILURE,
});

/* 
***** Register Provider *****
*/

const registerProviderRequest = (state) => ({
  ...state,
  registerProviderStatus: Status.REQUEST,
});

const registerProviderSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  registerProviderStatus: Status.SUCCESS,
});

const registerProviderFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  registerProviderStatus: Status.FAILURE,
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
***** Get Transactions. *****
*/

const getTransactionsRequest = (state) => ({
  ...state,
  getTransactionsStatus: Status.REQUEST,
});

const getTransactionsSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload.user,
  jobCount: action.payload.job_count,
  avgHourlyRate: action.payload.avg_hourly_rate,
  totalPaid: action.payload.total_paid,
  transactions: action.payload.payments,
  getTransactionsStatus: Status.SUCCESS,
});

const getTransactionsFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getTransactionsStatus: Status.FAILURE,
});

/* 
***** Withdraw with Paypal. *****
*/

const withdrawWithPaypalRequest = (state) => ({
  ...state,
  withdrawWithPaypalStatus: Status.REQUEST,
});

const withdrawWithPaypalSuccess = (state, action) => {
  state.currentUser.balance = state.currentUser.balance - action.amount
  return {
    ...state,
    withdrawWithPaypalStatus: Status.SUCCESS,
  }
};

const withdrawWithPaypalFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  withdrawWithPaypalStatus: Status.FAILURE,
});

/* 
***** Withdraw with Bank. *****
*/

const withdrawWithBankRequest = (state) => ({
  ...state,
  withdrawWithBankStatus: Status.REQUEST,
});

const withdrawWithBankSuccess = (state, action) => {
  state.currentUser.balance = state.currentUser.balance - action.amount
  return {
    ...state,
    withdrawWithBankStatus: Status.SUCCESS,
  }
};

const withdrawWithBankFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  withdrawWithBankStatus: Status.FAILURE,
});

/* 
***** Get Nearby Providers. *****
*/

const getNearbyProvidersRequest = (state) => ({
  ...state,
  getNearbyProvidersStatus: Status.REQUEST,
});

const getNearbyProvidersSuccess = (state, action) => ({
  ...state,
  providers: action.payload,
  getNearbyProvidersStatus: Status.SUCCESS,
});

const getNearbyProvidersFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getNearbyProvidersStatus: Status.FAILURE,
});

/* 
***** Deposit. *****
*/

const depositRequest = (state) => ({
  ...state,
  depositStatus: Status.REQUEST,
});

const depositSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  depositStatus: Status.SUCCESS,
});

const depositFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  depositStatus: Status.FAILURE,
});

/* 
***** getPaypalClientToken. *****
*/

const getPaypalClientTokenRequest = (state) => ({
  ...state,
  getPaypalClientTokenStatus: Status.REQUEST,
});

const getPaypalClientTokenSuccess = (state, action) => ({
  ...state,
  paypalClientToken: action.payload,
  getPaypalClientTokenStatus: Status.SUCCESS,
});

const getPaypalClientTokenFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getPaypalClientTokenStatus: Status.FAILURE,
});


/* 
***** Process Paypal Deposit. *****
*/

const processPaypalDepositRequest = (state) => ({
  ...state,
  processPaypalDepositStatus: Status.REQUEST,
});

const processPaypalDepositSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  processPaypalDepositStatus: Status.SUCCESS,
});

const processPaypalDepositFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  processPaypalDepositStatus: Status.FAILURE,
});

/* 
***** Update Customer. *****
*/

const updateCustomerRequest = (state) => ({
  ...state,
  updateCustomerStatus: Status.REQUEST,
});

const updateCustomerSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  updateCustomerStatus: Status.SUCCESS,
});

const updateCustomerFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  updateCustomerStatus: Status.FAILURE,
});

/* 
***** Update Customer. *****
*/

const updateProviderRequest = (state) => ({
  ...state,
  updateProviderStatus: Status.REQUEST,
});

const updateProviderSuccess = (state, action) => ({
  ...state,
  currentUser: action.payload,
  updateProviderStatus: Status.SUCCESS,
});

const updateProviderFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  updateProviderStatus: Status.FAILURE,
});

/* 
***** Get Current User. *****
*/
const getCurrentUserRequest = (state) => ({
  ...state,
  getCurrentUserStatus: Status.REQUEST,
});

const getCurrentUserSuccess = (state, action) => ({
  ...state,
  getCurrentUserStatus: Status.SUCCESS,
});

const getCurrentUserFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,  
  getCurrentUserStatus: Status.FAILURE,
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

/* 
***** Set Geo Location. *****
*/

const setGeoLocation = (state, action) => ({
  ...state,
  lat: action.lat,
  lng: action.lng,
});

/* 
***** Set Zip Code. *****
*/

const setZipcode = (state, action) => ({
  ...state,
  currentZipcode: action.zipcode,
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
  state.lat = 0;
  state.lng = 0;
  state.currentZipcode = '';
  state.transactions = [];
  state.jobCount = 0;
  state.avgHourlyRate = 0;
  state.totalPaid = 0;
  state.providers = [];
  state.provider = {};
  state.paypalClientToken = '';
  state.userJobs = [];
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

  [Types.REGISTER_CUSTOMER_REQUEST]: registerCustomerRequest,
  [Types.REGISTER_CUSTOMER_SUCCESS]: registerCustomerSuccess,
  [Types.REGISTER_CUSTOMER_FAILURE]: registerCustomerFailure,

  [Types.REGISTER_PROVIDER_REQUEST]: registerProviderRequest,
  [Types.REGISTER_PROVIDER_SUCCESS]: registerProviderSuccess,
  [Types.REGISTER_PROVIDER_FAILURE]: registerProviderFailure,

  [Types.CREATE_USER_REQUEST]: createUserRequest,
  [Types.CREATE_USER_SUCCESS]: createUserSuccess,
  [Types.CREATE_USER_FAILURE]: createUserFailure,

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

  [Types.GET_TRANSACTIONS_REQUEST]: getTransactionsRequest,
  [Types.GET_TRANSACTIONS_SUCCESS]: getTransactionsSuccess,
  [Types.GET_TRANSACTIONS_FAILURE]: getTransactionsFailure,

  [Types.WITHDRAW_WITH_PAYPAL_REQUEST]: withdrawWithPaypalRequest,
  [Types.WITHDRAW_WITH_PAYPAL_SUCCESS]: withdrawWithPaypalSuccess,
  [Types.WITHDRAW_WITH_PAYPAL_FAILURE]: withdrawWithPaypalFailure,

  [Types.WITHDRAW_WITH_BANK_REQUEST]: withdrawWithBankRequest,
  [Types.WITHDRAW_WITH_BANK_SUCCESS]: withdrawWithBankSuccess,
  [Types.WITHDRAW_WITH_BANK_FAILURE]: withdrawWithBankFailure,

  [Types.DEPOSIT_REQUEST]: depositRequest,
  [Types.DEPOSIT_SUCCESS]: depositSuccess,
  [Types.DEPOSIT_FAILURE]: depositFailure,

  [Types.GET_PAYPAL_CLIENT_TOKEN_REQUEST]: getPaypalClientTokenRequest,
  [Types.GET_PAYPAL_CLIENT_TOKEN_SUCCESS]: getPaypalClientTokenSuccess,
  [Types.GET_PAYPAL_CLIENT_TOKEN_FAILURE]: getPaypalClientTokenFailure,

  [Types.PROCESS_PAYPAL_DEPOSIT_REQUEST]: processPaypalDepositRequest,
  [Types.PROCESS_PAYPAL_DEPOSIT_SUCCESS]: processPaypalDepositSuccess,
  [Types.PROCESS_PAYPAL_DEPOSIT_FAILURE]: processPaypalDepositFailure,

  [Types.GET_NEARBY_PROVIDERS_REQUEST]: getNearbyProvidersRequest,
  [Types.GET_NEARBY_PROVIDERS_SUCCESS]: getNearbyProvidersSuccess,
  [Types.GET_NEARBY_PROVIDERS_FAILURE]: getNearbyProvidersFailure,

  [Types.UPDATE_CUSTOMER_REQUEST]: updateCustomerRequest,
  [Types.UPDATE_CUSTOMER_SUCCESS]: updateCustomerSuccess,
  [Types.UPDATE_CUSTOMER_FAILURE]: updateCustomerFailure,

  [Types.UPDATE_PROVIDER_REQUEST]: updateProviderRequest,
  [Types.UPDATE_PROVIDER_SUCCESS]: updateProviderSuccess,
  [Types.UPDATE_PROVIDER_FAILURE]: updateProviderFailure,

  [Types.GET_CURRENT_USER_REQUEST]: getCurrentUserRequest,
  [Types.GET_CURRENT_USER_SUCCESS]: getCurrentUserSuccess,
  [Types.GET_CURRENT_USER_FAILURE]: getCurrentUserFailure,

  [Types.CHECK_EMAIL_REQUEST]: checkEmailRequest,
  [Types.CHECK_EMAIL_SUCCESS]: checkEmailSuccess,
  [Types.CHECK_EMAIL_FAILURE]: checkEmailFailure,

  [Types.SET_CURRENT_USER]: setCurrentUser,
  [Types.SET_PLAYER_ID]: setPlayerId, 
  [Types.SET_GEO_LOCATION]: setGeoLocation, 
  [Types.SET_ZIPCODE]: setZipcode, 
  [Types.SET_UNREAD_MESSAGE]: setUnreadMessage,
  [Types.RESET_USER]: resetUser,
};

export default createReducer(initialState, actionHandlers);
