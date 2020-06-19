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

import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueBar from '../../components/SignUp/BlueBar'
import LabelFormInput from '../../components/LabelFormInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import Styles from '../../theme/Styles'
import Colors from '../../theme/Colors'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

class BankWithdrawScreen extends Component {
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
    let _SELF = this;
    setTimeout(function(){
      _SELF.initUserInfo();      
    }, 100)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentUser != this.props.currentUser) {
      this.initUserInfo();    
    }
    
    if (prevProps.withdrawWithBankStatus != this.props.withdrawWithBankStatus) {
      if (this.props.withdrawWithBankStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        Alert.alert(
          '',
          Messages.SuccessWithdraw,
          [
            {text: 'OK', onPress: () => {
              this.props.navigation.pop(2);
            }},
          ]
        ); 
      } else if (this.props.withdrawWithBankStatus == Status.FAILURE) {
        this.setState({isLoading: false});
        this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
      }      
    }
  }

  initUserInfo() {
    if (this.props.currentUser && this.props.currentUser._id) {
      let currentUser = this.props.currentUser;
      const balance = Math.floor(currentUser.balance * 100) / 100 + "";
      this.setState({
        amount: balance,
      })
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
    const amount = this.state.amount;
    const { currentUser } = this.props;
    const balance = Math.floor(currentUser.balance * 100) / 100;
    var isValid = true;

    if (amount === null || amount === "" || isNaN(amount) || parseFloat(amount) <= 0) { 
      this.setState({amountError: Messages.InvalidWithdrawAmount});
      isValid = false;
    } else if (parseFloat(amount) > balance) {
      this.setState({amountError: Messages.InvalidWithdrawAmountMoreThanBalance});
      isValid = false;
    }

    if (!this.state.cardForm || !this.state.cardForm.valid) {
      this.setState({cardError: Messages.InvalidCard});
      isValid = false;
    }

    if (isValid) {
      
      this.setState({isLoading: true}, () => { 
        let cardNumber = this.state.cardForm.values.number;
        let expiry = this.state.cardForm.values.expiry;
        let cvc = this.state.cardForm.values.cvc;

        this.props.dispatch({
          type: actionTypes.WITHDRAW_WITH_BANK,
          user_id: this.props.currentUser._id,
          cardNumber: cardNumber,
          expiry: expiry,
          cvc: cvc,
          amount: amount
        });
      });      
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title="Withdraw to Card" align="left" onBack={() => this.onBack()}/>
          <BlueBar title="Create a withdrawal request with credit card." />
          <KeyboardAwareScrollView>
            <View style={styles.contentView}>
              <View style={{alignItems: 'center', marginBottom: 40, marginTop: 10}}>
                <Image
                  style={styles.bankIcon}
                  source={Images.credit_card}
                />
              </View>

              <LabelFormInput
                  label="Amount" 
                  type="number"
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
        <Toast ref="toast"/>
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
    errorMessage: state.user.errorMessage,
    withdrawWithBankStatus: state.user.withdrawWithBankStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(BankWithdrawScreen);