import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import Colors from '../../theme/Colors'
import TopNavBar from '../../components/TopNavBar'
import CustomerProfileCard from '../../components/CustomerProfileCard'
import LoadingOverlay from '../../components/LoadingOverlay'
import Toast from 'react-native-easy-toast'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

class CustomerDetailScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      customer: null,
      jobHistory: [],
      reviewScore: 0,
      totalPaid: 0,
      totalJobs: 0,
      avgRate: 0,
      isLoading: false,
    }
  }

  componentDidMount() {
    const { customer } = this.props.route.params;
    this.setState({customer});

    this.setState({isLoading: true});
    this.props.dispatch({
      type: actionTypes.GET_USER,
      user_id: customer._id,
      is_update: false
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getUserStatus != this.props.getUserStatus) {
      if (this.props.getUserStatus == Status.SUCCESS) {
        this.getUserSuccess();
      } else if (this.props.getUserStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  getUserSuccess() {
    const jobHistory = this.props.userJobs;

    var jobCount = 0;
    var reviewScore = 0;    
    var totalPaid = 0;
    var avgRate = 0;
    var totalJobs = jobHistory.length;

    if (jobHistory && jobHistory.length) {
      jobHistory.forEach(job => {
        avgRate += job.rate;
        if (job.review) {
          reviewScore += job.review.score;
          jobCount ++;
        }        
        totalPaid += job.paidAmount;
      }); 

      reviewScore = Math.round( reviewScore / jobCount );
      console.log("reviewScore: ", reviewScore);
      avgRate = Math.round( avgRate / jobHistory.length );
    }


    this.setState({
      isLoading: false, 
      customer: this.props.user, 
      jobHistory: jobHistory,
      reviewScore: reviewScore,
      totalPaid: totalPaid,
      totalJobs: totalJobs,
      avgRate: avgRate,
    });
  }

  onSendMessage(user) {
    this.props.navigation.navigate('Chat', {user: user});
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  render() {
    const { customer, jobHistory, reviewScore, totalPaid, totalJobs, avgRate } = this.state;
    const title = customer ? (customer.firstName + " " + customer.lastName) : '';

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title={title} align="left" onBack={() => this.onBack()}/>
          { 
            customer && 
            <CustomerProfileCard 
              customer={customer}
              jobHistory={jobHistory}
              reviewScore={reviewScore}
              totalPaid={totalPaid}
              totalJobs={totalJobs}
              avgRate={avgRate}
              onSendMessage={(user) => this.onSendMessage(user)}
            />
          }
          <Toast ref="toast"/>
          { this.state.isLoading && <LoadingOverlay /> }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    user: state.user.user,
    userJobs: state.user.userJobs,
    errorMessage: state.user.errorMessage,
    getUserStatus: state.user.getUserStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomerDetailScreen);