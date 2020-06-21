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
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import Colors from '../../theme/Colors'

class ContactListScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isFirst: true,
      contacts: [],
    }    
  }

  componentDidMount() {
    // this.setState({isLoading: true});
    // let currentUser = this.props.currentUser;
    // if (currentUser) {
    //   this.props.dispatch({
    //     type: actionTypes.GET_TRANSACTIONS,
    //     user_id: currentUser._id,
    //   });
    // }    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getTransactionsStatus != this.props.getTransactionsStatus) {
      if (this.props.getTransactionsStatus == Status.SUCCESS) {
        this.setState({isLoading: false, isFirst: false});
      } 
      else if (this.props.getTransactionsStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onFailure() {
    this.setState({isLoading: false, isFirst: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  onBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { transactions, isFirst } = this.props;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar 
            title="My Contacts" 
            align="left" 
            onBack={() => this.onBack()}/>
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
          </View>
        </View>
        <Toast ref="toast"/>
        { this.state.isLoading && <LoadingOverlay /> } 
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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

export default connect(mapStateToProps,mapDispatchToProps)(ContactListScreen);