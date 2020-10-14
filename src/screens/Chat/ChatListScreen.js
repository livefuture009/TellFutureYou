import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import SendBird from 'sendbird';
import Toast from 'react-native-easy-toast'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import HeaderInfoBar from '../../components/HeaderInfoBar'
import SearchBox from '../../components/SearchBox'
import LoadingOverlay from '../../components/LoadingOverlay'
import EmptyView from '../../components/EmptyView'
import Colors from '../../theme/Colors'
import ChannelCell from '../../components/Cells/ChannelCell'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';

var sb = null;

class ChatScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      channelList: [],
      originalChannelList: [],
      keyword: '',
    }
  }

  componentDidMount() {
    sb = SendBird.getInstance();
    if (sb && sb.currentUser) {
      this.initChannelHandler();
      this.getChannelList();
    }

    this.focusListener = this.props.navigation.addListener('focus', () => {
      if (sb && sb.currentUser) {
        this.getChannelList();
      }
    });
  }

  componentWillUnmount() {
    sb.removeChannelHandler('ChannelHandler');
    this.focusListener();
  }
    
  UNSAFE_componentWillMount(){
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustPan();
    }    
  }

  UNSAFE_componentWillUnmount(){
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustResize();
    }
  }

  initChannelHandler() {
    var _SELF = this;
    var ChannelHandler = new sb.ChannelHandler();
    ChannelHandler.onReconnectSucceeded = function() {
      _SELF.getChannelList();
    };

    ChannelHandler.onReadReceiptUpdated = function(groupChannel) { 
      _SELF.updateChannelList(groupChannel);
    };

    ChannelHandler.onMessageReceived = function(groupChannel) { 
      _SELF.updateChannelList(groupChannel);
    };

    sb.addChannelHandler('ChannelHandler', ChannelHandler);
  }

  updateChannelList(channel) {
    const list = [];
    const { channelList } = this.state;    
    this.setState({channelList: list}, function() {
      var totalUnreadCount = 0;
      var isExisting = false;

      for (var i = 0; i < channelList.length; i++) {
        if (channelList[i].name === channel.name) {
          list.push(channel);
          totalUnreadCount += channel.unreadMessageCount;
          isExisting = true;
        } else {
          list.push(channelList[i]);
          totalUnreadCount += channelList[i].unreadMessageCount;
        }        
      }
      if (!isExisting) {
        if (channel.lastMessage != null) {
          list.push(channel);
        }        
      }

      this.setState({
        channelList: list,
        originalChannelList: [...list],
      });
      this.props.dispatch({
        type: actionTypes.SET_UNREAD_MESSAGE,
        number: totalUnreadCount
      });
    });
  }

  onUpdateLastMessage=(channel)=> {
    this.updateChannelList(channel);
  }
  
  _onChannelPress=(channel, room)=> {
    this.props.navigation.navigate('Chat', {
      channel: channel, 
      room: room,
      onUpdateLastMessage: this.onUpdateLastMessage,
    });
    channel.markAsRead();
    channel.unreadMessageCount = 0;
    this.updateChannelList(channel);
  }

  async getChannelList() {
    this.setState({isLoading: true});
    var _SELF = this;
    var listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    listQuery.includeEmpty = true;
    listQuery.next(function(response, error) {
      _SELF.setState({isLoading: false});
      if (response) {
        var channelList = [];
        for (var i = 0; i < response.length; i++) {
          var channel = response[i];
          if (channel.memberCount >= 2 && channel.lastMessage != null) {
            channelList.push(channel);
          } 
        }

        _SELF.setState({ 
          channelList: channelList, 
          originalChannelList: [...channelList],
        });  
      } else {
        if (error) {
          console.log('Get Private List Fail.', error);
          return;
        }  
      }
    });
  }

  getUnreadMessageCount(channels) {
    var unreadCount = 0;
    for (var i = 0; i < channels.length; i++) {
      var channel = channels[i];
      unreadCount += channel.unreadMessageCount;
    }
    return unreadCount;
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSearch(keyword) {
    this.setState({keyword: keyword});
    const { originalChannelList } = this.state;

    if (keyword) {
      const text = keyword.trim().toLowerCase();
      if (text.length > 0) {
        const { currentUser } = this.props;
        var list = [];
        originalChannelList.forEach(item => {
          var targetUsername = "";
          if (item.members[0].userId == currentUser._id) {
            targetUsername = item.members[1].nickname.toLowerCase();
          } else {
            targetUsername = item.members[0].nickname.toLowerCase();
          }

          if (targetUsername.indexOf(text) >= 0) {
            list.push(item);
          }
        });

        this.setState({ channelList: list });
      } else {
        this.setState({ channelList: originalChannelList });
      }
    } 
    else {
      this.setState({ channelList: originalChannelList });
    }
  }

  render() {
    const { keyword } = this.state;
    var currentUser = null;
    if (sb) {
      currentUser = sb.currentUser;
    }
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <View style={styles.container}>
          <HeaderInfoBar 
            title="MESSAGES" 
          />
          <View style={styles.contentView}>
            <SearchBox 
              style={{marginTop: 10, marginBottom: 10}} 
              value={keyword} 
              placeholder="Search ..." 
              onChangeText={(text) => this.onSearch(text)}
            />
            {
              (this.state.channelList && this.state.channelList.length > 0)
              ? <FlatList
                  style={styles.listView}
                  data={this.state.channelList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, i}) => (
                    <ChannelCell 
                      currentUser={currentUser}
                      channel={item} 
                      onPress={this._onChannelPress}
                    />
                  )} />
              : <EmptyView title="No messages yet." />
            }
          
          </View>
        </View>
        
        <Toast ref={ref => (this.toast = ref)}/>
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
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ChatScreen);