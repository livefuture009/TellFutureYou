import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import Colors from '../../theme/Colors'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import UserProfileCard from '../../components/UserProfileCard'
import LoadingOverlay from '../../components/LoadingOverlay'
import Toast from 'react-native-easy-toast'
import Messages from '../../theme/Messages'
import Fonts from '../../theme/Fonts'
import { TOAST_SHOW_TIME, JOB_STATUS, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

class ProviderProfileScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0,
      provider: null,
      jobHistory: [],      
      isLoading: false,
    }
  }

  componentDidMount() {
    const { provider } = this.props.route.params;  
    this.setState({provider});

    this.setState({isLoading: true});
    this.props.dispatch({
      type: actionTypes.GET_USER,
      user_id: provider._id,
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

  onSelectPage(index) {
    this.setState({currentPage: index});
  }

  onInvite() {
    if (this.props.route.params && this.props.route.params.onInviteProvider) {
      this.props.route.params.onInviteProvider(this.state.provider);
    }    
    this.onBack();
  }


  getReview(jobHistory) {
    var avgRate = 0; 
    var jobCount = 0;
    jobHistory.forEach(job => {
      let reviews = job.reviews;
      if (reviews.length > 0) {
        for (var i = 0; i < reviews.length; i++) {
            let review = reviews[i];
            avgRate += review.score;
            jobCount ++;
        }

        avgRate = Math.round( avgRate / jobCount );
        return;    
      }
    });
    
    return 0;
   }

   isInvited(provider, job) {
    var providerList = [];
    if (job.status == JOB_STATUS.NEW) {
      const { invitedList } = this.props.route.params;  
      providerList = invitedList;
    }

    if (providerList && providerList.length > 0) {
        for (var i = 0; i < providerList.length; i++) {
            if (providerList[i]._id == provider._id) {
                return true;
            }
        }
    } 
    return false;
  }

  onViewLocation = () => {
    const { provider } = this.props.route.params;  
    this.props.navigation.navigate('Map', {provider: provider});
  }

  onSendMessage(user) {
    this.props.navigation.navigate('Chat', {user: user});
  }

  getUserSuccess() {
    const {user, userJobs} = this.props;
    this.setState({isLoading: false, provider: user, jobHistory: userJobs});
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  getStatus(provider, job) {
      const provider_id = (provider && provider._id) ? provider._id : provider;
      
      // Check hired.
      if (job.providers && job.providers.length > 0) {
          for (var i = 0; i < job.providers.length; i++) {
              if (job.providers[i]._id == provider_id) {
                  return "Hired";
              }
          }
      } 
      return null;
  }

  render() {
    const { provider, jobHistory } = this.state;
    const { services } = this.props;
    const { isShowInvite } = this.props.route.params;  
    const job = (this.props.route.params && this.props.route.params.job) ? this.props.route.params.job : this.props.selectedJob;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title="Profile" align="center" onBack={() => this.onBack()}/>
          {   
            provider && 
              <UserProfileCard 
                profile={provider} 
                services={services}
                jobHistory={jobHistory}
                isShowInviteButton={(job.status == JOB_STATUS.NEW && isShowInvite) && !this.isInvited(provider, job)}
                onInvite={() => this.onInvite()}
                onSendMessage={(user) => this.onSendMessage(user)}
              />
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

  nameText: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    marginTop: 7,
    color: Colors.textColor
  },

  subText: {
    fontFamily: Fonts.regular,
    fontSize: 17,
    marginTop: 5,
    color: Colors.subTextColor
  },

  reviewView: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },

  reviewInfo: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },

  reviewInfoText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    textTransform: 'uppercase',
  },

  reviewTotalText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    marginTop: 7,
  },

  reviewValueText: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.subText,
    marginLeft: 5,
  },

  aboutView: {
    flex: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },

  labelText: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: Colors.textColor
  },

  descriptionText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: Colors.textColor,
  },

  rowView: {
    marginBottom: 15,
  },

  serviceListView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' 
  },

  serviceItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  serviceText: {
    fontFamily: 'OpenSans',
    fontSize: 16,
    color: Colors.textColor,
  },

  checkImage: {
    width: 20,
    height: 20,
    marginRight: 7
  },

  noteBox: {
    backgroundColor: '#fdfdfd',
    borderWidth: 2,
    borderColor: Colors.ticketColor,
    borderRadius: 5,
    fontFamily: 'OpenSans',
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },

  centerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  starImage: {
    width: 30,
    height: 30,
  },

  blueButton: {
    marginTop: 30,
    marginBottom: 30,
    width: '90%'
  },

  chatButton: {
    marginTop: 20,
    marginBottom: 20,
    width: '50%'
  },

  viewLocationButton: {
    borderWidth: 1, 
    borderColor: Colors.ticketColor,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
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
    user: state.user.user,
    services: state.globals.services,
    selectedJob: state.jobs.selectedJob,
    userJobs: state.user.userJobs,
    errorMessage: state.user.errorMessage,
    getUserStatus: state.user.getUserStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ProviderProfileScreen);