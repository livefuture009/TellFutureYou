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
import SectionHeader from '../../components/Provider/SectionHeader'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status, JOB_STATUS } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import EmptyView from '../../components/EmptyView'
import TopTabBar from '../../components/TopTabBar'
import Swiper from 'react-native-swiper'
import Messages from '../../theme/Messages'
import Fonts from '../../theme/Fonts'
import Colors from '../../theme/Colors'

class CustomerHistoryScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      isFirst: true,
      isLoading: false,
      refreshing: false,
      currentPage: 0,
      openJobs: [],
      activeJobs: [],
      closedJobs: [],
    }
  }

  componentDidMount() {
    this.loadMyJobs();      
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getMyJobsStatus != this.props.getMyJobsStatus) {
      if (this.props.getMyJobsStatus == Status.SUCCESS) {
        this.setState({isLoading: false, isFirst: false});
        this.resetData();
      } else if (this.props.getMyJobsStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    if (prevProps.myJobs != this.props.myJobs) {
      this.resetData();
    }
  }

  onFailure() {
    this.setState({isLoading: false, isFirst: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  resetData() {
    this.setState({isLoading: false, isFirst: false});
    const { myJobs } = this.props;

    var openJobs = [];
    var activeJobs = [];
    var closedJobs = [];

    myJobs.forEach(job => {
      if (job.status === JOB_STATUS.NEW) {
        openJobs.push(job);
      } else if (job.status === JOB_STATUS.PROGRESSING) {
        activeJobs.push(job);
      } else if (job.status === JOB_STATUS.COMPLETED || job.status === JOB_STATUS.CANCELLED) {
        closedJobs.push(job);
      } 
    });


    // Sort Active Jobs.
    activeJobs.sort((a, b) => (a.hire.createdAt > b.hire.createdAt) ? -1 : 1)

    // Sort Closed Jobs.
    closedJobs.sort((a, b) => (a.completedAt > b.completedAt) ? -1 : 1)

    this.setState({
      openJobs: openJobs,
      activeJobs: activeJobs,
      closedJobs: closedJobs,
      refreshing: false
    });
  }

  onSelectPage=(page)=> {
    const change = page - this.state.currentPage;
    if (change) return this.refs.swiper.scrollBy(change, true);
  }

  onSwipeIndexChanged=(index)=> {
    this.setState({currentPage: index});
  }

  onRefresh=()=>{
    this.setState({refreshing:true});
    this.loadMyJobs();    
  }

  loadMyJobs() {
    const { currentUser } = this.props;
    
    if (currentUser && currentUser._id) {
      this.setState({isLoading: true});
      let user_id = currentUser._id;
      let user_type = currentUser.type;
      
      this.props.dispatch({
        type: actionTypes.GET_MY_JOBS,
        user_id: user_id,
        user_type: user_type
      });  
    }    
  }

  onChoose(data) {
    this.props.navigation.navigate('CustomerJobDetail', {job: data});
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

  _renderItem = ({item, index}) => (
    <JobCell
      key={item.id}
      data={item}
      onChoose={(data) => this.onChoose(data)}
    />
  );

  render() {
    const { unreadNumber, unreadMessages} = this.props;
    const { openJobs, activeJobs, closedJobs, isFirst } = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <HeaderInfoBar 
            title="DASHBOARD" 
            user={this.props.currentUser} 
            isSearch={false} 
            unReadMessageCount={unreadMessages}
            unReadNotificationCount={unreadNumber}
            onNotification={() => this.onNotification()}
            onChat={() => this.onChat()}
            onProfile={() => this.onProfile()} />

          <View style={styles.contentView}>
            <TopTabBar 
              titles={["OPEN", "ACTIVE", "CLOSED"]} 
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
              <View style={styles.slide}>
              {
                (openJobs && openJobs.length > 0)
                ? <FlatList
                    style={styles.listView}      
                    data={openJobs}              
                    renderItem={({item, index, section}) => 
                      <OrderCell
                        key={item.id}
                        data={item}
                        userType="customer"
                        onChoose={(data) => this.onChoose(data)}
                      />
                    }
                    renderSectionHeader={({section: {title}}) => (
                      <SectionHeader title={title} />
                    )}
                    ListFooterComponent={() => <View style={{height: 20}}/>}
                    keyExtractor={(item, index) => item + index}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                  />
                : !isFirst && <EmptyView title="No posted jobs yet." />
              }                
              </View>

              <View style={styles.slide}>
              {
                (activeJobs && activeJobs.length > 0)
                ? <FlatList
                    style={styles.listView}      
                    data={activeJobs}              
                    renderItem={({item, index, section}) => 
                      <OrderCell
                        key={item.id}
                        data={item}
                        userType="customer"
                        onChoose={(data) => this.onChoose(data)}
                      />
                    }
                    renderSectionHeader={({section: {title}}) => (
                      <SectionHeader title={title} />
                    )}
                    ListFooterComponent={() => <View style={{height: 20}}/>}
                    keyExtractor={(item, index) => item + index}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                  />
                : !isFirst && <EmptyView title="No active jobs." />
              }                
              </View>

              <View style={styles.slide}>
              {
                (closedJobs && closedJobs.length > 0)
                ? <FlatList
                    style={styles.listView}      
                    data={closedJobs}              
                    renderItem={({item, index}) => 
                      <OrderCell
                        key={item.id}
                        data={item}
                        userType="customer"
                        onChoose={(data) => this.onChoose(data)}
                      />
                    }
                    renderSectionHeader={({section: {title}}) => (
                      <SectionHeader title={title} />
                    )}
                    ListFooterComponent={() => <View style={{height: 20}}/>}
                    keyExtractor={(item, index) => item + index}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                  />
                : !isFirst && <EmptyView title="No closed jobs." />
              }                
            </View>
          </Swiper>
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
    backgroundColor: '#fff',
  },

  contentView: {
    flex: 1,
    backgroundColor: '#f2f2f5',
  },

  slide: {
    flex: 1,
  },

  oneRow: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  zipCodeText: {
    fontFamily: Fonts.regular,
    color: '#8d8d8d',
    fontSize: 16,
  },

  blueText: {
    fontFamily: Fonts.regular,
    color: '#3766fb',
    fontSize: 16,
  },

  listView: {
    paddingTop: 10,
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
    unreadMessages: state.user.unreadMessages,
    unreadNumber: state.notifications.unreadNumber,
    myJobs: state.jobs.myJobs,
    errorMessage: state.jobs.errorMessage,
    getMyJobsStatus: state.jobs.getMyJobsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(CustomerHistoryScreen);
