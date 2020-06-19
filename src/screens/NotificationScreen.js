import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import TopNavBar from '../components/TopNavBar'
import NotificationCell from '../components/NotificationCell'
import LoadingOverlay from '../components/LoadingOverlay'
import EmptyView from '../components/EmptyView'
import Toast from 'react-native-easy-toast'
import { TOAST_SHOW_TIME, NOTIFICATION_TYPE, Status, JOB_STATUS } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import Colors from '../theme/Colors'

class NotificationScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      refreshing: false,
      notifications: [],
    }
  }

  componentDidMount() {
    let _SELF = this;
    setTimeout(function(){
      _SELF.initData();      
    }, 100)
  }

  initData() {
    const notifications = this.props.notifications;
    this.setState({notifications: notifications});

    if (this.props.currentUser) {
      const user_id = this.props.currentUser._id;
      this.props.dispatch({
        type: actionTypes.GET_MY_NOTIFICATIONS,
        user_id: user_id,
      });  
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getMyNotificationsStatus != this.props.getMyNotificationsStatus) {
      if (this.props.getMyNotificationsStatus == Status.SUCCESS) {
        this.getMyNotifications();
      } else if (this.props.getMyNotificationsStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSelectNotification(n) {
    var new_list = [];
    var notifications = this.state.notifications;
    for (var i = 0; i < notifications.length; i++) {
      var item = notifications[i];
      if (item._id == n._id) {
        item.isRead = true;
      }

      new_list.push(item);
    }

    this.setState({notifications: new_list});

    // Mark Read Notification.
    this.props.dispatch({
      type: actionTypes.MARK_READ_NOTIFICATION,
      notification_id: n._id,
    });
    
    const job = n.job;

    if (n.type == NOTIFICATION_TYPE.SENT_OFFER) {
      // // this.props.navigation.navigate('ProviderOrderDetail', {job: job});
      // // Move Home's Offer Tab.
      // this.onBack();
      // this.props.navigation.navigate('ProviderHome', {activePage: 2});
      if (job.status >= JOB_STATUS.PROGRESSING) {
        this.props.navigation.navigate('ProviderOrderDetail', {job: job});
      } else {
        this.props.navigation.navigate('ProviderJobDetail', {job: job});
      }      
    } else if (n.type == NOTIFICATION_TYPE.CANCEL_OFFER) {
      this.props.navigation.navigate('ProviderOrderDetail', {job: job});
    } else if (n.type == NOTIFICATION_TYPE.ACCEPT_OFFER) {
      this.props.navigation.navigate('CustomerJobDetail', {job: job, needRefresh: true});
    } else if (n.type == NOTIFICATION_TYPE.DECLINE_OFFER) {
      this.props.navigation.navigate('CustomerJobDetail', {job: job, needRefresh: true});
    } else if (n.type == NOTIFICATION_TYPE.COMPLETE_JOB) {
      this.props.navigation.navigate('ProviderOrderDetail', {job: job});
    } else if (n.type == NOTIFICATION_TYPE.CANCEL_JOB) {
      this.props.navigation.navigate('ProviderOrderDetail', {job: job});
    } else if (n.type == NOTIFICATION_TYPE.PAY_JOB) {
      this.props.navigation.navigate('ProviderOrderDetail', {job: job});
    } else if (n.type == NOTIFICATION_TYPE.GIVE_REVIEW) {
      this.props.navigation.navigate('ProviderOrderDetail', {job: job});
    } 
  }

  getMyNotifications() {
    this.setState({isLoading: false, refreshing: false, notifications: this.props.notifications}); 
  }

  onFailure() {
    this.setState({isLoading: false, refreshing: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  onRefresh=()=>{
    this.setState({refreshing:true});

    const user_id = this.props.currentUser._id;
    this.props.dispatch({
      type: actionTypes.GET_MY_NOTIFICATIONS,
      user_id: user_id,
    });
  }

  render() {
    const { notifications } = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title="NOTIFICATIONS" align="left" onBack={() => this.onBack()}/>
          <View style={styles.contentView}>
            {
              (notifications && notifications.length > 0) 
              ? <FlatList
                  style={styles.listView}
                  data={notifications}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, i}) => (
                    <NotificationCell 
                      data={item} 
                      key={i} 
                      onSelectNotification={(data) => this.onSelectNotification(data)} />
                  )}
                  onRefresh={this.onRefresh}
                  refreshing={this.state.refreshing}
                />
              : <EmptyView title="No notifications." />
            }
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

  listView: {
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
    notifications: state.notifications.notifications,
    errorMessage: state.user.errorMessage,
    changePasswordStatus: state.user.changePasswordStatus,
    getMyNotificationsStatus: state.notifications.getMyNotificationsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(NotificationScreen);