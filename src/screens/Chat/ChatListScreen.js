import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import {connect} from 'react-redux';
import SendBird from 'sendbird';
import Toast from 'react-native-easy-toast'
import { SwipeListView } from 'react-native-swipe-list-view';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import HeaderInfoBar from '../../components/HeaderInfoBar'
import TopTabBar from '../../components/TopTabBar'
import LoadingOverlay from '../../components/LoadingOverlay'
import ChannelCell from '../../components/Cells/ChannelCell'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import { checkInternetConnectivity } from '../../functions'
import actionTypes from '../../actions/actionTypes';
import Images from '../../theme/Images'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

var sb = null;

class ChatScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      channelList: [],
      archiveList: [],
      currentPage: 0,
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
    if (channel && channel.name) {
      this.props.navigation.navigate('Chat', {
        channel: channel, 
        room: room,
        onUpdateLastMessage: this.onUpdateLastMessage,
      });
      channel.markAsRead();
      channel.unreadMessageCount = 0;
      this.updateChannelList(channel);
    }
    else {
      this.props.navigation.navigate('SavedMessage');
    }
  }

  async getChannelList() {
    this.setState({isLoading: true});
    var _SELF = this;
    var listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    listQuery.includeEmpty = true;
    listQuery.next(function(response, error) {
      _SELF.setState({isLoading: false});
      if (response) {
        var channelList = [{}];
        for (var i = 0; i < response.length; i++) {
          var channel = response[i];
          if (channel.memberCount >= 2 && channel.lastMessage != null) {
            channelList.push(channel);
          } 
        }

        _SELF.setState({ 
          channelList, 
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

  async onRemoveChannel(channel) {
    const SELF = this;
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      channel.leave(function(response, error) {
        SELF.getChannelList();
      });
    }
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }    
  }

  onAddMessage=()=> {

  }

  onSelectPage=(page)=> {
    this.setState({currentPage: page});
  }

  _renderMessagePage() {
    var user = null;
    if (sb) {
      user = sb.currentUser;
    }
    const { currentUser } = this.props;
    const { channelList, currentPage } = this.state;

    const lastSelfMessage = (currentUser && currentUser.lastSelfMessage) ? currentUser.lastSelfMessage : null;
    return (
      <View style={styles.pageView}>
        <SwipeListView
          style={styles.listView}
          data={channelList}
          keyExtractor={(item, index) => index.toString()}
          rightOpenValue={-75}
          renderHiddenItem={(data, index) => (
            <View style={styles.rowBack}>
              <TouchableOpacity style={styles.trashBtn} onPress={() => this.onRemoveChannel(data.item)}>
                <Image source={Images.icon_red_trash} style={{width: 35, height: 35}} />
              </TouchableOpacity>
            </View>
          )}
          renderItem={({item, index}) => (
            <ChannelCell 
              currentUser={user}
              lastSelfMessage={lastSelfMessage}
              channel={item} 
              isSelfChannel={(currentPage == 0 && index == 0) ? true: false}
              onPress={this._onChannelPress}
            />
          )}
        />
      </View>
    )
  }

  _renderArchivePage() {
    var currentUser = null;
    if (sb) {
      currentUser = sb.currentUser;
    }
    const { archiveList, currentPage } = this.state;
    return (
      <View style={styles.pageView}>

      </View>
    )
  }

  render() {
    const { currentPage } = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.appColor}}>
        <HeaderInfoBar 
          title="MESSANGER" 
          rightButton="plus"
          onRight={this.onAddMessage}
        />
        <View style={styles.container}>
          <View style={styles.contentView}>
            <TopTabBar
              titles={["My Messages", "Archive"]}
              currentPage={currentPage} 
              onSelectPage={this.onSelectPage}
            />
            {
              (currentPage == 0) 
              ? this._renderMessagePage()
              : null
            }
            {
              (currentPage == 1) 
              ? this._renderArchivePage()
              : null
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
    backgroundColor: '#f2f2f5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },

  contentView: {
    flex: 1,
  },

  listView: {
  },

  rowBack: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  trashBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 60,
  },

  pageView: {
    flex: 1,
    marginTop: 10,
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