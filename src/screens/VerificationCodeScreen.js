import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native';

import {connect} from 'react-redux';
import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import BlueBar from '../components/BlueBar'
import LabelFormInput from '../components/LabelFormInput'

import LoadingOverlay from '../components/LoadingOverlay'
import Messages from '../theme/Messages'
import Toast, {DURATION} from 'react-native-easy-toast'
import actionTypes from '../actions/actionTypes';
import { TOAST_SHOW_TIME, Status } from '../constants.js'

class VerificationCodeScreen extends Component {
  constructor() {
    super()
    this.state = {
      code: '',
      codeError: '',
      isLoading: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.verifyCodePasswordStatus != this.props.verifyCodePasswordStatus) {
      if (this.props.verifyCodePasswordStatus == Status.SUCCESS) {
        this.verifyCodePasswordSuccess();
      } else if (this.props.verifyCodePasswordStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  moveResetPassword() {
    const { email } = this.props.route.params;
    this.props.navigation.navigate('ResetNewPassword', {email: email});
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onVerify() {
    Keyboard.dismiss();

    const { email } = this.props.route.params;
    let code = this.state.code;

    var isValid = true;
    if (code == null || code.length <= 0) {
      this.setState({codeError: Messages.InvalidVerifyCode});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.VERIFY_CODE_PASSWORD,
          email: email,
          code: code
        });
      });      
    }
  }

  verifyCodePasswordSuccess() {
    this.setState({isLoading: false});
    this.moveResetPassword(); 
  }

  onFailure() {
    this.setState({isLoading: false});
    this.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <TopNavBar title="Verify Code" theme="black" onBack={() => this.onBack()}/>
            <BlueBar title="We have sent you an access code via Email for email address verification." />
            <View style={styles.contentView}>
              <LabelFormInput
                label="Verification Code" 
                type="number"
                autoFocus={true}
                editable={true}
                placeholder="******" 
                placeholderTextColor="#939393"
                maxLength={6}
                errorMessage={this.state.codeError}
                value={this.state.code} 
                returnKeyType="done"
                onChangeText={(text) => this.setState({code: text, codeError: null})} 
                onSubmitEditing={() => { 
                this.onVerify() 
              }}
            />
            </View>
            <View style={styles.viewBottom}>
              <RoundButton 
                title="Verify" 
                theme="blue" 
                style={styles.registerButton} 
                onPress={() => this.onVerify()} />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <Toast ref={ref => (this.toast = ref)}/>
        {
          this.state.isLoading && <LoadingOverlay />
        }
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
    verifyCodePasswordStatus: state.user.verifyCodePasswordStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(VerificationCodeScreen);