import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView
} from 'react-native';

import {connect} from 'react-redux';
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import BlueInfoBar from '../../components/Provider/BlueInfoBar'
import EarningCell from '../../components/Provider/EarningCell'
import actionTypes from '../../actions/actionTypes';
import {kFormatter, truncateToDecimals} from '../../functions'
import EmptyView from '../../components/EmptyView'
import Toast from 'react-native-easy-toast'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../theme/Colors'

class ProviderEarningsScreen extends Component {
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
      _SELF.initUserInfo();      
    }, 100)
    
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.resetData();
    });
  }

  initUserInfo() {
    let currentUser = this.props.currentUser;
    this.props.dispatch({
      type: actionTypes.GET_TRANSACTIONS,
      user_id: currentUser._id,
    });
  }

  componentWillUnmount() {
    this.focusListener();
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

  resetData() {
    let currentUser = this.props.currentUser;
    let jobCount = this.props.jobCount;
    let avgHourlyRate = this.props.avgHourlyRate;
    let totalPaid = this.props.totalPaid;
    let transactions = this.props.transactions;

    this.setState({
      isLoading: false,
      jobCount: jobCount,
      avgHourlyRate: avgHourlyRate,
      totalPaid: totalPaid,
      transactions: transactions,
      user: currentUser
    });
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onWithdraw() {
    this.props.navigation.navigate('PaymentMethod');
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
    const { transactions } = this.state;
    const totalPaid = kFormatter(this.state.totalPaid);

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar 
            title="EARNINGS" 
            align="left" 
            rightLabel="Balance"
            rightValue={this.getBalance()}
            onBack={() => this.onBack()}/>
          <BlueInfoBar 
            title1="Jobs Worked"  value1={this.state.jobCount} 
            title2="Avg Hourly"  value2={this.state.avgHourlyRate.toFixed(2)} 
            title3="Total Earned"  value3={totalPaid} 
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
                      <EarningCell data={item} key={index} userType="provider"/>
                    )}
                  />
                : <EmptyView title="No earnings."/>

              }
              </View>
              {
                (this.state.user && this.state.user.balance > 0) &&
                <View style={styles.footer}>
                  <RoundButton 
                    title="Withdraw" 
                    theme="blue" 
                    style={styles.blueButton} 
                    onPress={() => this.onWithdraw()} 
                  />
                </View>
              }
            </View>
          </View>
        <Toast ref="toast"/>        
        {
          this.state.isLoading
          ? <LoadingOverlay />
          : null
        }
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
    errorMessage: state.user.errorMessage,
    transactions: state.user.transactions,
    jobCount: state.user.jobCount,
    avgHourlyRate: state.user.avgHourlyRate,
    totalPaid: state.user.totalPaid,
    getTransactionsStatus: state.user.getTransactionsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ProviderEarningsScreen);