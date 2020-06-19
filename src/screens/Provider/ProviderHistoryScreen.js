import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import HeaderInfoBar from '../../components/HeaderInfoBar'
import OrderCell from '../../components/Provider/OrderCell'
import EmptyView from '../../components/EmptyView'
import LoadingOverlay from '../../components/LoadingOverlay'
import TopTabBar from '../../components/TopTabBar'
import Swiper from 'react-native-swiper'
import Colors from '../../theme/Colors'
import { TOAST_SHOW_TIME, Status, JOB_STATUS } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

class ProviderHistoryScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      refreshing: false,
      currentPage: 0,
      activeJobs: [],
      completedJobs: [],
    }
  }

  componentDidMount() {
    let _SELF = this;
    setTimeout(function(){
      _SELF.loadMyJobs();      
    }, 100)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.myJobs != this.props.myJobs) {
      this.resetData();
    }

    if (prevProps.getMyJobsStatus != this.props.getMyJobsStatus) {
      if (this.props.getMyJobsStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.resetData();
      } else if (this.props.getMyJobsStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  resetData() {
    this.setState({isLoading: false});
    const activeJobs = [];
    const completedJobs = [];

    const { myJobs } = this.props;
    myJobs.forEach(job => {
      if (job.status === JOB_STATUS.PROGRESSING) {
        activeJobs.push(job);
      } else if (job.status === JOB_STATUS.COMPLETED) {
        completedJobs.push(job);
      }
    });

    // Sort Active Jobs.
    activeJobs.sort((a, b) => {
      return (a.hire.createdAt > b.hire.createdAt) ? -1 : 1;
    });

    // Sort Completed Jobs.
    completedJobs.sort((a, b) => {
      return (a.completedAt > b.completedAt) ? -1 : 1;
    });

    this.setState({
      refreshing: false,
      activeJobs,
      completedJobs,
    });
  }

  onRefresh=()=>{
    this.setState({refreshing:true});
    this.loadMyJobs();
  }

  loadMyJobs() {
    if (this.props.currentUser && this.props.currentUser._id) {
      this.setState({isLoading: true});
      let user_id = this.props.currentUser._id;
      let user_type = this.props.currentUser.type;
      
      this.props.dispatch({
        type: actionTypes.GET_MY_JOBS,
        user_id: user_id,
        user_type: user_type
      });  
    }    
  }

  onChoose(data) {
    this.props.navigation.navigate('ProviderOrderDetail', {job: data});
  } 

  onSearch() {
    this.setState({isSearch: !this.state.isSearch});
  }

  onNotification() {
    this.props.navigation.navigate('Notification');  
  }

  onProfile() {
    this.props.navigation.navigate('EditProfile');  
  }
  
  onChat() {
    this.props.navigation.navigate('ChatList');  
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  onSelectPage=(page)=> {
    const change = page - this.state.currentPage;
    if (change) return this.refs.swiper.scrollBy(change, true);
  }

  onSwipeIndexChanged=(index)=> {
    this.setState({currentPage: index});
  }

  render() {
    const { unreadMessages, unreadNumber } = this.props;
    const { activeJobs, completedJobs } = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <HeaderInfoBar 
            title="DASHBOARD" 
            user={this.props.currentUser} 
            unReadMessageCount={unreadMessages}
            unReadNotificationCount={unreadNumber}
            onNotification={() => this.onNotification()}
            onProfile={() => this.onProfile()}
            onChat={() => this.onChat()}
          />

          <View style={styles.contentView}>
            <TopTabBar 
              titles={["ACTIVE", "COMPLETED"]} 
              currentPage={this.state.currentPage} 
              onSelectPage={(index) => this.onSelectPage(index)} 
              style={{backgroundColor: 'white'}}
            />
            <Swiper 
              ref='swiper'
              showsPagination={false} 
              loop={false}
              onIndexChanged={this.onSwipeIndexChanged}
            >
              {/* Active */}
              <View style={styles.slide}>
                {
                  (activeJobs && activeJobs.length > 0)
                  ? <FlatList 
                      data={activeJobs}
                      style={styles.listView}
                      keyExtractor={(item) => item._id}
                      renderItem={({item, index}) => 
                        <OrderCell
                          key={index.toString()}
                          data={item}
                          userType="provider"
                          onChoose={(data) => this.onChoose(data)}
                        />
                      }
                    />
                  : <EmptyView title="No active jobs yet"/>
                }
              </View>

              {/* Complete */}
              <View style={styles.slide}>
                { 
                  (completedJobs && completedJobs.length > 0)
                  ? <FlatList 
                      data={completedJobs}
                      style={styles.listView}
                      keyExtractor={(item) => item._id}
                      ListFooterComponent={() => (<View style={{height: 20}} />)}
                      renderItem={({item, index}) => 
                        <OrderCell
                          key={index.toString()}
                          data={item}
                          userType="provider"
                          onChoose={(data) => this.onChoose(data)}
                        />
                      }
                    />
                  : <EmptyView title="No complete jobs yet"/>
                }
              </View>
            </Swiper>
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
    backgroundColor: '#fff',
  },

  contentView: {
    flex: 1,
    backgroundColor: '#f2f2f5',
  },

  slide: {
    flex: 1,
  },

  listView: {
    paddingTop: 10,
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
    unreadMessages: state.user.unreadMessages,
    unreadNumber: state.notifications.unreadNumber,
    errorMessage: state.jobs.errorMessage,
    myJobs: state.jobs.myJobs,
    getMyJobsStatus: state.jobs.getMyJobsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ProviderHistoryScreen);