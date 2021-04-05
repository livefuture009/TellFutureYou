import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  StatusBar,
  Platform
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import PushNotification from "react-native-push-notification"
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import SplashScreen from 'react-native-splash-screen'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import OneSignal from 'react-native-onesignal';
import SendBird from 'sendbird';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';
import FormInput from '../components/FormInput'
import RoundButton from '../components/RoundButton'
import Button from '../components/Button'
import Label from '../components/Label'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import {isValidEmail, checkInternetConnectivity} from '../functions'
import { NOTIFICATION_TYPE } from '../constants'
import LoadingOverlay from '../components/LoadingOverlay'
import Messages from '../theme/Messages'
import Images from '../theme/Images'
import Colors from '../theme/Colors'

import { 
  TOAST_SHOW_TIME, 
  ONE_SIGNAL_APP_ID, 
  GOOGLE_SIGNIN_WEB_CLIENT_ID,
  GOOGLE_SIGNIN_IOS_CLIENT_ID,
  SENDBIRD_APP_ID,
  Status 
} from '../constants.js'
import actionTypes from '../actions/actionTypes';
import * as Storage from '../services/Storage'
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';

var sb = new SendBird({ appId: SENDBIRD_APP_ID });

class LoginScreen extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      remember: false,
      isLoading: false,
      onesignalUserId: '',
    }
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      StatusBar.setBarStyle('dark-content', true);
    });

    this.initPush();

    GoogleSignin.configure({
      scopes: [], 
      webClientId: GOOGLE_SIGNIN_WEB_CLIENT_ID,
      offlineAccess: true,
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', 
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId: GOOGLE_SIGNIN_IOS_CLIENT_ID,
    });
    this.restoreUser();
  }

  async restoreUser() {
    // Update User ID.
    const user_id = await Storage.USERID.get();
    if (user_id && user_id.length > 0) {
      this.props.dispatch({
        type: actionTypes.RESTORE_USER,
        user_id: user_id
      });
    } else {
     SplashScreen.hide();
    }
  }

  componentWillUnmount() {
    this.focusListener();
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.loginUserStatus != this.props.loginUserStatus) {
      if (this.props.loginUserStatus == Status.SUCCESS) {
        this.loginSuccess();
      } else if (this.props.loginUserStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    if (prevProps.loginWithSocialStatus != this.props.loginWithSocialStatus) {
      if (this.props.loginWithSocialStatus == Status.SUCCESS) {
        this.loginWithSocialSuccess();
      } else if (this.props.loginWithSocialStatus == Status.FAILURE) {
        this.onFailure();
      } 
    }

    if (prevProps.restoreUserStatus != this.props.restoreUserStatus) {
      if (this.props.restoreUserStatus == Status.SUCCESS && this.props.currentUser && this.props.currentUser._id) {
        this.onMoveHome(false);
      } else if (this.props.restoreUserStatus == Status.FAILURE) {
        SplashScreen.hide();
      }
    }
  }

  initPush() {
    const _SELF = this;
    OneSignal.init(ONE_SIGNAL_APP_ID);
    OneSignal.inFocusDisplaying(2);   // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        _SELF.processLocalNotification(notification);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action);

        // process the action
        _SELF.processLocalNotification(notification);
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  }

  processLocalNotification(notification) {
    console.log("notification: ", notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);

    if (notification.data && notification.data.isSelf) {
      const { currentUser } = this.props;
      if (currentUser && currentUser._id) {
        const {index, routes} = this.props.navigation.dangerouslyGetState();
        const currentRoute = routes[index].name;
        console.log("currentRoute: ", currentRoute);

        if (currentRoute == "SavedMessage") {
          console.log("step 1");
          this.props.dispatch({
            type: actionTypes.GET_SELF_MESSAGE,
            data: {
              userId: currentUser._id
            },
          });
        }
        else if (currentRoute == "ScheduleMessage") {
          console.log("step 2");
          this.props.dispatch({
            type: actionTypes.GET_SCHEDULED_SELF_MESSAGE,
            data: {
              userId: currentUser._id,
            }
          });
        }
        else {
          console.log("step 3");
          this.props.navigation.navigate('SavedMessage');
        }
      }
    }
  }

  onReceived=(notification)=> {
    const { currentUser } = this.props;
    if (currentUser && currentUser._id) {

      // Get Unread Number for notification.
      const user_id = this.props.currentUser._id;
      this.props.dispatch({
        type: actionTypes.GET_UNREADNUMBER,
        user_id: user_id,
      });

      // Update My Notifications.
      this.props.dispatch({
        type: actionTypes.GET_MY_NOTIFICATIONS,
        user_id: user_id,
      });  
    }
  }

  onOpened = (openResult) => {
  }

  onMoveNotificationPage(notification_type, job) {
    if (notification_type == NOTIFICATION_TYPE.SENT_FRIEND_REQUEST) {
      this.props.navigation.navigate("FriendStack");
      this.props.dispatch({
        type: actionTypes.CHANGE_FRIEND_ACTIVE_PAGE,
        page: 2,
      }); 
    }
    else if (notification_type == NOTIFICATION_TYPE.ACCEPT_FRIEND_REQUEST) {
      this.props.navigation.navigate("FriendStack");
      this.props.dispatch({
        type: actionTypes.CHANGE_FRIEND_ACTIVE_PAGE,
        page: 0,
      }); 
    }
    else if (notification_type == NOTIFICATION_TYPE.DECLINE_FRIEND_REQUEST) {
      this.props.navigation.navigate("ContactStack");
    }

    setTimeout(() => {
      this.props.dispatch({
        type: actionTypes.RESET_FRIEND_PAGE,
      });
    }, 1000);
  }

  onIds = (device) => {
    if (device) {
      this.props.dispatch({
        type: actionTypes.SET_PLAYER_ID,
        payload: device.userId
      });
    }
  }

  connectSendBird() {
    const currentUser = this.props.currentUser;
    var _SELF = this;

    return new Promise(function(resolve, reject) {
      if (sb && currentUser._id != "undefined" && currentUser._id?.length > 0) {
        const userId = currentUser._id;
        const username = currentUser.firstName + " " + currentUser.lastName;
        var profileUrl = '';
        if (currentUser.avatar && currentUser.avatar.length > 0) {
          profileUrl = currentUser.avatar;
        }
        
        if (userId) {
          sb.connect(userId, function (user, error) {
            if (_SELF.props.pushToken && _SELF.props.pushToken.length > 0) {
              if (Platform.OS === 'ios') {
                sb.registerAPNSPushTokenForCurrentUser(_SELF.props.pushToken, function(result, error) {
                });
              } else {
                sb.registerGCMPushTokenForCurrentUser(_SELF.props.pushToken, function(result, error) {
                });
              }
            }     
            sb.updateCurrentUserInfo(username, profileUrl, function(response, error) {
            });
  
            sb.getTotalUnreadMessageCount(function(number, error) {
              _SELF.props.dispatch({
                type: actionTypes.SET_UNREAD_MESSAGE,
                number: number
              });
            });
  
            var UserEventHandler = new sb.UserEventHandler();
            UserEventHandler.onTotalUnreadMessageCountUpdated = function(totalCount, countByCustomTypes) {
              _SELF.props.dispatch({
                type: actionTypes.SET_UNREAD_MESSAGE,
                number: totalCount
              });
            };
            sb.addUserEventHandler("USER_EVENT_HANDLER", UserEventHandler);
            resolve();
          });
        }    
      }
    });
  }

  async onMoveHome(animate) {
    StatusBar.setBarStyle('light-content', true);

    await this.connectSendBird();
    const { currentUser } = this.props;

    // Move Next Page.
    var nextScreen = "MainTab"
    this.props.navigation.navigate(nextScreen);

    const user_id = currentUser._id;
    this.props.dispatch({
      type: actionTypes.GET_UNREADNUMBER,
      user_id: user_id,
    }); 

    // Reset Page.
    this.setState({isLoading: false, email: '', password: ''});

    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }

  onLogin() {
    this.setState({errorMessage: null});

    Keyboard.dismiss();

    let email = this.state.email.trim();
    let password = this.state.password.trim();

    var isValid = true;
    if (email == null || email.length <= 0 || !isValidEmail(email)) {
      this.setState({emailError: Messages.InvalidEmail});
      isValid = false;
    }

    if (password == null || password.length <= 0) {
      this.setState({passwordError: Messages.InvalidPassword});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.LOGIN_USER,
          email: email,
          password: password,
          player_id: this.props.playerId,
          lat: this.props.lat,
          lng: this.props.lng,
        });
      });      
    }
  }

  onForgotPassword() {
    Keyboard.dismiss();
    this.props.navigation.navigate('ForgotPassword');        
  }

  async onApple() {
    const _SELF = this;
    Keyboard.dismiss();

    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      var appleUsers = await Storage.APPLE_USERS.get();
      // performs login 
      if (appleAuth.isSupported) {
        try {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          });
    
          // get current authentication state for user
          const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
          console.log("appleAuthRequestResponse: ", appleAuthRequestResponse);

          // use credentialState response to ensure the user is authenticated
          if (credentialState === appleAuth.State.AUTHORIZED) {
            var socialId = '';
            var socialType = 'apple';
            var firstName = '';
            var lastName = '';
            var email = '';
            var avatar = '';
            
            if (appleAuthRequestResponse.user) {
              socialId = appleAuthRequestResponse.user;
            }

            if (appleAuthRequestResponse.fullName) {
              firstName = appleAuthRequestResponse.fullName.givenName;
              lastName = appleAuthRequestResponse.fullName.familyName;
            } 

            if (appleAuthRequestResponse.email) {
              email = appleAuthRequestResponse.email;  
            } 

            var user = {
              socialId,
              socialType,
              firstName,
              lastName,
              email,
              avatar,
            };
            if (appleUsers && appleUsers.length > 0) {
              var isExisting = false;
              appleUsers.forEach(item => {
                if (item.socialId == user.socialId) {
                  user = item;
                  isExisting = true;
                  return;
                }
              });

              if (!isExisting) {
                appleUsers.push(user);
              }
            } else {
              appleUsers = [user];
            }

            Storage.APPLE_USERS.set(appleUsers);
            _SELF.props.dispatch({
              type: actionTypes.LOGIN_WITH_SOCIAL,
              user: user,
              player_id: _SELF.props.playerId,
            });
          }
        } catch (error) {
          console.log("error: ", error);
          this.toast.show('Apple sign in has been cancelled.', TOAST_SHOW_TIME);
        }
      } else {
        this.toast.show('AppleAuth is not supported on the device.', TOAST_SHOW_TIME);
      }
    } else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  async onGoogle() {
    const _SELF = this;
    Keyboard.dismiss();

    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      this.setState({isLoading: true, errorMessage: null});

      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
  
        const user = userInfo.user;
        var socialId = '';
        var socialType = 'google';
        var firstName = "";
        var lastName = "";
        var email = "";
        var avatar = "";
  
        
        if (user.id) {
          socialId = user.id;
        }
  
        if (user.photo) {
          avatar = user.photo;
        }
  
        if (user.givenName) {
          firstName = user.givenName;
        }
  
        if (user.familyName) {
          lastName = user.familyName;
        }
  
        if (user.email) {
          email = user.email;
        }
  
        let new_user = {
          socialId,
          socialType,
          firstName,
          lastName,
          email,
          avatar,
        };
  
        _SELF.props.dispatch({
          type: actionTypes.LOGIN_WITH_SOCIAL,
          user: new_user,
          player_id: _SELF.props.playerId,
          lat: _SELF.props.lat,
          lng: _SELF.props.lng,
        });
  
      } catch (error) {
        _SELF.setState({isLoading: false});
        _SELF.toast.show("Google Login has been cancelled.", TOAST_SHOW_TIME);      
  
        console.log("error = ",error);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (f.e. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
        } else {
          // some other error happened
        }
      }      
    } else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  async onFB() {
    Keyboard.dismiss();
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      this.setState({isLoading: true, errorMessage: null});
      const _SELF = this;
      LoginManager.logInWithPermissions(["public_profile", "email"]).then(
        function(result) {
          if (result.isCancelled) {
            _SELF.setState({isLoading: false});
            _SELF.toast.show('Facebook Login has been cancelled', TOAST_SHOW_TIME);
          } else {
            AccessToken.getCurrentAccessToken().then((token) => {
              let accessToken = token.accessToken;
              const responseCallback = (error, result) => {
                if (error) {
                  _SELF.setState({isLoading: false});
                  _SELF.toast.show(error, TOAST_SHOW_TIME);
                } else {
                  var socialId = '';
                  var socialType = 'facebook';
                  var firstName = '';
                  var lastName = '';
                  var email = '';
                  var avatar = '';
  
                  if (result.id) {
                    socialId = result.id;
                  }
  
                  if (result.first_name) {
                    firstName = result.first_name;  
                  } 
  
                  if (result.last_name) {
                    lastName = result.last_name;  
                  }
  
                  if (result.email) {
                    email = result.email;  
                  } 
  
                  if (result.picture && result.picture.data && result.picture.data.url) {
                    avatar = result.picture.data.url;  
                  } 
  
                  let user = {
                    socialId,
                    socialType,
                    firstName,
                    lastName,
                    email,
                    avatar,
                  };
  
                  _SELF.props.dispatch({
                    type: actionTypes.LOGIN_WITH_SOCIAL,
                    user: user,
                    player_id: _SELF.props.playerId,
                    lat: _SELF.props.lat,
                    lng: _SELF.props.lng,
                  });
                }
              }
              const profileRequest = new GraphRequest(
                '/me?fields=id,first_name,last_name,name,picture.type(large),email,gender',
                null,
                responseCallback,
              );
              new GraphRequestManager().addRequest(profileRequest).start();
            });
          }
        },
        function(error) {
          _SELF.setState({isLoading: false});
          _SELF.toast.show('Facebook Login has been failed.', TOAST_SHOW_TIME);
        }
      );
    } else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }
  
  onRegister() {
    Keyboard.dismiss();
    this.props.navigation.navigate('SignUp');
  }

  async loginSuccess() {
    Storage.USERID.set(this.props.currentUser._id);
    this.onMoveHome(true);
  }

  async loginWithSocialSuccess() {
    if (this.props.needToSignUp) {
      this.setState({isLoading: false});
      this.props.navigation.navigate('SignUp', {user: this.props.currentUser});
    } 
    else {
      Storage.USERID.set(this.props.currentUser._id);
      this.onMoveHome(true);
    }
  }

  onChangeEmail = (text) => {
    if (text && text != "" && isValidEmail(text)) {
      this.setState({email: text, emailError: null});
    } else {
      this.setState({email: text})
    }    
  }
  
  onFailure() {
    this.setState({isLoading: false});
    this.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.container}>
            <KeyboardAwareScrollView>
            <View style={styles.contentView}>
              <Image 
                style={styles.logoImage}
                source={Images.logo01}
              />

              <View style={styles.formView}>
                <FormInput
                  label="Your Email"
                  placeholder="David@email.com" 
                  type="email"
                  value={this.state.email} 
                  errorMessage={this.state.emailError}
                  returnKeyType="next"                                       
                  onSubmitEditing={() => { this.passwordInput.focus() }}
                  onChangeText={(text) => this.setState({email: text, emailError: null})} />

                <FormInput
                  label="Password"
                  placeholder="***********" 
                  type="password"
                  returnKeyType="done"
                  showPassword={true}
                  value={this.state.password} 
                  errorMessage={this.state.passwordError}
                  onRefInput={(input) => { this.passwordInput = input }}
                  onChangeText={(text) => this.setState({password: text, passwordError: null})} 
                  onSubmitEditing={() => { this.onLogin() }}
                />

                <View style={{alignItems: 'flex-end'}}>
                  <Button title="Forgot Password?" underline={true} onPress={() => this.onForgotPassword()}/>
                </View>

                <View style={[styles.centerView, {marginTop: 0}]}>
                  <RoundButton 
                    title="Login" 
                    theme="blue" 
                    style={styles.loginButton} 
                    onPress={() => this.onLogin()} />
                </View>

                <View style={styles.socialView}>
                  <TouchableOpacity style={styles.socialButton} onPress={() => this.onGoogle()}>
                    <Image 
                      style={styles.socialIcon}
                      source={Images.btn_google_plus}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton} onPress={() => this.onFB()}>
                    <Image 
                      style={styles.socialIcon}
                      source={Images.btn_facebook}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {
                  Platform.OS === 'ios' && 
                    <AppleButton
                      buttonStyle={AppleButton.Style.BLACK}
                      buttonType={AppleButton.Type.SIGN_IN}
                      style={{
                        marginTop: 25,
                        width: '70%',
                        height: 45,
                      }}
                      onPress={() => this.onApple()}
                    />
              }
            </View>
            <View style={styles.bottomView}>
              <Label title="New User?"></Label>
              <Button title="Register Here" style={{marginLeft: 5}} bold={true} onPress={() => this.onRegister()}/>
            </View>
            </KeyboardAwareScrollView>
          </View>
        </SafeAreaView>
        <Toast ref={ref => (this.toast = ref)}/>
        { this.state.isLoading && <LoadingOverlay /> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentView: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    ...ifIphoneX({
      marginTop: 20,
    }, {
      marginTop: 0,
    }),
  },

  logoImage: {
    width: 270,
    height: 225,
    resizeMode: 'contain',
  },

  formView: {
    width: '100%',    
    ...ifIphoneX({
      marginTop: 70,
    }, {
      marginTop: 20,
    }),
  },

  loginButton: {
    marginTop: 25,
    width: '95%',
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  centerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  socialView: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  socialButton: {
    marginLeft: 15,
    marginRight: 15,
  },

  socialIcon: {
    width: 44,
    height: 44,
  },

  bottomView: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
})


function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
    needToSignUp: state.user.needToSignUp,
    errorMessage: state.user.errorMessage,
    playerId: state.user.playerId,
    loginUserStatus: state.user.loginUserStatus,
    loginWithSocialStatus: state.user.loginWithSocialStatus,    
    markReadNotificationStatus: state.notifications.markReadNotificationStatus,
    restoreUserStatus: state.user.restoreUserStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginScreen);