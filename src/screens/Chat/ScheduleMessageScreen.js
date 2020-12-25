import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import BackgroundTimer from 'react-native-background-timer';
import TopNavBar from '../../components/TopNavBar'
import ScheduledChatCell from '../../components/Cells/ScheduledChatCell'
import { TOAST_SHOW_TIME, Status} from '../../constants.js'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import {checkInternetConnectivity} from '../../functions'
import ActionSheet from 'react-native-actionsheet'
import ScheduleDialog from '../../components/ScheduleDialog'
import moment from 'moment';
import EmptyView from '../../components/EmptyView'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

const ChatView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();

class ScheduleMessageScreen extends Component {
  constructor() {
    super()
    this.text='';
    this.scheduleTime = null;
    this.state = {
        messages: [],
        selectedMessage: null,
        isShowScheduleDialog: false,
        isFirst: true,
    }
  }

  async componentDidMount() {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      const { currentUser } = this.props;

      if (this.props.route.params && this.props.route.params.channel) {
        const { channel } = this.props.route.params;        
        this.setState({isLoading: true});
        this.props.dispatch({
            type: actionTypes.GET_SCHEDULED_MESSAGES,
            userId: currentUser._id,
            channelId: channel.name,
        });
  
        BackgroundTimer.runBackgroundTimer(() => { 
          this.props.dispatch({
            type: actionTypes.GET_SCHEDULED_MESSAGES,
            userId: currentUser._id,
            channelId: channel.name,
          });
          }, 
        1000);
      }
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  componentWillUnmount() {
    BackgroundTimer.stopBackgroundTimer();
  }

  componentDidUpdate(prevProps, prevState) {

    // Get Scheduled Messages.
    if (prevProps.getScheduledMessagesStatus != this.props.getScheduledMessagesStatus) {
        if (this.props.getScheduledMessagesStatus == Status.SUCCESS) {
            this.setState({
              isLoading: false, 
              isFirst: false,
              messages: this.props.messages
            });
        } else if (this.props.getScheduledMessagesStatus == Status.FAILURE) {
          this.onFailure(this.props.errorScheduledMessage);
        }      
    }

    // Delete 
    if (prevProps.deleteScheduledMessageStatus != this.props.deleteScheduledMessageStatus) {
      if (this.props.deleteScheduledMessageStatus == Status.SUCCESS) {
          this.setState({isLoading: false, messages: this.props.messages});
      } else if (this.props.deleteScheduledMessageStatus == Status.FAILURE) {
        this.onFailure(this.props.errorScheduledMessage);
      }      
    }

    // Send now.
    if (prevProps.sendNowScheduledMessageStatus != this.props.sendNowScheduledMessageStatus) {
      if (this.props.sendNowScheduledMessageStatus == Status.SUCCESS) {
          this.setState({isLoading: false, messages: this.props.messages});
      } else if (this.props.sendNowScheduledMessageStatus == Status.FAILURE) {
        this.onFailure(this.props.errorScheduledMessage);
      }      
    }
    
    // Reschedule.
    if (prevProps.rescheduleMessageStatus != this.props.rescheduleMessageStatus) {
      if (this.props.rescheduleMessageStatus == Status.SUCCESS) {
          this.setState({isLoading: false, messages: this.props.messages});
      } else if (this.props.rescheduleMessageStatus == Status.FAILURE) {
        this.onFailure(this.props.errorScheduledMessage);
      }      
    }
  }

  onFailure(message) {
    this.setState({isLoading: false, isFirst: false});
    this.toast.show(message, TOAST_SHOW_TIME);
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSelectedMessage=(message)=> {
    this.setState({selectedMessage: message});
    this.ActionSheet.show();
  }

  selectActionSheet(index) {
    const { selectedMessage } = this.state;

    // Send now.
    if (index == 0) {
      this.setState({isLoading: true});
      this.props.dispatch({
        type: actionTypes.SEND_NOW_SCHEDULED_MESSAGE,
        id: selectedMessage._id,
      });
    } 

    // Reschedule.
    else if (index == 1) {
      this.setState({isShowScheduleDialog: true});
    }

    // Delete.
    else if (index == 2) {
      this.setState({isLoading: true});
      this.props.dispatch({
        type: actionTypes.DELETE_SCHEDULED_MESSAGE,
        id: selectedMessage._id,
      });
    }
  }

  rescheduleMessage=()=> {
    const { selectedMessage } = this.state;
    this.setState({isLoading: true});
    const scheduledAt = moment(this.scheduleTime).unix() * 1000;

    this.props.dispatch({
      type: actionTypes.RESCHEDULE_MESSAGE,
      id: selectedMessage._id,
      scheduledAt: scheduledAt,
    });
  }

  render() {
    const { messages, isFirst, isShowScheduleDialog } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title="Scheduled Messages" 
                onBack={() => this.onBack()}
              />
              <View style={styles.container}>
              {
                messages && messages.length > 0
                ? <ChatView 
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    style={styles.container} 
                  >
                    <View style={[styles.chatContainer, {transform: [{ scaleY: -1 }]}]}>
                      { 
                          <FlatList
                              enableEmptySections={true}
                              data={messages}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({item, i}) => (
                                  <ScheduledChatCell 
                                    data={item} 
                                    onSelect={this.onSelectedMessage}
                                  />
                              )}
                          />
                      }
                    </View>
                  </ChatView>
                : !isFirst && <EmptyView title="No scheduled messages." />
              }
              </View>
            </View>
          }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)}/>
        { this.state.isLoading
          ? <LoadingOverlay />
          : null
        } 
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={[
            'Send Now', 
            'Reschedule',
            'Delete',
            'Cancel']}
          cancelButtonIndex={3}
          onPress={(index) => this.selectActionSheet(index)}
        />
        <ScheduleDialog 
          isVisible={isShowScheduleDialog}
          value={this.scheduleTime}
          onClose={() => this.setState({isShowScheduleDialog: false})}
          onSelect={(date) => {
            this.scheduleTime = date;
            this.setState({isShowScheduleDialog: false});
            this.rescheduleMessage();
          }}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.pageColor,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  chatContainer: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
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

    messages: state.scheduledMessages.messages,
    errorScheduledMessage: state.scheduledMessages.errorMessage,
    getScheduledMessagesStatus: state.scheduledMessages.getScheduledMessagesStatus,
    rescheduleMessageStatus: state.scheduledMessages.rescheduleMessageStatus,
    deleteScheduledMessageStatus: state.scheduledMessages.deleteScheduledMessageStatus,
    sendNowScheduledMessageStatus: state.scheduledMessages.sendNowScheduledMessageStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ScheduleMessageScreen);