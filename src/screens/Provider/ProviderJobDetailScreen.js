import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import Slideshow from 'react-native-image-slider-show';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../../components/TopNavBar'
import IconTextInfo from '../../components/Provider/IconTextInfo'
import RoundButton from '../../components/RoundButton'
import SubServicesBox from '../../components/SubServicesBox'
import LoadingOverlay from '../../components/LoadingOverlay'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import { TOAST_SHOW_TIME, Status, NOTIFICATION_TYPE } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import { TouchableOpacity } from 'react-native-gesture-handler';

class ProviderJobDetailScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      currentJob: null,
    }    
  }

  componentDidMount() {
    const { job } = this.props.route.params;
    this.setState({currentJob: job});

    this.setState({currentJob: job, isLoading: true});
    this.props.dispatch({
      type: actionTypes.GET_JOB,
      job_id: job._id
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

    // Apply Job.
    if (prevProps.applyJobStatus != this.props.applyJobStatus) {
      if (this.props.applyJobStatus == Status.SUCCESS) {
        this.setState({isLoading: false, currentJob: this.props.selectedJob});        
        this.showMessage(Messages.AlertApplyJob, false);
      } else if (this.props.applyJobStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Withdraw Job.
    if (prevProps.withdrawJobStatus != this.props.withdrawJobStatus) {
      if (this.props.withdrawJobStatus == Status.SUCCESS) {
        this.setState({isLoading: false, currentJob: this.props.selectedJob});        
        this.showMessage(Messages.AlertWithdrawJob, true);
      } else if (this.props.withdrawJobStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Accept Offer.
    if (prevProps.acceptOfferStatus != this.props.acceptOfferStatus) {
      if (this.props.acceptOfferStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showMessage(Messages.AlertJobStarted, true);
      } else if (this.props.acceptOfferStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Decline Offer.
    if (prevProps.declineOfferStatus != this.props.declineOfferStatus) {
      if (this.props.declineOfferStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showMessage(Messages.AlertDeclineOffer, true);
      } else if (this.props.declineOfferStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  showMessage(message, isBack) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          if (isBack) this.onBack();
        }},
      ],
      {cancelable: false},
    ); 
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onUpdateJob(job) {
    this.setState({isLoading: false});
    this.props.navigation.pop(1);
    this.props.navigation.navigate('HistoryStack');
  }

  onApply() {
    const job_id = this.state.currentJob._id;
    const user_id = this.props.currentUser._id;

    this.setState({isLoading: true});
    this.props.dispatch({
      type: actionTypes.APPLY_JOB,
      job_id: job_id,
      user_id: user_id,
    });
  }

  onWithdraw() {
    const job_id = this.state.currentJob._id;
    const user_id = this.props.currentUser._id;

    this.setState({isLoading: true});
    this.props.dispatch({
      type: actionTypes.WITHDRAW_JOB,
      job_id: job_id,
      user_id: user_id,
    });
  }

  getImages(photos) {
    let images = [];
    for (var i = 0; i < photos.length; i++) {
      images.push({url: photos[i]});
    }

    return images;
  }

  calcPrice(rate, limit) {
    return rate + " x " + limit + " hours"
  }

  isGotOffer(job) {
    if (job.offer && job.offer.user) {
      return true;
    }
    return false;
  }

  isAppliedJob(job) {
    const { currentUser } = this.props;
    var isApplied = false;

    if (job.proposals) {
      job.proposals.forEach(element => {
        if (element.user === currentUser._id || element.user._id === currentUser._id) {
          isApplied = true;
          return;
        }      
      });
    }
    return isApplied;
  }

  onCustomer(customer) {
    this.props.navigation.navigate('CustomerDetail', {customer: customer});
  }

  onAcceptOffer(job) {
    if (this.state.isLoading) return;
    this.setState({isLoading: true});
      
    const { currentJob } = this.state;
    const { currentUser } = this.props;

    this.props.dispatch({
      type: actionTypes.ACCEPT_OFFER,
      job_id: currentJob._id,
      user_id: currentUser._id,
    });

    this.generateNotification(NOTIFICATION_TYPE.ACCEPT_OFFER, currentJob);
  }

  onDeclineOffer(job) {
    if (this.state.isLoading) return;
    this.setState({isLoading: true});
      
    const { currentJob } = this.state;
    this.props.dispatch({
      type: actionTypes.DECLINE_OFFER,
      job_id: currentJob._id,
    });

    this.generateNotification(NOTIFICATION_TYPE.DECLINE_OFFER, currentJob);
  }

  generateNotification(type, job) {
    const { currentUser } = this.props;

    const n = {
      creator: currentUser._id,
      receiver: job.creator._id,
      job: job._id,
      type: type
    };

    this.props.dispatch({
      type: actionTypes.CREATE_NOTIFICATION,
      notification: n
    });
  }

  renderFooter(job) {
    return (
      <View style={styles.centerView}>
        {
          this.isGotOffer(job)
          ? <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <RoundButton 
                title="Accept Offer" 
                theme="blue" 
                style={{width: '45%', marginLeft: 5, marginRight: 5}} 
                onPress={() => this.onAcceptOffer(job)} 
              />
              <RoundButton 
                title="Decline Offer" 
                theme="red" 
                style={{width: '45%', marginLeft: 5, marginRight: 5}} 
                onPress={() => this.onDeclineOffer(job)} 
              />
            </View>
          : <View style={{width: '100%', alignItems: 'center'}}>
              {
                this.isAppliedJob(job) 
                ? <RoundButton 
                    title="Withdraw" 
                    theme="red" 
                    style={{width: '70%', marginLeft: 5, marginRight: 5}} 
                    onPress={() => this.onWithdraw()} />
                : 
                  <RoundButton 
                    title="Apply" 
                    theme="blue" 
                    style={{width: '70%', marginLeft: 5, marginRight: 5}} 
                    onPress={() => this.onApply()} />
              }
            </View>
        }
      </View>  
    );
  }

  render() {
    const job = this.state.currentJob ? this.state.currentJob : this.props.route.params.job;
    console.log("job: ", job);
    const creatorName = (job && job.creator) ? job.creator.firstName + " " + job.creator.lastName: "";
    const creatorAvatar =  (job && job.creator) ? job.creator.avatar : null;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title={job.title} align="left" onBack={() => this.onBack()}/>
          <ScrollView>
            <View>
              { 
                (job.photos && job.photos.length > 0) &&
                <Slideshow 
                  arrowSize={0}
                  dataSource={this.getImages(job.photos)} 
                />
              }              
              <View style={styles.contentView}>
                <View style={styles.headerInfoView}>
                  <View style={{ width: '55%'}}>
                    <Text style={styles.titleText}>{job.title}</Text>
                    <Text style={styles.addressText}>{job.location}</Text>
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '40%', overflow: 'hidden', marginTop: 4}}>
                    <View>
                      <Text style={styles.offerText}>Offer by</Text>
                      <TouchableOpacity onPress={() => this.onCustomer(job.creator)}>
                        <Text style={styles.nameText}>{creatorName}</Text>
                      </TouchableOpacity>
                      
                    </View>

                    <TouchableOpacity style={styles.avatar} onPress={() => this.onCustomer(job.creator)}>
                      <Image
                          style={styles.avatarImage}
                          source={creatorAvatar ? {uri: creatorAvatar} : Images.account_icon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.jobInfoView}>
                  <IconTextInfo icon="dollar" description="Estimated pay" extra={this.calcPrice(job.rate, job.duration)} />
                </View>

                <View style={styles.jobInfoView}>
                  <Text style={styles.instructionTitleText}>Job Description:</Text>
                  <Text style={styles.instructionDescriptionText}>{job.description}</Text>
                </View>

                {
                  job.subCategories && job.subCategories.length > 0
                  ? <SubServicesBox style={styles.jobInfoView} services={job.subCategories} />
                  : null
                }

              </View>
              { this.renderFooter(job) }
              
              
            </View>
          </ScrollView>
          
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
    paddingBottom: 30,
  },

  headerInfoView: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4'
  },

  titleText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
  },

  addressText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
  },

  offerText: {
    textAlign: 'right',
    fontFamily: 'OpenSans-Light',
    fontSize: 12,
    width: '95%',
  },

  nameText: {
    textAlign: 'right',
    fontFamily: 'OpenSans-Semibold',
    fontSize: 12,
    width: '95%',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    resizeMode: 'cover',
  },

  jobInfoView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 12,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4'
  },  

  instructionView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },

  instructionTitleText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    marginBottom: 5,
  },

  instructionDescriptionText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
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
    marginTop: 30,
    marginBottom: 30,
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
    applyJobStatus: state.jobs.applyJobStatus,
    withdrawJobStatus: state.jobs.withdrawJobStatus,
    acceptOfferStatus: state.jobs.acceptOfferStatus,
    declineOfferStatus: state.jobs.declineOfferStatus,
    getJobStatus: state.jobs.getJobStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ProviderJobDetailScreen);