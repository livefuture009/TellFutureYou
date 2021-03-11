// export const url = 'https://tellfutureyouapp.herokuapp.com';
export const url = 'http://localhost:5000';

export const ONE_SIGNAL_APP_ID = '6c0fae7c-4fd4-4c56-b3c5-ca0fe05353e0'
export const GOOGLE_API_KEY = 'AIzaSyCGJg6E9WkiiIbbOhAWw_A0wSMS3YKaNBs'
export const GOOGLE_SIGNIN_WEB_CLIENT_ID = '389020544990-v7jscnad80i684d8tid52p4i8433t6jk.apps.googleusercontent.com';
export const GOOGLE_SIGNIN_IOS_CLIENT_ID = '389020544990-8uohd3jvl00dvo5c9rao5g9cmvcekocs.apps.googleusercontent.com';
export const SENDBIRD_APP_ID = '83A1D87C-EAA9-460A-AAF9-6D224B27E793';

export const APP_LINK = "https://tellfutureyou.com";
export const IOS_APP_LINK = "https://apps.apple.com/us/app/tellfutureyou/id1535738320";
export const GOOGLE_APP_LINK = "https://tellfutureyou.com";
export const TERMS_LINK = "http://dukeheartaudrey.gadaiweb.com/terms-and-conditions.html";
export const PRIVACY_LINK = "http://dukeheartaudrey.gadaiweb.com/privacy-policy.html";

export const SUBSCRIPTION_STANDARD = "gad.tellfutureyou.org.standard";
export const SUBSCRIPTION_PREMIUM = "gad.tellfutureyou.premium";
export const USER_LEVEL = {
  FREE: 0,
  STANDARD: 1,
  PREMIUM: 2,
};

export const WEB_PAGE_TYPE = {
  TERMS: 1,
  PRIVACY: 2,
};

/**
 * Possible requests status
 */
export const Status = {
  NONE: 'NONE',
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

export const IMAGE_COMPRESS_QUALITY = 50;
export const MAX_IMAGE_WIDTH = 500;
export const MAX_IMAGE_HEIGHT = 1000;
export const TOAST_SHOW_TIME = 2000;
export const RELOAD_GLOBAL_TIME = 20000;
export const PASSWORD_MIN_LENGTH = 8
export const DATE_TIME_FORMAT = 'MMMM DD YYYY, hh:mm A';
export const DATE_FORMAT = 'MMMM DD, YYYY';

export const NOTIFICATION_TYPE = {
    SENT_FRIEND_REQUEST: 1,
    ACCEPT_FRIEND_REQUEST: 2,
    DECLINE_FRIEND_REQUEST: 3,
};

export const CONTACT_STATUS = {
  NONE:             0,
  EXIST_ACCOUNT:    1,
  SENT_REQUEST:     2,
  FRIEND:           3,
  RECEIVE_REQUEST:  4,
};