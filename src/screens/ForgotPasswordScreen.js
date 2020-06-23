import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Alert
} from 'react-native';

import {connect} from 'react-redux';
import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import BlueBar from '../components/BlueBar'
import LabelFormInput from '../components/LabelFormInput'
import { TOAST_SHOW_TIME, Status } from '../constants.js'
import LoadingOverlay from '../components/LoadingOverlay'
import Messages from '../theme/Messages'
import Toast from 'react-native-easy-toast'
import actionTypes from '../actions/actionTypes';
import { isValidEmail } from '../functions'
import Colors from '../theme/Colors'

class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      emailError: '',
      isLoading: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.forgotPasswordStatus != this.props.forgotPasswordStatus) {
      if (this.props.forgotPasswordStatus == Status.SUCCESS) {
        this.forgotPasswordSuccess();
      } else if (this.props.forgotPasswordStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  showResultMessage(message) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          this.props.navigation.navigate('VerificationCode', {email: this.state.email});
        }},
      ]
    );  
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onResetPassword() {
    Keyboard.dismiss();

    let email = this.state.email;

    var isValid = true;
    if (email == null || email.length <= 0 || !isValidEmail(email)) {
      this.setState({emailError: Messages.InvalidEmail});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.FORGOT_PASSWORD,
          email: email,
        });
      });      
    }
  }

  forgotPasswordSuccess() {
    this.setState({isLoading: false});
    let message = this.props.resultMessage;
    this.showResultMessage(message);
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.container}>
          <TopNavBar title="Forgot Password" onBack={() => this.onBack()}/>
          <BlueBar title="Enter your email address and we will send you a verification code to reset your password." />
          <View style={styles.contentView}>
            <LabelFormInput
              label="Email Address" 
              type="email"
              placeholder="David@email.com" 
              autoFocus={true}
              placeholderTextColor="#939393"
              errorMessage={this.state.emailError}
              value={this.state.email} 
              returnKeyType="done"
              onChangeText={(text) => this.setState({email: text, emailError: null})} 
              onSubmitEditing={() => { 
              this.onResetPassword() 
            }}
          />

          </View>
          <View style={styles.viewBottom}>
            <RoundButton 
              title="RESET PASSWORD" 
              theme="blue" 
              style={styles.registerButton} 
              onPress={() => this.onResetPassword()} />
          </View>
        </View>
        <Toast ref="toast"/>
        { this.state.isLoading && <LoadingOverlay /> }  
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  contentView: {
    padding: 35,
  },

  viewBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 20,
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
    resultMessage: state.user.resultMessage,
    errorMessage: state.user.errorMessage,
    forgotPasswordStatus: state.user.forgotPasswordStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ForgotPasswordScreen);