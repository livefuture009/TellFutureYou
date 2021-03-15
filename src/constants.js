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

export const QUOTE_LIST = [
  {
    content: `Anyone who has ever made anything of importance was disciplined.`,
    author: 'Andrew Hendrixson',
  },
  {
    content: `Don't spend time beating on a wall, hoping to transform it into a door.`,
    author: 'Coco Chanel',
  },
  {
    content: `Creativity is intelligence having fun.`,
    author: 'Albert Einstein',
  },
  {
    content: `Optimism is the one quality more associated with success and happiness than any other.`,
    author: 'Brian Tracy',
  },
  {
    content: `Always keep your eyes open. Keep watching. Because whatever you see can inspire you.`,
    author: 'Grace Coddington',
  },
  {
    content: `What you get by achieving your goals is not as important as what you become by achieving your goals.`,
    author: 'Henry David Thoeau',
  },
  {
    content: `If the plan doesn't work, change the plan, but never the goal.`,
    author: 'Tebec Tyson',
  },
  {
    content: `I destroy my enemies when I make them my friends.`,
    author: 'Abraham Lincoln',
  },
  {
    content: `Don't live the same year 75 times and call it a life.`,
    author: 'Robin Sharma',
  },
  {
    content: `You cannot save people, you can just love them.`,
    author: 'Anais Nin',
  },
  {
    content: `It wasn't raining when Noah built the ark.`,
    author: 'Howard Ruff',
  },
  {
    content: `Take your dreams seriously.`,
    author: 'Sophia Cunningham',
  },
  {
    content: `There is no way to happiness. Happiness is the way.`,
    author: 'Thich Nhat Hanh',
  },
  {
    content: `Holding onto anger is like drinking poison and expecting the other person to die.`,
    author: 'Buddha',
  },
  {
    content: `Champions keep playing until they get it right.`,
    author: 'Billie Jean King',
  },
  {
    content: `You will succeed because most people are lazy.`,
    author: 'Shahir Zag',
  },
  {
    content: `Genius is 1% inspiration, and 99% perspiration.`,
    author: 'Thomas Edison',
  },
  {
    content: `A comfort zone is a beautiful place, but nothing ever grows there.`,
    author: 'Author Unknown',
  },
  {
    content: `You must be the change you wish to see in the world.`,
    author: 'Mahatma Gandhi',
  },
  {
    content: `Numbing the pain for a while will only make it worse when you finally feel it.`,
    author: 'Albus Dumledore',
  },
  {
    content: `Do it with passion, or not at all.`,
    author: 'Rosa Nouchette Carey',
  },
  {
    content: `If you want to live a happy life, tie it to a goal, not to people or objects.`,
    author: 'Albert Einstein',
  },
  {
    content: `The grass is greener where you water it.`,
    author: 'Neil Barringham',
  },
  {
    content: `Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway.`,
    author: 'Earl Nightingale',
  },
  {
    content: `Instead of wondering when your next vacation is, maybe you should set up a life you don't need to escape from.`,
    author: 'Seth Godin',
  },
  {
    content: `If it scares you, it might be a good thing to try.`,
    author: 'Seth Godin',
  },
  {
    content: `Sometimes you win, sometimes you learn.`,
    author: 'John Maxwell',
  },
  {
    content: `Never apologize for having high standards. People who really want to be in your life will rise up to meet them.`,
    author: 'Ziad K. Abdelnour',
  },
  {
    content: `I never dream of success. I worked for it.`,
    author: 'Estee Lauder',
  },
  {
    content: `Avoiding failure is to avoid progress.`,
    author: 'Author Unknown',
  },
  {
    content: `When ordinary people decide to step out and be part of something big, that's when they become extraordinary.`,
    author: 'Brett Harrid',
  },
  {
    content: `Inspiration responds to our attentiveness in various and sometimes unexpected ways.`,
    author: 'Wayne Dyer',
  },
  {
    content: `Words can inspire, thoughts can provoke, but only action truly brings you closer to your dreams.`,
    author: 'Brad Sugars',
  },
  {
    content: `Having a specific meaning and purpose in your life helps to encourage you towards living a fulfilling and inspired life.`,
    author: 'Vic Johnson',
  },
  {
    content: `One must not focus on the risk of saying, "Yes." The greater risk is missing opportunities by saying "No."`,
    author: 'Charles Sullivan',
  },
  {
    content: `When you see the world through serene eyes, you generate peace wherever you go.`,
    author: 'Bob David',
  },
  {
    content: `Embrace the present moment fully and with passion, because only through the present moment do we truly live.`,
    author: 'Richard Haight',
  },
  {
    content: `You are always stronger and more resourceful than you give yourself credit for.`,
    author: 'Rob Moore',
  },
  {
    content: `Whenever you see a successful business, someone once made a courageous decision.`,
    author: 'Peter Drucker',
  },
  {
    content: `It is life's principle and you have to accept it as it comes; Nothing happens when nothing is done.`,
    author: 'Israelmore Ayivor',
  },
];