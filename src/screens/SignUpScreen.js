import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Dimensions
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SendBird from 'sendbird';
import PageLabel from '../components/PageLabel'
import FormInput from '../components/FormInput'
import Button from '../components/Button'
import CheckBox from '../components/CheckBox'
import Label from '../components/Label'
import RoundButton from '../components/RoundButton'
import Messages from '../theme/Messages'
import LoadingOverlay from '../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status, PASSWORD_MIN_LENGTH, SENDBIRD_APP_ID, WEB_PAGE_TYPE } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import * as Storage from '../services/Storage'
import { isValidEmail } from '../functions'
import Colors from '../theme/Colors'

var sb = new SendBird({ appId: SENDBIRD_APP_ID });
const screenHeight = Math.round(Dimensions.get('window').height);

class SignUpScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,

      socialId: null,
      socialType: '',
      avatar: '',

      firstNameError: '',
      lastNameError: '',
      emailError: '',
      phoneError: '',
      passwordError: '',
      confirmPasswordError: '',
    }
  }

  componentDidMount() {
    if (this.props.route.params) {
      const { user } = this.props.route.params;  
      if (user) {
        if (user.socialId) {
          this.setState({socialId: user.socialId});
        }
  
        if (user.socialType) {
          this.setState({socialType: user.socialType});
        }
  
        if (user.firstName) {
          this.setState({firstName: user.firstName});
        }
  
        if (user.lastName) {
          this.setState({lastName: user.lastName});
        }
  
        if (user.email) {
          this.setState({email: user.email});
        }
  
        if (user.avatar) {
          this.setState({avatar: user.avatar});
        }
      }
    }
  }

  componentWillUnmount() {

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.registerUserStatus != this.props.registerUserStatus) {
      if (this.props.registerUserStatus == Status.SUCCESS) {
        this.registerUserSuccess();
      } else if (this.props.registerUserStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onTerms=()=> {
    this.props.navigation.navigate('Terms', {page: WEB_PAGE_TYPE.TERMS});
  }

  async onMoveHome() {
    StatusBar.setBarStyle('light-content', true);
    await this.connectSendBird();
    this.setState({isLoading: false});
    this.props.navigation.navigate("MainTab");
  }

  onLogin() {
    this.props.navigation.goBack();
  }

  onRegister() {
    Keyboard.dismiss();

    var isValid = true;
    const {
      firstName, 
      lastName,
      email,
      phone,
      socialId, 
      socialType,
      password,
      confirmPassword,
      avatar,
      agreeTerms,
    } = this.state;

    if (firstName == null || firstName.length == 0) {
      this.setState({firstNameError: Messages.InvalidFirstname});
      isValid = false;
    }

    if (lastName == null || lastName.length == 0) {
      this.setState({lastNameError: Messages.InvalidLastname});
      isValid = false;
    }

    if (email == null || email.length <= 0 || !isValidEmail(email)) {
      this.setState({emailError: Messages.InvalidEmail});
      isValid = false;
    }

    if (phone == null || phone.length == 0) {
      this.setState({phoneError: Messages.InvalidPhone});
      isValid = false;
    }

    if (socialId === null || socialId === "") {
      if (password == null || password.length == 0) {
        this.setState({passwordError: Messages.InvalidPassword});
        isValid = false;
      } 
      else if (password.length < PASSWORD_MIN_LENGTH) {
        this.setState({passwordError: Messages.ShortPasswordError});
        isValid = false;
      }

      if (confirmPassword == null || confirmPassword.length == 0) {
        this.setState({confirmPasswordError: Messages.InvalidConfirmPassword});
        isValid = false;
      } else if (confirmPassword != password) {
        this.setState({confirmPasswordError: Messages.InvalidPasswordNotMatch});
        isValid = false;
      }
    }

    if (!agreeTerms) {
      this.toast.show(Messages.InvalidTerms, TOAST_SHOW_TIME);    
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.REGISTER_USER,
          user: {
            firstName,
            lastName,
            email,
            phone,
            password,
            confirmPassword,
            avatar,
            socialId,
            socialType,
            playerId: this.props.playerId,
          }
        });
      });      
    }    
  }

  async registerUserSuccess() {
    Storage.USERID.set(this.props.currentUser._id);
    this.onMoveHome();
  }

  onFailure() {
    this.setState({isLoading: false});
    this.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);    
  }

  connectSendBird() {
    const currentUser = this.props.currentUser;
    console.log("connectSendBird: ", currentUser);
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

  render() {
    const { 
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      socialId,

      firstNameError,
      lastNameError,
      emailError,
      phoneError,
      passwordError,
      confirmPasswordError,

    } = this.state;

    var editable = true;
    if (socialId && socialId.length > 0) {
      editable = false;
    }
    

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <View style={styles.container}>
          <KeyboardAwareScrollView>          
            <PageLabel text="Register" style={{paddingHorizontal: 30}} />
            <View style={styles.formView}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <FormInput
                    label="First Name"
                    placeholder="David" 
                    type="text"
                    value={firstName} 
                    errorMessage={firstNameError}
                    returnKeyType="next"           
                    style={{width: '46%'}}                            
                    onSubmitEditing={() => { this.lastNameInput.focus() }}
                    onChangeText={(text) => this.setState({firstName: text, firstNameError: null})} />

                  <FormInput
                  label="Last Name"
                  placeholder="Lois" 
                  type="text"
                  value={lastName} 
                  errorMessage={lastNameError}
                  returnKeyType="next"                     
                  style={{width: '46%'}}                  
                  onRefInput={(input) => { this.lastNameInput = input }}
                  onSubmitEditing={() => { this.emailInput.focus() }}
                  onChangeText={(text) => this.setState({lastName: text, lastNameError: null})} />
                </View>

                <FormInput
                  label="Your Email"
                  placeholder="david@email.com" 
                  type="email"
                  editable={editable}
                  autoCapitalize={false}
                  value={email} 
                  errorMessage={emailError}
                  returnKeyType="next"          
                  onRefInput={(input) => { this.emailInput = input }}
                  onSubmitEditing={() => { this.phoneInput.focus() }}                             
                  onChangeText={(text) => this.setState({email: text, emailError: null})} />

                <FormInput
                  label="Phone"
                  placeholder="644 631-5465" 
                  type="phone"
                  value={phone} 
                  errorMessage={phoneError}
                  returnKeyType="next"           
                  onRefInput={(input) => { this.phoneInput = input }}                                            
                  onSubmitEditing={() => {
                    if (socialId == null) {
                      this.passwordInput.focus()
                    } else {
                      Keyboard.dismiss()
                    }
                  }}
                  onChangeText={(text) => this.setState({phone: text, phoneError: null})} />
                
                {
	            	  socialId == null
	            	  ? <View>
                    <FormInput
                      label="Password"
                      placeholder="**********" 
                      type="password"
                      value={password} 
                      errorMessage={passwordError}
                      returnKeyType="next"           
                      onRefInput={(input) => { this.passwordInput = input }}                                                                        
                      onSubmitEditing={() => { this.confirmPasswordInput.focus() }}
                      onChangeText={(text) => this.setState({password: text, passwordError: null})} />

                    <FormInput
                      label="Confirm Password"
                      placeholder="**********" 
                      type="password"
                      value={confirmPassword} 
                      errorMessage={confirmPasswordError}
                      returnKeyType="done"               
                      onRefInput={(input) => { this.confirmPasswordInput = input }}                             
                      onChangeText={(text) => this.setState({confirmPassword: text, confirmPasswordError: null})} />
                  </View>
                  : null
                }

                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5, marginTop: 5}}>
	                <CheckBox 
	                  value={this.state.agreeTerms} 
	                  onChange={(value) => {this.setState({agreeTerms: value})}} 
	                />
	                <Label title="I agree to the " style={{marginLeft: 10}}/>
	                <Button title="Terms and Conditions" bold={true} onPress={this.onTerms}/>
	              </View>          

                <View>
                  <RoundButton 
                    title="Sign Up" 
                    theme="blue"
                    style={styles.signupButton} 
                    onPress={() => this.onRegister()} />
                </View>
                <View style={[styles.centerView, styles.bottomView]}>
                  <Label title="Already have an account?"></Label>
                  <Button title="Login" style={{marginLeft: 5}} bold={true} onPress={() => this.onLogin()}/>
                </View>    
              </View>
            </KeyboardAwareScrollView>        
        </View>
        <Toast ref={ref => (this.toast = ref)}/>
        {
          this.state.isLoading
          ? <LoadingOverlay />
          : null
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: screenHeight < 800 ? 15 : 30,
    justifyContent: 'center',
  },

  formView: {
    padding: 30,
  },

  centerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  signupButton: {
    marginTop: 20,
    width: '100%',
  },

  bottomView: {
    marginTop: 30,
    width: '100%'
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
    errorMessage: state.user.errorMessage,
    playerId: state.user.playerId,
    registerUserStatus: state.user.registerUserStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUpScreen);