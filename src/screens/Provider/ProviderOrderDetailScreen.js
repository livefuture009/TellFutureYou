import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../../components/TopNavBar'
import TopTabBar from '../../components/TopTabBar'
import JobInfoCell from '../../components/JobInfoCell'
import { TOAST_SHOW_TIME, JOB_STATUS, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import LoadingOverlay from '../../components/LoadingOverlay'
import CustomerProfileCard from '../../components/CustomerProfileCard'
import Colors from '../../theme/Colors'

class ProviderOrderDetailScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      currentPage: 0,
      currentJob: null,
      jobHistory: [],
      reviewScore: 0,
      totalPaid: 0,
      totalJobs: 0,
      avgRate: 0,
    }    
  }

  componentDidMount() {
    const { job } = this.props.route.params;
    this.setState({currentJob: job, isLoading: true});
    this.props.dispatch({
      type: actionTypes.GET_JOB,
      job_id: job._id
    });

    // Get Customer's Profile Data.
    var creator_id;
    if(typeof(job.creator) === 'string')
    { 
      creator_id = job.creator;
    } else {
      creator_id = job.creator._id;
    }
    this.props.dispatch({
      type: actionTypes.GET_USER,
      user_id: creator_id,
      is_update: false
    });
  }

  componentDidUpdate(prevProps, prevState) {

    // Get Job Status.
    if (prevProps.getJobStatus != this.props.getJobStatus) {
      if (this.props.getJobStatus == Status.SUCCESS) {
        this.setState({isLoading: false, currentJob: this.props.selectedJob});
      } else if (this.props.getJobStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Get User Status.
    if (prevProps.getUserStatus != this.props.getUserStatus) {
      if (this.props.getUserStatus == Status.SUCCESS) {
        this.updateJobHistory();
      } else if (this.props.getUserStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  updateJobHistory() {
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
      avgRate = Math.round( avgRate / jobHistory.length );
    }


    this.setState({
      isLoading: false, 
      jobHistory: jobHistory,
      reviewScore: reviewScore,
      totalPaid: totalPaid,
      totalJobs: totalJobs,
      avgRate: avgRate,
    });
    
    this.setState({isLoading: false, jobHistory: this.props.userJobs});
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSelectPage(index) {
    this.setState({currentPage: index});
  }

  onSendMessage(user) {
    this.props.navigation.navigate('Chat', {user: user});
  }

  renderCustomer() {
    const { currentJob, jobHistory, reviewScore, totalPaid, totalJobs, avgRate } = this.state;
    return (
      <View style={{flex: 1}}>
        <CustomerProfileCard 
          customer={currentJob.creator}
          jobHistory={jobHistory}
          reviewScore={reviewScore}
          totalPaid={totalPaid}
          totalJobs={totalJobs}
          avgRate={avgRate}
          onSendMessage={(user) => this.onSendMessage(user)}
        />
      </View>
    )
  }

  render() {
    const job = this.state.currentJob;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title="JOB DETAILS" align="left" onBack={() => this.onBack()}/>
          <TopTabBar 
            titles={["Job Details", "Customer"]} 
            currentPage={this.state.currentPage} 
            onSelectPage={(index) => this.onSelectPage(index)} 
            style={{backgroundColor: 'white'}}
          />
          {
            this.state.currentPage == 0
            ? <ScrollView>
                {
                  job
                  ? <JobInfoCell job={job}/>
                  : null
                }
                
              </ScrollView>
            : this.renderCustomer()
          }
          
          <Toast ref="toast"/>
          {
            this.state.isLoading
            ? <LoadingOverlay />
            : null
          } 
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

  centerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },

  applyButton: {
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
    errorMessage: state.jobs.errorMessage,
    selectedJob: state.jobs.selectedJob,
    userJobs: state.user.userJobs,
    getJobStatus: state.jobs.getJobStatus,
    getUserStatus: state.user.getUserStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ProviderOrderDetailScreen);