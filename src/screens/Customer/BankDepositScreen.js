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
import { LiteCreditCardInput } from "react-native-credit-card-input";

import {STRIPE_KEY, TOAST_SHOW_TIME, Status} from '../../constants'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueBar from '../../components/SignUp/BlueBar'
import LabelFormInput from '../../components/LabelFormInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import LoadingOverlay from '../../components/LoadingOverlay'
import stripe from 'tipsi-stripe'
import actionTypes from '../../actions/actionTypes';

class BankDepositScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      routingNumber: '',
      accountNumber: '',

      amountError: '',
      routingNumberError: '',
      accountNumberError: '',

      isLoading: false,
    }

    stripe.setOptions({
      publishableKey: STRIPE_KEY,
    });
  }

  componentDidMount() {
    let _SELF = this;
    setTimeout(function(){
      _SELF.initUserInfo();      
    }, 100)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.depositStatus != this.props.depositStatus) {
      if (this.props.depositStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        Alert.alert(
          '',
          Messages.SuccessDeposit,
          [
            {text: 'OK', onPress: () => {
              this.onBack();
            }},
          ]
        ); 
      } else if (this.props.depositStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  initUserInfo() {
    if (this.props.currentUser && this.props.currentUser._id) { 
      const currentUser = this.props.currentUser;
      const routingNumber = currentUser.routingNumber;
      const accountNumber = currentUser.accountNumber;

      this.setState({
        routingNumber: routingNumber,
        accountNumber: accountNumber      
      });
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onDone() {
    Keyboard.dismiss();

    const user_id = this.props.currentUser._id;
    const amount = this.state.amount;
    const routingNumber = this.state.routingNumber;
    const accountNumber = this.state.accountNumber;

    var isValid = true;

    if (amount <= 0) {
      this.setState({amountError: Messages.InvalidDepositAmount});
      isValid = false;
    }

    if (routingNumber == null || routingNumber.length != 9) {
      this.setState({routingNumberError: Messages.InvalidRoutingNumber});
      isValid = false;
    }

    if (accountNumber == null || accountNumber.length == 0) {
      this.setState({accountNumberError: Messages.InvalidAccountNumber});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 

        const params = {
          accountNumber: accountNumber,
          countryCode: 'us',
          currency: 'usd',
          routingNumber: routingNumber,
        }

        stripe.createTokenWithBankAccount(params)
        .then(response => {
          const token = response.tokenId;
          const data = {
            user_id: user_id,
            amount: amount,
            payment_type: 'bank',
            account_number: accountNumber,
            routing_number: routingNumber,
            token: token
          };

          this.props.dispatch({
            type: actionTypes.DEPOSIT,
            data: data,
          });
        })
        .catch(error => {
          this.setState({isLoading: false});
          this.refs.toast.show(error.message, TOAST_SHOW_TIME);
        });
        // 
      });      
    }
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.container}>
            <TopNavBar 
               title="DEPOSIT FROM"
               align="left" 
               onBack={() => this.onBack()}
            />
            <BlueBar title="Deposit amount from your bank." />
            <KeyboardAwareScrollView>
              <View style={styles.contentView}>
                <View style={{alignItems: 'center', marginBottom: 40, marginTop: 10}}>
                  <Image
                    style={styles.bankIcon}
                    source={Images.bank_icon}
                  />
                </View>

                <LabelFormInput
                   label="Deposit Amount" 
                   type="number"
                   placeholderTextColor="#939393"
                   value={this.state.amount} 
                   errorMessage={this.state.amountError}
                   onChangeText={(text) => this.setState({amount: text, amountError: null})} />               

                <LabelFormInput
                   label="Routing Number" 
                   type="number"
                   placeholderTextColor="#939393"
                   value={this.state.routingNumber} 
                   errorMessage={this.state.routingNumberError}
                   onChangeText={(text) => this.setState({routingNumber: text, routingNumberError: null})} />   

                <LabelFormInput
                   label="Account Number" 
                   type="number"
                   placeholderTextColor="#939393"
                   value={this.state.accountNumber} 
                   errorMessage={this.state.accountNumberError}
                   onChangeText={(text) => this.setState({accountNumber: text, accountNumberError: null})} />   

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
        </SafeAreaView>
        <Toast ref="toast" />
        { this.state.isLoading && <LoadingOverlay /> }        
      </View>
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
    depositStatus: state.user.depositStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(BankDepositScreen);