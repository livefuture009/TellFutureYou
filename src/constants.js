import Images from './theme/Images'

export const url = 'https://tellfutureyou.herokuapp.com';
export const ONE_SIGNAL_APP_ID = 'a17cbcdf-1034-43a3-ab3e-1b9e0ebe1de6'
export const GOOGLE_API_KEY = 'AIzaSyCGJg6E9WkiiIbbOhAWw_A0wSMS3YKaNBs'
export const GOOGLE_SIGNIN_WEB_CLIENT_ID = '201328401243-k0mkvg80f3f3mgaav2mo39jq9kudusop.apps.googleusercontent.com';
export const GOOGLE_SIGNIN_IOS_CLIENT_ID = '201328401243-vr6ulf2ekum6pesn1p03i5tgec77h0dc.apps.googleusercontent.com';
export const SENDBIRD_APP_ID = '93D0DF90-B1A0-4FEE-9665-6858DE2A0C3E';

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

export const JOB_STATUS = {
  NEW: 0,
  PROGRESSING: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  OFFER_SENT: 4,
};

export const NOTIFICATION_TYPE = {
  SENT_OFFER: 0,
  CANCEL_OFFER: 1,
  ACCEPT_OFFER: 2,
  DECLINE_OFFER: 3,
  COMPLETE_JOB: 4,
  CANCEL_JOB: 5,
  PAY_JOB: 6,
  GIVE_REVIEW: 7,
};

export const PushNotificationTypes = {
  BADGE_UNLOCK: 'BADGE_UNLOCK',
  POST_UPVOTE: 'POST_UPVOTE',
  COMMENT_UPVOTE: 'COMMENT_UPVOTE',
  POST_ANSWER: 'POST_ANSWER',
  NEW_FOLLOWER: 'NEW_FOLLOWER',
  NEW_FOLLOWING_POST: 'NEW_FOLLOWING_POST',
  STREAK_LOST: 'STREAK_LOST',
  MENTION: 'MENTION'
}

export const ServiceList = [
  { id: 1, label: 'Assembly', value: 'Assembly', icon: Images.c_assembly},
  { id: 2, label: 'Auto/Boat', value: 'Auto/Boat', icon: Images.c_auto},
  { id: 3, label: 'Build Your Own Job', value: 'Build Your Own Job', icon: Images.c_build},
  { id: 4, label: 'Cleaning Housekeeping', value: 'Cleaning Housekeeping', icon: Images.c_cleaning},
  { id: 5, label: 'Delivery & Courier', value: 'Delivery & Courier', icon: Images.c_delivery},
  { id: 6, label: 'Handyman', value: 'Handyman', icon: Images.c_handyman},
  { id: 7, label: 'Hourly Help', value: 'Hourly Help', icon: Images.c_hourlyman},
  { id: 8, label: 'Junk Removal', value: 'Junk Removal', icon: Images.c_junkremove},
  { id: 9, label: 'Lawn & Yard', value: 'Lawn & Yard', icon: Images.c_lawn},
  { id: 10, label: 'Moving', value: 'Moving', icon: Images.c_moving},
  { id: 11, label: 'Organization', value: 'Organization', icon: Images.c_orgaination},
  { id: 12, label: 'Painting', value: 'Painting', icon: Images.c_painting},
  { id: 13, label: 'Pet Care', value: 'Pet Care', icon: Images.c_petcare},
  { id: 14, label: 'Seasonal', value: 'Seasonal', icon: Images.c_seasonal},
  { id: 15, label: 'TV Mount & Electronics', value: 'TV Mount & Electronics', icon: Images.c_tv},
];