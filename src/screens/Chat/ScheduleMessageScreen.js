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
import TopNavBar from '../../components/TopNavBar'
import ScheduledChatCell from '../../components/Cells/ScheduledChatCell'
import Colors from '../../theme/Colors'
import { TOAST_SHOW_TIME, Status} from '../../constants.js'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import {checkInternetConnectivity} from '../../functions'

// Android does keyboard height adjustment natively.
const ChatView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();

class ScheduleMessageScreen extends Component {
  constructor(props) {
    super(props)
    this.text='';
    this.state = {
        messages: [],
    }
  }

  async componentDidMount() {
    const { currentUser } = this.props;
    if (this.props.route.params && this.props.route.params.channel) {
        const { channel } = this.props.route.params;        
        this.setState({isLoading: true});
        this.props.dispatch({
            type: actionTypes.GET_SCHEDULED_MESSAGES,
            userId: currentUser._id,
            channelId: channel.name,
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Get Scheduled Messages.
    if (prevProps.getScheduledMessagesStatus != this.props.getScheduledMessagesStatus) {
        if (this.props.getScheduledMessagesStatus == Status.SUCCESS) {
            this.setState({isLoading: false, messages: this.props.messages});
        } else if (this.props.getScheduledMessagesStatus == Status.FAILURE) {
          this.onFailure(this.props.errorScheduledMessage);
        }      
    }
  }

  onFailure(message) {
    this.setState({isLoading: false});
    this.refs.toast.show(message, TOAST_SHOW_TIME);
  }

  onBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { messages } = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <TopNavBar 
          title="Scheduled Messages" 
          onBack={() => this.onBack()}
        />
        <ChatView 
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
                        />
                    )}
                />
            }
          </View>
      </ChatView>
      <Toast ref="toast"/>
      { this.state.isLoading
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
    paddingTop: 10,
    backgroundColor: Colors.pageColor
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
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ScheduleMessageScreen);