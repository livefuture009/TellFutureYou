export const url = 'https://tellfutureyou.herokuapp.com';
// export const url = 'http://localhost:5000';

export const ONE_SIGNAL_APP_ID = 'a17cbcdf-1034-43a3-ab3e-1b9e0ebe1de6'
export const GOOGLE_API_KEY = 'AIzaSyCGJg6E9WkiiIbbOhAWw_A0wSMS3YKaNBs'
export const GOOGLE_SIGNIN_WEB_CLIENT_ID = '389020544990-v7jscnad80i684d8tid52p4i8433t6jk.apps.googleusercontent.com';
export const GOOGLE_SIGNIN_IOS_CLIENT_ID = '389020544990-8uohd3jvl00dvo5c9rao5g9cmvcekocs.apps.googleusercontent.com';
export const SENDBIRD_APP_ID = '83A1D87C-EAA9-460A-AAF9-6D224B27E793';

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

export const INVITE_EMAIL_CONTENT = `
<table style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px 'Helvetica Neue',Arial,Helvetica" cellspacing="0" cellpadding="0" border="0">
    <tbody>
    <tr width="100%">
        <td style="background:#f0f0f0;font:15px 'Helvetica Neue',Arial,Helvetica" valign="top" align="left">
            <table style="border:none;padding:0 18px;margin:50px auto;width:500px">
                <tbody>
                <tr width="100%" height="57">
                    <td style="border-top-left-radius:4px;border-top-right-radius:4px;background:#d7c120;text-align:center" valign="top" align="left">
                    <img src="https://tellfutureyoubucket.s3-us-west-2.amazonaws.com/icon200.png" title="TellFutureYou" style="font-weight:bold;font-size:18px;color:#fff;vertical-align:top" class="CToWUd" width="70" height="70"> </td>
                </tr>

                <tr width="100%">
                    <td style="border-bottom-left-radius:4px;border-bottom-right-radius:4px;background:#fff;padding:30px 20px" valign="top" align="left">
                        <h1 style="font-size:20px;margin:0;color:#333">Hello {{receiver}}, </h1>
                        <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333"><span style="font-weight: bold;">{{sender}}</span> invited you to use <b>TellFutureYou app</b>. <br/><br/>Please download the app in <a href="https://apps.apple.com/us/app/chatapp-meet-new-people/id767196673">here</a> and start chatting.</p>
                    </td>                
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>
`;