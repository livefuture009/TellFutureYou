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
import Styles from '../../theme/Styles'
import Images from '../../theme/Images'
import Colors from '../../theme/Colors'
import LoadingOverlay from '../../components/LoadingOverlay'
import stripe from 'tipsi-stripe'
import actionTypes from '../../actions/actionTypes';

class CardDepositScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      cardForm: null,
      amountError: '',
      cardError: null,
      isLoading: false,
    }
  }

  componentDidMount() {
    stripe.setOptions({
      publishableKey: STRIPE_KEY,
    });
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
              this.props.navigation.pop(2);
            }},
          ]
        ); 
      } else if (this.props.depositStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onChangeForm(form) {
    this.setState({cardForm: form, cardError: null});
  }

  onDone() {
    Keyboard.dismiss();

    const user_id = this.props.currentUser._id;
    const amount = this.state.amount;
    var isValid = true;

    if (amount === null || amount === "" || isNaN(amount) || parseFloat(amount) < 10) {
      this.setState({amountError: Messages.InvalidDepositAmount});
      isValid = false;
    }

    if (!this.state.cardForm || !this.state.cardForm.valid) {
      this.setState({cardError: Messages.InvalidCard});
      isValid = false;
    }

    if (isValid) {
      
      this.setState({isLoading: true}, () => { 
        const cardNumber = this.state.cardForm.values.number;
        const expiry = this.state.cardForm.values.expiry;
        const cvc = this.state.cardForm.values.cvc;
        const result = expiry.split('/');

        const expMonth = parseInt(result[0]);
        const expYear = parseInt(result[1]);

        const params = {
          number: cardNumber,
          expMonth: expMonth,
          expYear: expYear,
          cvc: cvc,
        }

        stripe.createTokenWithCard(params)
        .then(response => {
          const token = response.tokenId;
          const data = {
            user_id: user_id,
            amount: amount,
            payment_type: 'card',
            card_number: cardNumber,
            expire_date: expiry,
            cvc: cvc,
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
             title="DEPOSIT FROM CARD"
              align="left" 
              onBack={() => this.onBack()}
          />
          <BlueBar title="Deposit amount from your credit card." />
          <KeyboardAwareScrollView>
            <View style={styles.contentView}>
              <View style={{alignItems: 'center', marginBottom: 40, marginTop: 10}}>
                <Image
                  style={styles.bankIcon}
                  source={Images.credit_card}
                />
              </View>

              <LabelFormInput
                  label="Deposit Amount" 
                  type="number"
                  maxLength={10}
                  placeholderTextColor="#939393"
                  value={this.state.amount} 
                  errorMessage={this.state.amountError}
                  onChangeText={(text) => this.setState({amount: text, amountError: null})} />               

              <LiteCreditCardInput ref={cardInput => this.cardInput = cardInput} onChange={(form) => this.onChangeForm(form)} />
              { this.state.cardError && <Text style={Styles.errorMessage}>{this.state.cardError}</Text>}
              <View style={styles.viewBottom}>
                <RoundButton 
                  title="Done" 
                  theme="blue" 
                  style={styles.nextButton} 
                  onPress={() => this.onDone()} />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <Toast ref="toast" />
        {this.state.isLoading && <LoadingOverlay />}        
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  nextButton: {
    marginTop: 50,
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
    depositStatus: state.user.depositStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(CardDepositScreen);