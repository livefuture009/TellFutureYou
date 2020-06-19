import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import TopNavBar from '../../components/TopNavBar'
import PaymentCell from '../../components/PaymentCell'
import Colors from '../../theme/Colors'

class PaymentMethodScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSelectPaypal() {
    this.props.navigation.navigate('PaypalWithdraw');
  }

  onSelectBank() {
    this.props.navigation.navigate('BankWithdraw');
  }

  getBalance() {
    const { currentUser } = this.props;
    const balance = Math.floor(currentUser.balance * 100) / 100;
    return "$" + balance.toFixed(2);  
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar 
             title="WITHDRAW TO"
              rightLabel="Balance"
              rightValue={this.getBalance()}
              align="left" 
              onBack={() => this.onBack()}
          />

          <View style={styles.contentView}>
            <PaymentCell method="card" label="Card" onPress={() => this.onSelectBank()} />
            <PaymentCell method="paypal" label="Paypal" onPress={() => this.onSelectPaypal()} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fc',
  },

  contentView: {
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
    errorMessage: state.jobs.errorMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(PaymentMethodScreen);