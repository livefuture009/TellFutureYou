import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Platform
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
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

import LoadingOverlay from '../components/LoadingOverlay'
import Messages from '../theme/Messages'
import Images from '../theme/Images'
import Colors from '../theme/Colors'

import { 
  TOAST_SHOW_TIME, 
  ONE_SIGNAL_APP_ID, 
  RELOAD_GLOBAL_TIME, 
  NOTIFICATION_TYPE, 
  GOOGLE_SIGNIN_WEB_CLIENT_ID,
  GOOGLE_SIGNIN_IOS_CLIENT_ID,
  SENDBIRD_APP_ID,
  Status 
} from '../constants.js'
import actionTypes from '../actions/actionTypes';
import * as Storage from '../services/Storage'
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

var sb = new SendBird({ appId: SENDBIRD_APP_ID });

class LoginScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  notification_type = -1;
  constructor(props) {
    super(props)
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
    this.loadGlobalData();
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

    if (prevProps.getJobStatus != this.props.getJobStatus) {
      if (this.props.getJobStatus == Status.SUCCESS) {
        this.getJobSuccess();
      } else if (this.props.getJobStatus == Status.FAILURE) {
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

  loadGlobalData() {
    this.props.dispatch({
      type: actionTypes.GET_GLOBAL_INFO,
    });

    this.props.dispatch({
      type: actionTypes.GET_AVAILABILITIES,
    });

    this.props.dispatch({
      type: actionTypes.GET_RATES,
    });

    this.props.dispatch({
      type: actionTypes.GET_SERVICES,
    });
  }

  initPush() {
    OneSignal.init(ONE_SIGNAL_APP_ID);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  onReceived=(notification)=> {
    console.log("Notification received: ", notification);
    const { currentUser } = this.props;
    if (currentUser && currentUser._id) {
      const user_id = this.props.currentUser._id;
      this.props.dispatch({
        type: actionTypes.GET_UNREADNUMBER,
        user_id: user_id,
      });
    }
  }

  onOpened = (openResult) => {
    if (openResult.notification.payload.additionalData) {
      const notification_type = openResult.notification.payload.additionalData.notification_type;
      const notification_id = openResult.notification.payload.additionalData.notification_id;
      const job_id = openResult.notification.payload.additionalData.job_id;  
      const receiver_type = openResult.notification.payload.additionalData.receiver_type;  

      if (this.props.currentUser && this.props.currentUser.type == receiver_type) {
        this.notification_type = notification_type;

        // Mark Read for selected notification.
        this.props.dispatch({
          type: actionTypes.MARK_READ_NOTIFICATION,
          notification_id: notification_id,
        }); 

        // Get Job.
        this.props.dispatch({
          type: actionTypes.GET_JOB,
          job_id: job_id,
        }); 
      }
    }
  }

  onMoveNotificationPage(notification_type, job) {
    if (notification_type == NOTIFICATION_TYPE.SENT_OFFER) {
      if (job.status >= JOB_STATUS.PROGRESSING) {
        this.props.navigation.navigate('ProviderOrderDetail', {job: job});
      } else {
        this.props.navigation.navigate('ProviderJobDetail', {job: job});
      }      
    } else if (notification_type == NOTIFICATION_TYPE.CANCEL_OFFER) {
      this.props.navigation.navigate('ProviderOrderDetail', {job: job});
    } else if (notification_type == NOTIFICATION_TYPE.ACCEPT_OFFER) {
      this.props.navigation.navigate('CustomerJobDetail', {job: job, needRefresh: true});
    } else if (notification_type == NOTIFICATION_TYPE.DECLINE_OFFER) {
      this.props.navigation.navigate('CustomerJobDetail', {job: job, needRefresh: true});
    } else if (notification_type == NOTIFICATION_TYPE.COMPLETE_JOB) {
      this.props.navigation.navigate('ProviderOrderDetail', {job: job});
    } else if (notification_type == NOTIFICATION_TYPE.CANCEL_JOB) {
      this.props.navigation.navigate('ProviderOrderDetail', {job: job});
    } else if (notification_type == NOTIFICATION_TYPE.PAY_JOB) {
      this.props.navigation.navigate('ProviderOrderDetail', {job: job});
    } else if (notification_type == NOTIFICATION_TYPE.GIVE_REVIEW) {
      this.props.navigation.navigate('ProviderOrderDetail', {job: job});
    } 
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

    if (sb && currentUser._id != "undefined" && currentUser._id?.length > 0) {
      const userId = currentUser._id;
      const username = currentUser.firstName + " " + currentUser.lastName;
      var profileUrl = '';
      if (currentUser.avatar && currentUser.avatar.length > 0) {
        profileUrl = currentUser.avatar;
      }
      
      if (userId) {
        var _SELF = this;
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
        });
      }    
    }
  }

  getUnreadMessageCount() {
    if (sb && sb.currentUser) {
      var _SELF = this;
      var listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
      listQuery.includeEmpty = true;
      listQuery.next(function(response, error) {
        _SELF.setState({isLoading: false, isFirst: false});
        if (response) {
          var unReadCount = 0;
          for (var i = 0; i < response.length; i++) {
            var channel = response[i];
            if (channel.members.length >= 2) {
              unReadCount += channel.unreadMessageCount;
            }
          }

          _SELF.props.dispatch({
            type: actionTypes.SET_UNREAD_MESSAGE,
            number: unReadCount
          });
        }
      });
    }
  }

  getUnreadNotificationCount() {
    const { currentUser } = this.props;
    if (currentUser) {
      this.props.dispatch({
        type: actionTypes.GET_UNREADNUMBER,
        user_id: currentUser._id
      });
    }
  }

  async onMoveHome(animate) {
    const { currentUser } = this.props;

    // Reset Page.
    this.setState({isLoading: false, email: '', password: ''});    

    // Move Next Page.
    var nextScreen = ""
    if (currentUser.type == "customer") {
      nextScreen = "CustomerTab";
    } else {
      nextScreen = "ProviderTab";
    }

    this.props.navigation.navigate(nextScreen);
    setInterval(() => {
      SplashScreen.hide();    

      // Get Unread Messages and Notification Count.
      this.getUnreadMessageCount();
      this.getUnreadNotificationCount();

    }, 1000);

    this.connectSendBird();

    const user_id = currentUser._id;
    this.props.dispatch({
      type: actionTypes.GET_UNREADNUMBER,
      user_id: user_id,
    }); 
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
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
          });
    
          // get current authentication state for user
          const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
          
          // use credentialState response to ensure the user is authenticated
          if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
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
          this.refs.toast.show('Apple sign in has been cancelled.', TOAST_SHOW_TIME);
        }
      } else {
        this.refs.toast.show('AppleAuth is not supported on the device.', TOAST_SHOW_TIME);
      }
    } else {
      this.refs.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
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
        _SELF.refs.toast.show("Google Login has been cancelled.", TOAST_SHOW_TIME);      
  
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
      this.refs.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
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
            _SELF.refs.toast.show('Facebook Login has been cancelled', TOAST_SHOW_TIME);
          } else {
            AccessToken.getCurrentAccessToken().then((token) => {
              let accessToken = token.accessToken;
              const responseCallback = (error, result) => {
                if (error) {
                  _SELF.setState({isLoading: false});
                  _SELF.refs.toast.show(error, TOAST_SHOW_TIME);
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
          _SELF.refs.toast.show('Facebook Login has been failed.', TOAST_SHOW_TIME);
        }
      );
    } else {
      this.refs.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }
  
  onRegister() {
    Keyboard.dismiss();
    this.props.navigation.navigate('SelectUserType');
  }

  getJobSuccess() {
    this.onMoveNotificationPage(this.notification_type, this.props.job);
  }

  async loginSuccess() {
    this.setState({isLoading: false});
    Storage.USERID.set(this.props.currentUser._id);
    this.onMoveHome(true);
  }

  async loginWithSocialSuccess() {
    this.setState({isLoading: false});
    if (this.props.needToSignUp) {
      this.props.navigation.navigate('SelectUserType', {user: this.props.currentUser});
    } else {
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
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
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
                   placeholder="Email Address" 
                   type="email"
                   prefixIcon="email"
                   placeholderTextColor="#939393"
                   value={this.state.email} 
                   errorMessage={this.state.emailError}
                   returnKeyType="next"                                       
                   onSubmitEditing={() => { this.passwordInput.focus() }}
                   onChangeText={this.onChangeEmail} />

                <FormInput
                   placeholder="Password" 
                   type="password"
                   prefixIcon="password"
                   placeholderTextColor="#939393"
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
        <Toast ref="toast"/>
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
      marginTop: 80,
    }, {
      marginTop: 0,
    }),
  },

  logoImage: {
    width: 200,
    height: 200,
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
    job: state.jobs.job,
    loginUserStatus: state.user.loginUserStatus,
    loginWithSocialStatus: state.user.loginWithSocialStatus,    
    markReadNotificationStatus: state.notifications.markReadNotificationStatus,
    getJobStatus: state.jobs.getJobStatus,
    restoreUserStatus: state.user.restoreUserStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginScreen);