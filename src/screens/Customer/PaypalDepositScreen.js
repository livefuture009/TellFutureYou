import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  Keyboard,
} from 'react-native';

import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast'
import { requestOneTimePayment } from 'react-native-paypal';
import {TOAST_SHOW_TIME, Status} from '../../constants'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueBar from '../../components/SignUp/BlueBar'
import LabelFormInput from '../../components/LabelFormInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import Colors from '../../theme/Colors'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';

class PaypalDepositScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      amountError: '',
      isLoading: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getPaypalClientTokenStatus != this.props.getPaypalClientTokenStatus) {
      if (this.props.getPaypalClientTokenStatus == Status.SUCCESS) {
        const token = this.props.paypalClientToken;
        this.depositeWithPaypal(token);
      } else if (this.props.getPaypalClientTokenStatus == Status.FAILURE) {      
        this.onFailure();
      }      
    }

    if (prevProps.processPaypalDepositStatus != this.props.processPaypalDepositStatus) {
      if (this.props.processPaypalDepositStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        Alert.alert(
          '',
          Messages.SuccessDeposit,
          [
            {text: 'OK', onPress: () => {
              this.props.navigation.pop(2);
            }},
          ]
        );  
      } else if (this.props.processPaypalDepositStatus == Status.FAILURE) {      
        this.onFailure();
      }
    }
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  async depositeWithPaypal(token) {
    const amount = this.state.amount;
      requestOneTimePayment(token, {
        amount: amount,
        currency: 'USD',
        shippingAddressRequired: false,
        userAction: 'commit',
        intent: 'authorize', 
      }
    ).then(result => {
      const {
        nonce,
        payerId,
        email,
        firstName,
        lastName,
        phone
      } = result;

      const user_id = this.props.currentUser._id;
      let data = {
        user_id,
        amount,
        nonce,
        payerId,
        email,
        firstName,
        lastName,
        phone
      };

      this.props.dispatch({
        type: actionTypes.PROCESS_PAYPAL_DEPOSIT,
        data: data,
      });
    }).catch(error => {
      this.setState({isLoading: false});
      console.log("error: ", error);
    });
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onDone() {
    Keyboard.dismiss();

    const amount = this.state.amount;
    var isValid = true;

    if (amount === null || amount === "" || isNaN(amount) || parseFloat(amount) < 10) {
      this.setState({amountError: Messages.InvalidDepositAmount});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.GET_PAYPAL_CLIENT_TOKEN,
        });
      });
    }
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar 
             title="DEPOSIT FROM PAYPAL"
              align="left" 
              onBack={() => this.onBack()}
          />
          <BlueBar title="Deposit amount from your paypal." />
          <KeyboardAwareScrollView>
            <View style={styles.contentView}>
              <View style={{alignItems: 'center', marginBottom: 40, marginTop: 10}}>
                <Image
                  style={styles.bankIcon}
                  source={Images.paypal}
                />
              </View>

              <LabelFormInput
                  label="Deposit Amount" 
                  type="number"
                  placeholderTextColor="#939393"
                  value={this.state.amount} 
                  errorMessage={this.state.amountError}
                  onChangeText={(text) => this.setState({amount: text, amountError: null})} />               

            </View>
          </KeyboardAwareScrollView>

          <View style={styles.viewBottom}>
            <RoundButton 
              title="Done" 
              theme="blue" 
              style={styles.nextButton} 
              onPress={() => this.onDone()} />
          </View>
        </View>
        <Toast ref="toast" />
        { this.state.isLoading && <LoadingOverlay /> }        
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  contentView: {
    paddingTop: 20,
    paddingLeft: 35, 
    paddingRight: 35, 
  },

  bankIcon: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },

  viewBottom: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  nextButton: {
    marginTop: 20,
    width: '90%'
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
    paypalClientToken: state.user.paypalClientToken,
    errorMessage: state.user.errorMessage,
    getPaypalClientTokenStatus: state.user.getPaypalClientTokenStatus,
    processPaypalDepositStatus: state.user.processPaypalDepositStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(PaypalDepositScreen);