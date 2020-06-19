import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard
} from 'react-native';

import TopNavBar from '../../components/TopNavBar'
import PaymentCell from '../../components/PaymentCell'

class CustomerPaymentScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
    }    
  }

  onBack() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.container}>
            <TopNavBar title="PAYMENT METHOD" align="left" onBack={() => this.onBack()}/>
            <View style={styles.contentView}>
              <PaymentCell method="bank" label="Bank Account" onPress={() => this.onSelectPayment()} />
              <PaymentCell method="paypal" label="Paypal" onPress={() => this.onSelectPayment()} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default CustomerPaymentScreen;

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
  }

})
