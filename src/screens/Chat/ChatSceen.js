import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
} from 'react-native';

import {connect} from 'react-redux';
import SendBird from 'sendbird';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import ActionSheet from 'react-native-actionsheet'
import ImageResizer from 'react-native-image-resizer';
import ImageView from 'react-native-image-view';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import TopNavBar from '../../components/TopNavBar'
import ChatCell from '../../components/Cells/ChatCell'
import CommentInput from '../../components/CommentInput';
import RNFS from 'react-native-fs';
import { TOAST_SHOW_TIME, Status, PULLDOWN_DISTANCE, IMAGE_COMPRESS_QUALITY, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT } from '../../constants.js'
import EmptyText from '../../components/Decoration/EmptyText'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import {checkInternetConnectivity} from '../../functions'
import moment from 'moment';
import ScheduleDialog from '../../components/ScheduleDialog'
import QuoteDialog from '../../components/QuoteDialog/QuoteDialog'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'

const OPEN_CAMERA=0;
const OPEN_GALLERY=1;

const ChatView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();
const emptyText="Direct messages will show up here."

var sb = null;

class ChatScreen extends Component {
  constructor() {
    super()
    sb = SendBird.getInstance();

    this.text='';
    this.scheduleTime = null;
    this.state = {
      channel: null,
      messageQuery: null,
      messages: [],
      disabled: true,
      lastMessage: null,
      commentHeight: 0,
      isFirst: true,
      isLoading: false,
      photos: [],
      isImageViewVisible: false,
      isShowScheduleDialog: false,
      currentPhotoIndex: 0,

      selectedImage: null,
      selectedQuote: null,
      selectedScheduleData: null,
    }
  }

  UNSAFE_componentWillMount(){
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustResize();
    }    
  }

  UNSAFE_componentWillUnmount(){
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustPan();
    }
  }

  async componentDidMount() {
    const { channel, user, contact } = this.props.route.params;

    // Check connection.
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      if (channel) {
        this.initChatChannel(channel);
        return;
      } 
      if (user) {
        this.checkCreateChannel(user);
        return;
      } 
      if (contact) {
        this.setState({isLoading: true});
        this.props.dispatch({
          type: actionTypes.GET_USER_BY_EMAIL,
          email: contact.email,
        });
      }
    } else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  componentWillUnmount() {
    sb.removeChannelHandler('ChatView');
    sb.removeConnectionHandler('ChatView')
  }

  componentDidUpdate(prevProps, prevState) {
    // Get User By Email.
    if (prevProps.getUserByEmailStatus != this.props.getUserByEmailStatus) {
      if (this.props.getUserByEmailStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.checkCreateChannel(this.props.selectedUser);
      } else if (this.props.getUserByEmailStatus == Status.FAILURE) {
        this.onFailure(this.props.errorUserMessage);
      }      
    }

    // Upload File.
    if (prevProps.uploadFileStatus != this.props.uploadFileStatus) {
      if (this.props.uploadFileStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.addMediaMessage(this.props.uploadedUrl, this.props.uploadedMediaType);
      } else if (this.props.uploadFileStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }

    // Send Scheduled Message.
    if (prevProps.createScheduledMessageStatus != this.props.createScheduledMessageStatus) {
      if (this.props.createScheduledMessageStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.resetMessageInput();
        this.onMoveSchedulePage();
      } 
      else if (this.props.createScheduledMessageStatus == Status.FAILURE) {
        this.onFailure(this.props.errorScheduledMessage);
      }      
    }
    
  }

  initChatChannel(channel) {
    var _SELF = this;
    var messageQuery = channel.createPreviousMessageListQuery();
    messageQuery.messageTypeFilter = 0;

    this.setState({
      channel: channel,
      messageQuery: messageQuery,
    }, (error) => {
      _SELF._getChannelMessage(false);
      if (channel.channelType == 'group') {
          _SELF.state.channel.markAsRead();
      }

      // channel handler
      var ChannelHandler = new sb.ChannelHandler();
      ChannelHandler.onMessageReceived = function(channel, message){
        if (channel.url == _SELF.state.channel.url) {
          var _messages = [];
          _messages.push(message);
          var _newMessageList = _messages.concat(_SELF.state.messages);
          _SELF.setState({
            messages: _newMessageList,
          });
          _SELF.state.lastMessage = message;
          if (_SELF.state.channel.channelType == 'group') {
            _SELF.state.channel.markAsRead();
          }
        }
      };

      sb.addChannelHandler('ChatView', ChannelHandler);

      var ConnectionHandler = new sb.ConnectionHandler();
      ConnectionHandler.onReconnectSucceeded = function(){
        _SELF._getChannelMessage(true);
        _SELF.state.channel.refresh();
      }
      sb.addConnectionHandler('ChatView', ConnectionHandler);
    });
  }

  onFailure(message) {
    this.setState({isLoading: false});
    this.toast.show(message, TOAST_SHOW_TIME);
  }

  checkCreateChannel(user) {
    const currentUser = sb.currentUser;

    var channelName1 = currentUser.userId + "_" + user._id;
    var channelName2 = user._id + "_" + currentUser.userId;

    var _SELF = this;
    const listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    listQuery.includeEmpty = true;
    listQuery.publicChannelFilter = 'all';
    listQuery.next(function(response, error) {
        console.log("response: ", response);
        if (response) {
          for (var i = 0; i < response.length; i++) {
            var channel = response[i];
            const name = channel.name;
  
            if (name == channelName1 || name == channelName2) {
              _SELF.initChatChannel(channel);
              return;
            }
          }

          _SELF.createChannel(user);
        } else {
          if (error) {
            _SELF.onFailure(error.message);
            return;
          }  
        }
      });
  }

  createChannel=(user) => {
    var _SELF = this;

    const currentUser = sb.currentUser;
    var channelName =  currentUser.userId + "_" + user._id;

    const otherName = user.firstName + " " + user.lastName;
    var realName = currentUser.nickname + "_" + otherName;
    const userIds = [sb.currentUser.userId, user._id];

    var params = new sb.GroupChannelParams();
    params.addUserIds(userIds);
    params.isDistinct = false;
    params.isPublic = true;
    params.name = channelName;
    params.data = realName;

    sb.GroupChannel.createChannel(params, function(channel, error) {
      if (error) {
        console.log('Create GroupChannel Fail.', error);
        _SELF.onFailure(error.message);
        return;
      }

      _SELF.initChatChannel(channel);
    });
  }

  _getChannelMessage(refresh) {
    var _SELF = this;

    if(refresh){
      _SELF.state.messages = [];
    }

    if(this.state.channel && this.state.messageQuery) {
      if (!this.state.messageQuery.hasMore) {
        return;
      }
      this.state.messageQuery.load(function(response, error){
        if (error) {
          // console.log('Get Message List Fail.', error);
          return;
        }

        var _messages = [];
        for (var i = 0 ; i < response.length ; i++) {
          var _curr = response[i];
          if (i > 0) {
            var _prev = response[i-1];
            if (_curr.createdAt - _prev.createdAt > (1000 * 60 * 60)) {
              if (i > 1 && !_messages[i-2].hasOwnProperty('isDate')) {
                _messages.splice((i-1), 0, {isDate: true, createdAt: _prev.createdAt});
              }
            }
          }
          _messages.push(_curr);
          _SELF.state.lastMessage = _curr;
        }

        var _newMessageList = _SELF.state.messages.concat(_messages.reverse());
        _SELF.filterPhotos(_newMessageList);

        _SELF.setState({
          messages: _newMessageList,
          isFirst: false,
        });
      });
    }
  }

  filterPhotos(messages) {
    var photos = [];
    messages.forEach(item => {
      if (item.data === 'image') {
        var message = item.message;
        var array1 = message.split("\r\n");
        if (array1 && array1.length > 0) {
          photos.push(
            {
              source: {
                uri: array1[0],
              },
            },
          );
        }
      }
    });

    this.setState({photos});
  }
  
  selectActionSheet(index) {
    let options = {
      mediaType: 'photo',
      forceJpg:false
    };

    if (index === OPEN_CAMERA) {
      ImagePicker.openCamera(options).then(response => {
        this.setState({isShowScheduleDialog: true, selectedImage: response});
      });
    } else if (index === OPEN_GALLERY) {
      ImagePicker.openPicker(options).then(response => {
        this.setState({isShowScheduleDialog: true, selectedImage: response});
      });
    } else {
      if (Platform.OS === 'android'){
        sb.enableStateChange();
      }
    }
  }

  async setMediaData(response) {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      this.setState({isLoading: true});
      const image = {
        filename: response.filename,
        type: response.mime,
        uri: response.path
      };

      const photo = await this.compressImage(image);
      this.props.dispatch({
        type: actionTypes.UPLOAD_ATTACH_FILE,
        file: {
          filename: response.filename,
          type: response.mime,
          uri: photo.uri
        },
      });
    } else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  async compressImage(imageFile) {
    if (Platform.OS === 'android') {
      image = await ImageResizer.createResizedImage(
        imageFile.uri,
        MAX_IMAGE_WIDTH,
        MAX_IMAGE_HEIGHT,
        'JPEG',
        50,
        
      );
    } else {
      image = await ImageResizer.createResizedImage(
        imageFile.uri,
        MAX_IMAGE_WIDTH,
        MAX_IMAGE_HEIGHT,
        'JPEG',
        IMAGE_COMPRESS_QUALITY,
        0,
        RNFS.TemporaryDirectoryPath
      );
    }

    const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()}.jpg`;
    await RNFS.copyFile(image.uri, dest);
    return image
  }

  addMediaMessage(url, type) {
    var { selectedScheduleData, channel } = this.state;
    const _SELF = this;
    const message = (this.text) ? this.text.trim() : "";
    var content = url;
    if (message && message.length > 0) {
      content += "\r\n" + message;
    }

    if (selectedScheduleData) {
      selectedScheduleData['image'] = url;
      selectedScheduleData['message'] = message;
      this.setState({isLoading: true});
      this.props.dispatch({
        type: actionTypes.CREATE_SCHEDULED_MESSAGE,
        data: selectedScheduleData,
      });
    }
    else {
      channel.sendUserMessage(content, type, (message, error)=> {
        if (error) return;
        _SELF.addNewMessage(message);
      });
    }
  }

  _onPhoto=()=> {
    if (Platform.OS === 'android'){
      sb.disableStateChange();
    }
    this.ActionSheet.show();
  }

  onSend=async()=> {
    if (!this.text) return;
    const content = this.text.trim();
    if (content.length === 0) return;

    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      this.state.channel.sendUserMessage(content, '', (message, error)=> {
        if (error) {
          Keyboard.dismiss();
          this.onFailure(error.message);
          return;
        }
        this.addNewMessage(message);
      });
    } else {
      Keyboard.dismiss();
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  resetMessageInput() {
    this.scheduleTime = null;
    this.text = '';
    this.setState({disabled: true, commentHeight: 45});        
    this.commentInputRef.clear();
  }

  onChangeText=(text)=> {
    this.text= text;
    const disabled = (text.trim().length > 0) ? false : true;
    if (disabled === this.state.disabled) return;
    console.log("disabled: ", disabled);
    this.setState({ disabled })
  }

  onBack() {
    if (this.props.route.params && this.props.route.params.onUpdateLastMessage) {
      const { channel } = this.state;
      if (channel) {
        this.props.route.params.onUpdateLastMessage(channel);
      }      
    }
    this.props.navigation.goBack();
  }

  onPressImage =(item)=> {
    const { photos } = this.state;
    var message = item.message;
    var array1 = message.split("\r\n");
    if (array1 && array1.length > 0) {
      const image = array1[0];  
      var index = 0;
      var currentPhotoIndex = 0;

      photos.forEach(photo => {
        if (image === photo.source.uri) {
          currentPhotoIndex = index;
          return;
        }
        index ++;
      });
      this.setState({currentPhotoIndex: currentPhotoIndex, isImageViewVisible: true});    
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////// Schedule Message ////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  onSchedule=()=> {
    if (this.state.disabled) return;
    Keyboard.dismiss();
    this.setState({isShowScheduleDialog: true});
  }

  onMoveSchedulePage=()=> {
    const { channel } = this.state; 
    this.props.navigation.navigate('ScheduleMessage', {channel: channel});
  }

  onSelectScheduleDate(date) {
    this.setState({isShowScheduleDialog: false});
    
    const { currentUser } = this.props;
    const { channel, selectedQuote, selectedImage } = this.state;
    const scheduledAt = moment(date).unix() * 1000;
    var data = {
      channelId: channel.name,
      channelURL: channel.url,
      scheduledAt,
      creator: currentUser._id,
    };

    if (selectedQuote) {
      data['message'] = selectedQuote.content;
      data['author'] = selectedQuote.author;
      data['type'] = 'quote';
    }
    else if (selectedImage) {
      if (this.text) {
        const message = this.text.trim();
        data['message'] = message;
      }      
      data['type'] = 'image';
      this.setState({selectedScheduleData: data}, () => {
        this.setMediaData(selectedImage);
      });
      return;
    }
    else {
      if (!this.text) return;
      const content = this.text.trim();
      if (content.length === 0) return;

      data['message'] = content;
      data['type'] = 'text';
    }

    this.setState({isLoading: true, selectedQuote: null, selectedImage: null}, () => {
      this.setState({isLoading: true});
      this.props.dispatch({
        type: actionTypes.CREATE_SCHEDULED_MESSAGE,
        data,
      });
    });
    this.resetMessageInput();
  }

  resetMessageInput() {
    this.scheduleTime = null;
    this.text = '';
    this.setState({
      disabled: true, 
      commentHeight: 45, 
      selectedImage: null,
      selectedQuote: null,
      selectedScheduleData: null,
    });        
    this.commentInputRef.clear();
  }

  ///////////////////////////////////////////////////////////////////////////
  //////////////////////// Inspiration Quote ////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  onSendNow() {
    const { selectedQuote, selectedImage } = this.state;
    if (selectedQuote) {
      this.sendQuoteMessage(selectedQuote);
    }
    else if (selectedImage) {
      this.setMediaData(selectedImage);
    }
    else {
      this.onSend();
    }
    this.setState({isShowScheduleDialog: false});
  }

  onSelectQuote= async (quote)=> {
    this.setState({isShowQuoteDialog: false, selectedQuote: quote}, () => {
      setTimeout(() => {
        this.setState({isShowScheduleDialog: true});
      }, 500);
    });
  }

  async sendQuoteMessage(quote) {
    console.log("sendQuoteMessage: ", quote);
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      const { channel } = this.state;
      const _SELF = this;
      channel.sendUserMessage(quote.content, 'quote', (message, error)=> {
        console.log("error: ", error);
        console.log("message: ", message);
        if (error) return;
        _SELF.addNewMessage(message);
      });
      this.setState({selectedQuote: null});
    } 
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  addNewMessage(message) {
    const { messages, lastMessage } = this.state;
    var _messages = [];
    _messages.push(message);

    if (lastMessage && message.createdAt - lastMessage.createdAt  > (1000 * 60 * 60)) {
      _messages.push({isDate: true, createdAt: message.createdAt});
    }

    var _newMessageList = _messages.concat(messages);
    this.setState({
      messages: _newMessageList,
      lastMessage: message,
      isFirst: false
    });

    this.filterPhotos(_newMessageList);
    this.resetMessageInput();   
  }

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////// Render //////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  _renderInspiration() {
    return (
      <View style={styles.inspirationBar}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={Images.icon_quote} style={{width: 20, height: 20, resizeMode: 'contain', marginRight: 5}}/>
          <Text style={styles.inspirationText}>Inspirational Quotes</Text>
        </View>
        <TouchableOpacity onPress={() => this.setState({isShowQuoteDialog: true})}>
          <Text style={styles.selectText}>Select</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { 
      disabled, 
      isImageViewVisible, 
      photos, 
      channel,
      messages,
      currentPhotoIndex, 
      commentHeight,
      isFirst,
      isShowScheduleDialog, 
      isShowQuoteDialog
    } = this.state;

    // Get Page Title.
    const currentUser = sb.currentUser;    
    const { user, room, contact } = this.props.route.params;  
    var pageTitle = "";
    if (user) {
      pageTitle = user.firstName + " " + user.lastName;
    } else if (contact) {
      pageTitle = contact.firstName + " " + contact.lastName;
    } else {
      pageTitle = room;
    }

    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title={pageTitle} 
                rightButton="schedule"
                onBack={() => this.onBack()}
                onRight={this.onMoveSchedulePage}
              />
              <ChatView 
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={styles.container} 
              >
                { this._renderInspiration()}
                <View style={[styles.chatContainer, {transform: [{ scaleY: -1 }]}]}>
                  <FlatList
                    enableEmptySections={true}
                    onEndReached={() => this._getChannelMessage(false)}
                    onEndReachedThreshold={PULLDOWN_DISTANCE}
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, i}) => (
                      <ChatCell 
                        item={item} 
                        currentUser={currentUser}
                        onPressImage={this.onPressImage}
                      />
                    )}
                  />
                </View>
                {
                  messages.length == 0
                  ? <TouchableWithoutFeedback 
                      onPress={() => Keyboard.dismiss()} 
                      style={{flex: 1}}
                    >
                      <View style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        { 
                          !isFirst
                          ? <EmptyText icon="💬">{emptyText}</EmptyText>
                          : null
                        }
                      </View>
                    </TouchableWithoutFeedback>
                  : null 
                }
                {
                  channel
                  ? <CommentInput
                      textRef={(ref) => {this.commentInputRef=ref}}
                      style={{
                        width: '100%', 
                        paddingLeft: 15,
                        paddingRight: 15,
                        zIndex: 100, 
                        paddingTop: 3, 
                        paddingBottom: 3,
                        backgroundColor:'white',
                        ...ifIphoneX({
                          marginBottom: 15,
                        }, {
                          marginBottom: 0,
                        }),
                      }}
                      inputStyle={{height: Math.max(30, commentHeight)}}
                      placeholder='Write a message...'
                      disabled={disabled}
                      onChangeText={this.onChangeText}
                      onPost={this.onSend}
                      onSchedule={this.onSchedule}
                      onImagePress={this._onPhoto}
                      onGifPress={this.onInsertGifButtonPress}
                      onContentSizeChange={(event) => this.setState({
                        commentHeight: event.nativeEvent.contentSize.height
                      })}
                    />
                  : null
                }
            </ChatView>
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
            title={'Choose Media'}
            options={['Take Media...', 'Choose Media from Gallery...', 'Cancel']}
            cancelButtonIndex={2}
            onPress={(index) => this.selectActionSheet(index)}
          />
          <ImageView
            images={photos}
            imageIndex={currentPhotoIndex}
            isSwipeCloseEnabled={true}
            isVisible={isImageViewVisible}
            onClose={() => this.setState({isImageViewVisible: false})}
          />    
          <ScheduleDialog 
            isVisible={isShowScheduleDialog}
            value={this.scheduleTime}
            onClose={() => this.setState({isShowScheduleDialog: false})}
            onSelect={(date) => {
              this.onSelectScheduleDate(date);
            }}
            onSendNow={() => {
              this.onSendNow();
            }}
          />
          <QuoteDialog 
            isVisible={isShowQuoteDialog}
            onClose={() => this.setState({isShowQuoteDialog: false})}
            onSelectQuote={(quote) => {
              this.onSelectQuote(quote);
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
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },

  chatContainer: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  inspirationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    zIndex: 2,
    shadowColor: Colors.appColor,
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 5,
  },

  inspirationText: {
    fontFamily: Fonts.bold,
    color: 'black',
    fontSize: 14,
  },

  selectText: {
    fontFamily: Fonts.regular,
    color: '#60b8c3',
    fontSize: 15,
    textTransform: 'uppercase',
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    errorMessage: state.globals.errorMessage,
    currentUser: state.user.currentUser,
    uploadedUrl: state.globals.uploadedUrl,
    uploadedMediaType: state.globals.uploadedMediaType,
    uploadFileStatus: state.globals.uploadFileStatus,

    errorUserMessage: state.user.errorMessage,
    selectedUser: state.user.selectedUser,
    getUserByEmailStatus: state.user.getUserByEmailStatus,

    errorScheduledMessage: state.scheduledMessages.errorMessage,
    createScheduledMessageStatus: state.scheduledMessages.createScheduledMessageStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ChatScreen);