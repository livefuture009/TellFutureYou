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
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueBar from '../../components/SignUp/BlueBar'
import LabelFormInput from '../../components/LabelFormInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import Colors from '../../theme/Colors'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

class PaypalWithdrawScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      paypal: '',
      amount: '0',

      paypalError: '',
      amountError: '',
      isLoading: false,
    }
  }

  componentDidMount() {
    let _SELF = this;
    setTimeout(function(){
      _SELF.initUserInfo();      
    }, 100)
  }

  initUserInfo() {
    let currentUser = this.props.currentUser;
    let paypal = currentUser.paypal;
    const balance = Math.floor(currentUser.balance * 100) / 100 + "";

    this.setState({
      paypal: paypal,
      amount: balance
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.withdrawWithPaypalStatus != this.props.withdrawWithPaypalStatus) {
      if (this.props.withdrawWithPaypalStatus == Status.SUCCESS) {
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
      } else if (this.props.withdrawWithPaypalStatus == Status.FAILURE) {
        this.setState({isLoading: false});
        this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onRequestWithdraw() {
    Keyboard.dismiss();

    let paypal = this.state.paypal;
    let amount = this.state.amount;
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

    if (paypal == null || paypal.length <= 0 || !this.validateEmail(paypal)) {
      this.setState({paypalError: Messages.InvalidPaypal});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.WITHDRAW_WITH_PAYPAL,
          user_id: this.props.currentUser._id,
          paypal: paypal,
          amount: amount
        });
      });      
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title="Withdraw to Paypal" align="left" onBack={() => this.onBack()}/>
          <BlueBar title="Create a withdrawal request with paypal" />
          <KeyboardAwareScrollView>
            <View style={styles.contentView}>
              <View style={{alignItems: 'center', marginBottom: 40, marginTop: 10}}>
                <Image
                  style={styles.paypalIcon}
                  source={Images.paypal}
                />
              </View>

              <LabelFormInput
                  label="Amount" 
                  type="number"
                  placeholderTextColor="#939393"
                  value={this.state.amount} 
                  errorMessage={this.state.amountError}
                  onChangeText={(text) => this.setState({amount: text, amountError: null})} />               

              <LabelFormInput
                  label="Paypal" 
                  type="email"
                  placeholderTextColor="#939393"
                  value={this.state.paypal} 
                  errorMessage={this.state.paypalError}
                  onChangeText={(text) => this.setState({paypal: text, paypalError: null})} />

              <View style={styles.viewBottom}>
                <RoundButton 
                  title="Request" 
                  theme="blue" 
                  style={styles.nextButton} 
                  onPress={() => this.onRequestWithdraw()} 
                />
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

  paypalIcon: {
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
    withdrawWithPaypalStatus: state.user.withdrawWithPaypalStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(PaypalWithdrawScreen);