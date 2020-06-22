import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import HeaderInfoBar from '../../components/HeaderInfoBar'
import SearchBox from '../../components/SearchBox'
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
    const { contacts, keyword, isFirst } = this.props;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <View style={styles.container}>
          <HeaderInfoBar 
            title="MY CONTACTS" 
          />
          <View style={{flex: 1}}>
            <View style={styles.contentView}>
              <SearchBox 
                style={{marginTop: 10, marginBottom: 10}} 
                value={keyword} 
                placeholder="Search ..." 
                onChangeText={(text) => this.searchService(text)}
              />
              {
                (contacts && contacts.length > 0)
                ?  <FlatList
                    data={contacts}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={() => (<View style={{height: 70}}/>)}
                    renderItem={({ item, index }) => (
                      <EarningCell data={item} key={index} userType="customer"/>
                    )}
                  />
                : !isFirst && <EmptyView title="No contacts."/>

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
  container: {
    flex: 1,
  },

  contentView: {
    flex: 1,
    backgroundColor: '#f2f2f5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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