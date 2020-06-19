import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import SendBird from 'sendbird';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TopNavBar from '../components/TopNavBar'
import BackgroundImage from '../components/BackgroundImage'
import StepIndicator from '../components/StepIndicator'
import CustomerPage from '../components/SignUp/CustomerPage'
import Messages from '../theme/Messages'
import CheckBox from '../components/CheckBox'
import Button from '../components/Button'
import Label from '../components/Label'
import RoundButton from '../components/RoundButton'
import LoadingOverlay from '../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status, PASSWORD_MIN_LENGTH } from '../constants.js'
import { validateEmail, getOnlyAlphabetLetters } from '../functions'
import actionTypes from '../actions/actionTypes';
import * as Storage from '../services/Storage'

var sb = null;

class SignUpScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0,
      agreeTerms: false,
      isLoading: false,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        locationText: '',
        password: '',
        confirmPassword: '',
        currentLat: 0,
        currentLng: 0,

        firstNameError: null,
        lastNameError: null,
        emailError: null,
        phoneError: null,
        locationError: null,
        passwordError: null,
        confirmPasswordError: null
      }
    }
  }

  componentDidMount() {
    sb = SendBird.getInstance();

    const { type, user } = this.props.route.params;
    if (user) {
      type = user.type;
      const existingUser = this.state.user;      
      if (user.socialId) {
        existingUser.socialId = user.socialId;
      }

      if (user.socialType) {
        existingUser.socialType = user.socialType;
      }

      if (user.firstName) {
        existingUser.firstName = user.firstName;
      }

      if (user.lastName) {
        existingUser.lastName = user.lastName;
      }

      if (user.email) {
        existingUser.email = user.email;
      }

      if (user.avatar) {
        existingUser.avatar = user.avatar;
      }

      this.setState({user: existingUser});
    }

    if (type === "customer") {
      this.setState({currentPage: 1})
    } else {
      this.setState({currentPage: 0})
    }
  }

  componentWillUnmount() {

  }

  componentDidUpdate(prevProps, prevState) {
    // Get Geo Data.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        const { user } = this.state;
        user.currentLat = this.props.geoData.lat;
        user.currentLng = this.props.geoData.lng;

        this.setState({
          user: user, 
        }, () => {
          this.registerCustomer();
        });        
      } else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
      }      
    }

    // Register Customer.
    if (prevProps.registerCustomerStatus != this.props.registerCustomerStatus) {
      if (this.props.registerCustomerStatus == Status.SUCCESS) {
        this.registerCustomerSuccess();
      } else if (this.props.registerCustomerStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }

    // Check Email.
    if (prevProps.checkEmailStatus != this.props.checkEmailStatus) {
      if (this.props.checkEmailStatus == Status.SUCCESS) {
        const user = this.state.user;
        this.setState({isLoading: false});
        this.moveSignUp2();
      } else if (this.props.checkEmailStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }
    }
  }


  onBack() {
    this.props.navigation.goBack();
  }

  onSelectPage(index) {
    this.setState({currentPage: index});
  }

  onTerms() {
    Keyboard.dismiss();
    this.props.navigation.navigate('Terms');
  }

  connectSendBird() {
    const currentUser = this.props.currentUser;
    console.log("currentUser: ", currentUser);
    if (sb && currentUser._id != "undefined" && currentUser._id?.length > 0) {
      const userId = currentUser._id;
      const username = currentUser.firstName + " " + currentUser.lastName;

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
          
          var profileUrl = '';
          if (currentUser.avatar && currentUser.avatar.length > 0) {
            profileUrl = currentUser.avatar;
          }

          sb.updateCurrentUserInfo(username, profileUrl, function(response, error) {
          });
        });
      }    
    }
  }

  onMoveHome() {
    this.connectSendBird();
    this.props.navigation.navigate("CustomerTab");
  }

  convertTime12to24(time12h){
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    if (hours.length == 1) {
      hours = "0" + hours;
    }
    return `${hours}:${minutes}`;
  }

  onChangeLocation(address) {
    var user = this.state.user;
    user.location = address;
    user.locationText = address;
    user.locationError = null;
    this.setState({user});
  }


  onChangeUser(key, value) {
    var user = this.state.user;
    if (key == "firstName") {
      user.firstName = getOnlyAlphabetLetters(value);
      user.firstNameError = "";
    } else if (key == "lastName") {
      user.lastName = getOnlyAlphabetLetters(value);
      user.lastNameError = "";
    } else if (key == "email") {
      user.email = value;
      if (value && value != "" && validateEmail(value)) {
        user.emailError = "";
      }      
    } else if (key == "phone") {
      user.phone = value;
      user.phoneError = "";
    } else if (key == "location") {
      user.locationText = value;
      user.locationError = "";
    } else if (key == "password") {
      user.password = value;
      user.passwordError = "";
    } else if (key == "confirmPassword") {
      user.confirmPassword = value;
      user.confirmPasswordError = "";
    }

    this.setState({user: user});
  }

  onRegister() {
    Keyboard.dismiss();

    var isValid = true;
    const user = this.state.user;
    if (user.firstName == null || user.firstName.length == 0) {
      user.firstNameError = Messages.InvalidFirstname;
      isValid = false;
    }

    if (user.lastName == null || user.lastName.length == 0) {
      user.lastNameError = Messages.InvalidLastname;
      isValid = false;
    }

    if (user.email == null || user.email.length == 0 || !validateEmail(user.email)) {
      user.emailError = Messages.InvalidEmail;
      isValid = false;
    }

    if (user.phone == null || user.phone.length == 0) {
      user.phoneError = Messages.InvalidPhone;
      isValid = false;
    }

    if (user.location == null || user.location.length == 0 || user.location != user.locationText) {
      user.locationError = Messages.InvalidLocation;
      isValid = false;
    }

    if (user.socialId == null) {
      if (user.password == null || user.password.length == 0) {
        user.passwordError = Messages.InvalidPassword;
        isValid = false;
      } 
      else if (user.password.length < PASSWORD_MIN_LENGTH) {
        user.passwordError = Messages.ShortPasswordError;
        isValid = false;
      }

      if (user.confirmPassword == null || user.confirmPassword.length == 0) {
        user.confirmPasswordError = Messages.InvalidConfirmPassword;
        isValid = false;
      } else if (user.confirmPassword != user.password) {
        user.confirmPasswordError = Messages.InvalidPasswordNotMatch;
        isValid = false;
      }
    }

    if (!this.state.agreeTerms) {
      this.refs.toast.show(Messages.InvalidTerms, TOAST_SHOW_TIME);
      isValid = false;
    }

    if (isValid) {
      if (this.state.currentPage == 1) {

        // Customer Register.
        this.setState({isLoading: true}, () => { 
          this.props.dispatch({
            type: actionTypes.GET_GEODATA,
            address: user.location,
          });
        });      
      } else {
        // Checking Email.
        this.setState({isLoading: true}, () => { 
          this.props.dispatch({
            type: actionTypes.CHECK_EMAIL,
            email: user.email,
          });
        }); 
      }     
    } else {
      this.setState({user: user});
    }    
  }

  registerCustomer() {
    const { user } = this.state;
    if (this.state.currentPage == 1) {
      this.props.dispatch({
        type: actionTypes.REGISTER_CUSTOMER,
        user: user,
        player_id: this.props.playerId,
      });
    }
  }

  async registerCustomerSuccess() {
    this.setState({isLoading: false});
    Storage.USERID.set(this.props.currentUser._id);
    this.onMoveHome();
  }

  onFailure(message) {
    this.setState({isLoading: false});
    if (message == null) {
      this.refs.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);      
    } else {
      this.refs.toast.show(message, TOAST_SHOW_TIME);    
    }
  }

  moveSignUp2() {
    this.setState({isLoading: false});
    const user = this.state.user;
    this.props.navigation.navigate("SignUp2", {user: user});
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.container}>
            <TopNavBar title="Sign Up" theme="empty" onBack={() => this.onBack()}/>
            <StepIndicator steps={this.state.currentPage===0 ? 4 : 2} current={2} style={{marginTop: 20, marginBottom: 30}}/>
            <KeyboardAwareScrollView>
              <View style={{flex: 1}}>
                <CustomerPage 
                  user={this.state.user} 
                  type={this.state.currentPage}
                  agreeTerms={this.state.agreeTerms}
                  onChangeAgree={(select) => this.setState({agreeTerms: select})}
                  onChangeUser={(key, value) => this.onChangeUser(key, value)} 
                  onChangeLocation={(address) => this.onChangeLocation(address)}
                  onTerms={() => this.onTerms()}
                  onRegister={() => this.onRegister()}
                />
                <View style={styles.viewBottom}>
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <CheckBox 
                      value={this.state.agreeTerms} 
                      onChange={(selected) => this.setState({agreeTerms: selected})} 
                    />

                    <Label title="I agree to the " style={{marginLeft: 10}}/>
                    <Button title="Terms of Service" bold={true} onPress={() => this.onTerms()}/>

                  </View>          

                  <RoundButton 
                    title="Register" 
                    theme="blue" 
                    style={styles.registerButton} 
                    onPress={() => this.onRegister()} />
                </View>
              </View>
            </KeyboardAwareScrollView>
            <Toast ref="toast"/>
            {
              this.state.isLoading
              ? <LoadingOverlay />
              : null
            }

          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  viewBottom: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },

  registerButton: {
    marginTop: 20,
    width: '90%'
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    availabilities: state.globals.availabilities,
    rates: state.globals.rates,
    services: state.globals.services,    
    geoData: state.globals.geoData,
    errorGlobalMessage: state.globals.errorMessage,
    getGeoDataStatus: state.globals.getGeoDataStatus,

    currentUser: state.user.currentUser,
    playerId: state.user.playerId,    
    errorMessage: state.user.errorMessage,
    registerCustomerStatus: state.user.registerCustomerStatus,
    checkEmailStatus: state.user.checkEmailStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUpScreen);