import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import HeaderInfoBar from '../components/HeaderInfoBar'
import NotificationCell from '../components/NotificationCell'
import LoadingOverlay from '../components/LoadingOverlay'
import EmptyView from '../components/EmptyView'
import Toast from 'react-native-easy-toast'
import { TOAST_SHOW_TIME, NOTIFICATION_TYPE, Status, JOB_STATUS } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import Colors from '../theme/Colors'
import { SafeAreaConsumer } from 'react-native-safe-area-context';

class NotificationScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFirst: true,
      isLoading: false,
      refreshing: false,
      notifications: [],
    }
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      const { isFirst } = this.state;
      if (isFirst) {
        this.setState({isLoading: true}, () => {
          this.fetchNotifications();
        });
      } 
      else {
        this.fetchNotifications();
      }      
    });
  }

  componentWillUnmount() {
    this.focusListener();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getMyNotificationsStatus != this.props.getMyNotificationsStatus) {
      if (this.props.getMyNotificationsStatus == Status.SUCCESS) {
        this.getMyNotifications();
      } 
      else if (this.props.getMyNotificationsStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  fetchNotifications() {
    const { currentUser } = this.props;
    this.props.dispatch({
      type: actionTypes.GET_MY_NOTIFICATIONS,
      user_id: currentUser._id,
    });  
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
    
    if (n.type == NOTIFICATION_TYPE.SENT_FRIEND_REQUEST) {
      this.props.navigation.navigate("FriendStack");
      this.props.dispatch({
        type: actionTypes.CHANGE_FRIEND_ACTIVE_PAGE,
        page: 1,
      }); 
    }
    else if (n.type == NOTIFICATION_TYPE.ACCEPT_FRIEND_REQUEST) {
      this.props.navigation.navigate("FriendStack");
      this.props.dispatch({
        type: actionTypes.CHANGE_FRIEND_ACTIVE_PAGE,
        page: 0,
      }); 
    }
    else if (n.type == NOTIFICATION_TYPE.DECLINE_FRIEND_REQUEST) {
      this.props.navigation.navigate("ContactStack");
    }

    setTimeout(() => {
      this.props.dispatch({
        type: actionTypes.RESET_FRIEND_PAGE,
      });
    }, 1000);
  }

  getMyNotifications() {
    this.setState({
      isLoading: false, 
      refreshing: false, 
      isFirst: false,
      notifications: this.props.notifications
    }); 
  }

  onFailure() {
    this.setState({isLoading: false, refreshing: false, isFirst: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  onRefresh=()=>{
    this.setState({refreshing: true});
    const { currentUser } = this.props;
    this.props.dispatch({
      type: actionTypes.GET_MY_NOTIFICATIONS,
      user_id: currentUser._id,
    });
  }

  onMenu =()=> {
    this.props.navigation.toggleDrawer();
  }

  render() {
    const { notifications, isFirst, isLoading } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <SafeAreaConsumer>
          {
            insets => 
              <View style={{flex: 1, paddingTop: insets.top }} >
                    <HeaderInfoBar 
                      title="NOTIFICATIONS" 
                      onMenu={this.onMenu}
                    />
                    <View style={styles.container}>
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
                          : !isFirst && <EmptyView title="No notifications." />
                        }
                      </View>
                    </View>
                  </View>
          }
          </SafeAreaConsumer>
          <Toast ref="toast"/>
          { isLoading && <LoadingOverlay /> }
        </View>
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
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 15,
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