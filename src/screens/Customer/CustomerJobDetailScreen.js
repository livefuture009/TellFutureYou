import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../../components/TopNavBar'
import TopTabBar from '../../components/TopTabBar'
import RoundButton from '../../components/RoundButton'
import JobInfoCell from '../../components/JobInfoCell'
import JobProviderCell from '../../components/Customer/JobProviderCell'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, JOB_STATUS, NOTIFICATION_TYPE, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import EmptyView from '../../components/EmptyView'
import UserProfileCard from '../../components/UserProfileCard'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

class CustomerJobDetailScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0,
      isLoading: false,
      refreshing: false,
      jobHistory: [],
      currentJob: {
        _id: '',
        title: '',
        photos: [],
        service: '',
        rate: '',
        description: '',
      },
      providers: [],
    } 
  }

  componentDidMount() {
    const { job } = this.props.route.params;
    this.setState({ isLoading: true });
    this.resetData(job);
    this.refreshJob(job);
  }

  componentDidUpdate(prevProps, prevState) {
    // Get Job.
    if (prevProps.getJobStatus !== this.props.getJobStatus) {
      if (this.props.getJobStatus === Status.SUCCESS) {
        this.getJobSuccess();
      } else if (this.props.getJobStatus === Status.FAILURE) {
        this.onFailure();
      }
    }

    // Get User.
    if (prevProps.getUserStatus !== this.props.getUserStatus) {
      if (this.props.getUserStatus === Status.SUCCESS) {
        if (this.props.userJobs) {
          this.setState({jobHistory: this.props.userJobs});
        }        
      } else if (this.props.getUserStatus === Status.FAILURE) {
        this.onFailure();
      }
    }
    

    // Hire Job.
    if (prevProps.hireStatus !== this.props.hireStatus) {
      if (this.props.hireStatus === Status.SUCCESS) {
        this.showMessage(Messages.AlertSentOffer, false);
        this.getJobSuccess();
        this.refreshJob(this.props.selectedJob);
      } else if (this.props.hireStatus === Status.FAILURE) {
        this.onFailure();
      }
    }

    // Cancel Offer Job.
    if (prevProps.cancelOfferStatus !== this.props.cancelOfferStatus) {
      if (this.props.cancelOfferStatus === Status.SUCCESS) {
        this.showMessage(Messages.AlertCancelledOffer, false);
        this.getJobSuccess();
      } else if (this.props.cancelOfferStatus === Status.FAILURE) {
        this.onFailure();
      }
    }

    // Write Review.
    if (prevProps.writeReviewStatus !== this.props.writeReviewStatus) {
      if (this.props.writeReviewStatus === Status.SUCCESS) {
        this.showMessage(Messages.AlertSubmitReview, false);
        this.getJobSuccess();
      } else if (this.props.writeReviewStatus === Status.FAILURE) {
        this.onFailure();
      }
    }

    // Cancel Job.
    if (prevProps.cancelJobStatus !== this.props.cancelJobStatus) {
      if (this.props.cancelJobStatus === Status.SUCCESS) {
        this.showMessage(Messages.AlertCancelledJob, true);
        this.getJobSuccess();
      } else if (this.props.cancelJobStatus === Status.FAILURE) {
        this.onFailure();
      }
    }

    // Pay Job
    if (prevProps.payJobStatus != this.props.payJobStatus) {
      if (this.props.payJobStatus == Status.SUCCESS) {
        this.getJobSuccess();
      } else if (this.props.payJobStatus == Status.FAILURE) {
        this.onFailure();
      }
    }
  }

  showMessage(message, isBack) {
    Alert.alert(
      '',
      message,
      [
        {
          text: 'OK', onPress: () => {
            if (isBack) {
              this.onBack();
            }
          }
        },
      ],
      { cancelable: false },
    );
  }

  refreshJob(job) {
    this.setState({isLoading: true});

    // Get Job.
    this.props.dispatch({
      type: actionTypes.GET_JOB,
      job_id: job._id
    });

    // Get Users.
    const status = this.getStatus(job);
    var provider;
    if (status === JOB_STATUS.OFFER_SENT) {
      provider = job.offer.user;
    } else if (status === JOB_STATUS.PROGRESSING || status === JOB_STATUS.COMPLETED) {
      provider = job.hire.user;
    }

    if (provider) {
      if (typeof (provider) === 'string') {
        this.props.dispatch({
          type: actionTypes.GET_USER,
          user_id: provider,
          is_update: false
        });
      } else {
        this.props.dispatch({
          type: actionTypes.GET_USER,
          user_id: provider._id,
          is_update: false
        });
      }
    }
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.refreshJob(this.state.currentJob);
  }

  resetData(job) {
    this.setState({ currentJob: job, isLoading: false, refreshing: false });
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSelectPage(index) {
    this.setState({ currentPage: index });
  }

  onMoveHiredPage=()=> {
    this.setState({ currentPage: 1 });
  }

  onMakeAsCompleted() {
    this.props.navigation.navigate('Pay', { 
      job: this.state.currentJob,
      onMoveHiredPage: this.onMoveHiredPage
    });
  }

  onHire(provider) {
    if (this.state.isLoading) return;
    this.setState({ isLoading: true });

    const { currentJob } = this.state;
    this.props.dispatch({
      type: actionTypes.HIRE,
      job_id: currentJob._id,
      user_id: provider._id
    });

    // Create Sent Offer Notification.
    this.generateNotification(NOTIFICATION_TYPE.SENT_OFFER, currentJob, provider);
  }

  onCancelOffer() {
    if (this.state.isLoading) return;
    this.setState({ isLoading: true });

    const { currentJob } = this.state;
    this.props.dispatch({
      type: actionTypes.CANCEL_OFFER,
      job_id: currentJob._id,
    });
    this.generateNotification(NOTIFICATION_TYPE.CANCEL_OFFER, currentJob, currentJob.offer.user);
  }

  onCancelHire(provider) {
    if (this.state.isLoading) return;

    const job = this.state.currentJob;
    for (var i = 0; i < job.providers.length; i++) {
      if (job.providers[i]._id == provider._id) {
        job.providers.splice(i, 1);
        break;
      }
    }
    this.setState({ isLoading: true });

    // Update Job.
    this.props.dispatch({
      type: actionTypes.UPDATE_JOB,
      job: job
    });

    // Create Cancel Offer Notification.
    const n = {
      creator: this.props.currentUser._id,
      receiver: provider._id,
      job: job._id,
      type: NOTIFICATION_TYPE.CANCEL_OFFER
    };
    this.props.dispatch({
      type: actionTypes.CREATE_NOTIFICATION,
      notification: n
    });
  }

  onCancelPrompt() {
    Alert.alert(
      '',
      Messages.AskCancelQuote,
      [
        { text: 'Yes, please', onPress: () => this.cancelJob() },
        { text: 'No', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  cancelJob() {
    if (this.state.isLoading) return;
    const { currentJob } = this.state;

    this.setState({ isLoading: true });

    // Cancel Job.
    this.props.dispatch({
      type: actionTypes.CANCEL_JOB,
      job_id: currentJob._id
    });
  }

  generateNotification(type, job, provider) {
    const { currentUser } = this.props;

    const n = {
      creator: currentUser._id,
      receiver: provider._id,
      job: job._id,
      type: type
    };

    this.props.dispatch({
      type: actionTypes.CREATE_NOTIFICATION,
      notification: n
    });
  }

  onSelectedProvider(provider) {
    const job = this.state.currentJob;
    this.props.navigation.navigate('ProviderProfile', { provider: provider, job: job });
  }

  _renderProviderItem = ({ item, index }) => {
    const { currentJob } = this.state;
    const { services } = this.props;
    const provider = item.user;

    return (
      <JobProviderCell
        key={provider._id}
        data={provider}
        services={services}
        job_id={currentJob._id}
        reviews={currentJob.reviews}
        job_status={currentJob.status}
        onHire={(data) => this.onHire(data)}
        onCancel={(data) => this.onCancelHire(data)}
        onSelectProvider={(data) => this.onSelectedProvider(data)}
      />
    )
  }

  getJobSuccess() {
    this.setState({ isLoading: false, currentJob: this.props.selectedJob });
    this.resetData(this.props.selectedJob);
  }

  onFailure() {
    this.setState({ isLoading: false });
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  getServiceNames(services, ids) {
    var names = [];
    if (ids && ids.length > 0) {
      for (var i = 0; i < services.length; i++) {
        for (var j = 0; j < ids.length; j++) {
          if (services[i]._id === ids[j]) {
            names.push(services[i].name);
            break;
          }
        }
      }
      return names.join(', ');
    }

    return "";
  }

  getStatus(job) {
    if (job && job.offer && job.offer.user) {
      return JOB_STATUS.OFFER_SENT;
    }
    return job.status;
  }

  onSendMessage(user) {
    this.props.navigation.navigate('Chat', {user: user});
  }

  renderFooter(status) {
    return (
      <View>
        {
          status == JOB_STATUS.NEW
            ? <View style={styles.centerView}>
              <RoundButton
                title="Cancel"
                theme="red"
                style={styles.halfButton}
                onPress={() => this.onCancelPrompt()} />
            </View>
            : null
        }

        {
          status == JOB_STATUS.OFFER_SENT
            ? <View style={styles.centerView}>
              <RoundButton
                title="Cancel Offer"
                theme="red"
                style={styles.halfButton}
                onPress={() => this.onCancelOffer()} />
            </View>
            : null
        }

        {
          status == JOB_STATUS.PROGRESSING
            ? <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'center'}}>
                <RoundButton
                  title="Mark As Completed"
                  theme="blue"
                  style={{width: '80%'}}
                  onPress={() => this.onMakeAsCompleted()}
                />
              </View>
            : null
        }
      </View>
    )
  }

  renderProposals() {
    const { currentJob } = this.state;
    const proposals = currentJob.proposals;

    return (
      <View style={{ flex: 1, backgroundColor: Colors.pageColor }}>
        {
          (proposals && proposals.length > 0)
            ? <FlatList
              style={styles.listView}
              data={proposals}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this._renderProviderItem}
              onRefresh={this.onRefresh}
              refreshing={this.state.refreshing}
            />
            : <EmptyView title="No applicants yet." />
        }
      </View>
    )
  }

  renderOffer() {
    const { currentJob, jobHistory } = this.state;
    const { services } = this.props;
    const offer = currentJob.offer;

    return (
      <View style={{ flex: 1 }}>
        <UserProfileCard
          profile={offer.user}
          services={services}
          jobHistory={jobHistory}
          onSendMessage={(user) => this.onSendMessage(user)}
        />
      </View>
    )
  }

  onWriteReview(rate, text) {
    if (this.state.isLoading) return;

    const { currentJob } = this.state;
    const provider = currentJob.hire.user;

    this.setState({ isLoading: true });
    const currentUser = this.props.currentUser;

    // Write a review.
    this.props.dispatch({
      type: actionTypes.WRITE_REVIEW,
      user_id: currentUser._id,
      job_id: currentJob._id,
      text: text,
      score: rate
    });

    this.generateNotification(NOTIFICATION_TYPE.GIVE_REVIEW, currentJob, provider);
  }

  renderHire() {
    const { currentUser } = this.props;
    const { currentJob, jobHistory, errorMessage } = this.state;
    const { services } = this.props;
    const hire = currentJob.hire;

    return (
      <View style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <UserProfileCard
          profile={hire.user}
          services={services}
          userType={currentUser.type}
          job={currentJob}
          jobHistory={jobHistory}
          status={currentJob.status}
          onSendMessage={(user)=> this.onSendMessage(user)}
          onWriteReview={(rate, text) => this.onWriteReview(rate, text)}
        />
      </View>
    )
  }

  render() {
    const job = this.state.currentJob
    const status = this.getStatus(job);

    var titles = ["Job Details", "Applicants"];
    if (status === JOB_STATUS.OFFER_SENT) {
      titles = ["Job Details", "Offer"];
    } else if (status === JOB_STATUS.PROGRESSING || status === JOB_STATUS.COMPLETED) {
      titles = ["Job Details", "Hired Provider"];
    } 

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title={job.title} align="left" onBack={() => this.onBack()} />
          {
            status !== JOB_STATUS.CANCELLED &&
            <TopTabBar
              titles={titles}
              currentPage={this.state.currentPage}
              onSelectPage={(index) => this.onSelectPage(index)}
              style={{ backgroundColor: 'white' }}
            />
          }          
          {
            this.state.currentPage == 0
              ? <ScrollView>
                <View>
                  <View style={styles.contentView}>
                    <JobInfoCell job={job} />
                  </View>
                  {this.renderFooter(status)}
                </View>
              </ScrollView>
              : <View style={{ flex: 1 }}>
                {status === JOB_STATUS.NEW && this.renderProposals()}
                {status === JOB_STATUS.OFFER_SENT && this.renderOffer()}
                {(status === JOB_STATUS.PROGRESSING || status === JOB_STATUS.COMPLETED) && this.renderHire()}
              </View>
          }
        </View>

        <Toast ref="toast" />
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

  listView: {
    padding: 15,
  },

  centerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  jobImage: {
    width: '100%',
    height: 165,
    resizeMode: 'cover',
  },

  applyButton: {
    marginTop: 30,
    marginBottom: 30,
    width: '90%'
  },

  halfButton: {
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 5,
    marginRight: 5,
    width: '46%'
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
    userJobs: state.user.userJobs,
    errorMessage: state.user.errorMessage,
    selectedJob: state.jobs.selectedJob,
    providers: state.user.providers,
    services: state.globals.services,
    getUserStatus: state.user.getUserStatus,
    getJobStatus: state.jobs.getJobStatus,
    hireStatus: state.jobs.hireStatus,
    cancelOfferStatus: state.jobs.cancelOfferStatus,
    cancelJobStatus: state.jobs.cancelJobStatus,
    payJobStatus: state.jobs.payJobStatus,
    writeReviewStatus: state.jobs.writeReviewStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomerJobDetailScreen);