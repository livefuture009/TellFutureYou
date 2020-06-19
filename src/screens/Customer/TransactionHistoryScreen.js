import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueInfoBar from '../../components/Provider/BlueInfoBar'
import EarningCell from '../../components/Provider/EarningCell'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import {kFormatter, truncateToDecimals} from '../../functions'
import EmptyView from '../../components/EmptyView'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import Colors from '../../theme/Colors'

class TransactionHistoryScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isFirst: true,
      jobCount: 0,
      avgHourlyRate: 0,
      totalPaid: 0,
      transactions: [],
      user: null,
    }    
  }

  componentDidMount() {
    let _SELF = this;
    setTimeout(function(){
      _SELF.initData();      
    }, 100)
    
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.resetData();    
    });
  }

  initData() {
    this.setState({isLoading: true});
    let currentUser = this.props.currentUser;
    if (currentUser) {
      this.props.dispatch({
        type: actionTypes.GET_TRANSACTIONS,
        user_id: currentUser._id,
      });
    }    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.transactions != this.props.transactions) {
      this.resetData();
    }

    if (prevProps.getTransactionsStatus != this.props.getTransactionsStatus) {
      if (this.props.getTransactionsStatus == Status.SUCCESS) {
        this.setState({isLoading: false, isFirst: false});
        this.resetData();
      } else if (this.props.getTransactionsStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onFailure() {
    this.setState({isLoading: false, isFirst: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  componentWillUnmount() {
    this.focusListener();
  }

  resetData() {
    let jobCount = this.props.jobCount;
    let avgHourlyRate = this.props.avgHourlyRate;
    let totalPaid = this.props.totalPaid;
    let transactions = this.props.transactions;

    this.setState({
      jobCount: jobCount,
      avgHourlyRate: avgHourlyRate,
      totalPaid: totalPaid,
      transactions: transactions
    });
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onDeposit() {
    this.props.navigation.navigate('DepositPaymentMethod');
  }

  getBalance() {
    const currentUser = this.props.currentUser;
    var balance = 0;
    if (currentUser && currentUser.balance) {
      balance = truncateToDecimals(currentUser.balance);
    }

    if (balance > 1000) {
      const formatBalance = kFormatter(balance);
      return "$" + formatBalance;
    }
    return "$" + balance;
  }

  render() {
    const { transactions, isFirst } = this.props;
    const totalPaid = kFormatter(this.state.totalPaid);
    const avgHourlyRate = this.state.avgHourlyRate ? this.state.avgHourlyRate : 0;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar 
            title="TRANSACTIONS" 
            align="left" 
            rightLabel="Balance"
            rightValue={this.getBalance()}
            onBack={() => this.onBack()}/>
          <BlueInfoBar 
            title1="Jobs"  value1={this.state.jobCount} 
            title2="Avg Hourly Pay" value2={avgHourlyRate.toFixed(2)} 
            title3="Total Paid"  value3={totalPaid} 
          />
          <View style={{flex: 1}}>
            <View style={styles.listView}>
              {
                (transactions && transactions.length > 0)
                ?  <FlatList
                    data={transactions}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={() => (<View style={{height: 70}}/>)}
                    renderItem={({ item, index }) => (
                      <EarningCell data={item} key={index} userType="customer"/>
                    )}
                  />
                : !isFirst && <EmptyView title="No transactions."/>

              }
            </View>
            <View style={styles.footer}>
              <RoundButton 
                title="Deposit" 
                theme="blue" 
                style={styles.blueButton} 
                onPress={() => this.onDeposit()} />
            </View>
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

  footer: {
    position: 'absolute',
    left: 0,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
  },

  blueButton: {
    width: '90%'
  },

  listView: {
    flex: 1,
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
    jobCount: state.user.jobCount,
    avgHourlyRate: state.user.avgHourlyRate,
    totalPaid: state.user.totalPaid,
    transactions: state.user.transactions,
    errorMessage: state.user.errorMessage,
    getTransactionsStatus: state.user.getTransactionsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(TransactionHistoryScreen);