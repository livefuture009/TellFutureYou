import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import TopNavBar from '../../components/TopNavBar'
import PaymentCell from '../../components/PaymentCell'
import { truncateToDecimals } from '../../functions';
import Colors from '../../theme/Colors'

class DepositPaymentMethodScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      user: null,
      isLoading: false,
    }    
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      const currentUser = this.props.currentUser;
      this.setState({user: currentUser});
    });
  }

  componentWillUnmount() {
    this.focusListener();
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSelectPaypal() {
    this.props.navigation.navigate('PaypalDeposit');
  }

  onSelectBank() {
    this.props.navigation.navigate('BankDeposit');
  }

  onSelectCard() {
    this.props.navigation.navigate('CardDeposit'); 
  }

  render() {
    const currentUser = this.state.user;
    var balance = "$0.00";  
    if (currentUser) {
      balance = "$" + truncateToDecimals(currentUser.balance);  
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar 
             title="DEPOSIT FROM"
              rightLabel="Balance"
              rightValue={balance}
              align="left" 
              onBack={() => this.onBack()}
          />

          <View style={styles.contentView}>
            <PaymentCell method="card" label="Credit Card" onPress={() => this.onSelectCard()} />
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
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(DepositPaymentMethodScreen);