import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  PixelRatio,
  Platform,
  KeyboardAvoidingView,
  Image,
  SafeAreaView,
  FlatList,
  Keyboard,
} from 'react-native';

import {connect} from 'react-redux';
import SendBird from 'sendbird';
import Toast from 'react-native-easy-toast'
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet'
import TopNavBar from '../../components/TopNavBar'
import ChatCell from '../../components/Cells/ChatCell'
import Colors from '../../theme/Colors'
import CommentInput from '../../components/CommentInput';
import WalkieTalkie from '../../components/WalkieTalkie';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import ImageView from 'react-native-image-view';
import { TOAST_SHOW_TIME, Status, PULLDOWN_DISTANCE, IMAGE_COMPRESS_QUALITY, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT } from '../../constants.js'
import EmptyText from '../../components/Decoration/EmptyText'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import {checkInternetConnectivity} from '../../functions'

const OPEN_CAMERA=0;
const OPEN_GALLERY=1;

// Android does keyboard height adjustment natively.
const ChatView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();
  const emptyText="Direct messages will show up here."

var sb = null;

class ChatScreen extends Component {
  constructor(props) {
    super(props)
    sb = SendBird.getInstance();
    this.text='';
    this.onChangeText = this.onChangeText.bind(this);
    this.onSend = this.onSend.bind(this);
    this._onPhoto = this._onPhoto.bind(this);

    this.state = {
        channel: null,
        messageQuery: null,
        messages: [],
        disabled: true,
        show: false,
        lastMessage: null,
        hasRendered: false,
        commentHeight: 0,
        isFirst: true,
        otherUser: null,
        showWalkieTalkie: false,
        isLoading: false,
        photos: [],
        isImageViewVisible: false,
        currentPhotoIndex: 0,
    }
  }

  componentWillMount(){
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustResize();
    }    
  }

  componentWillUnmount(){
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustPan();
    }
  }

  async componentDidMount() {
    const { channel, user } = this.props.route.params;
    if (channel) {
        this.initChatChannel(channel);
    } 

    // Check connection.
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      if (user) {
        this.checkCreateChannel(user);
      } 
    } else {
      this.refs.toast.show(Messages.NoInternet, TOAST_SHOW_TIME);
    }
  }

  componentWillUnmount() {
    sb.removeChannelHandler('ChatView');
    sb.removeConnectionHandler('ChatView')
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.uploadFileStatus != this.props.uploadFileStatus) {
      if (this.props.uploadFileStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.addMediaMessage(this.props.uploadedUrl, this.props.uploadedMediaType);
      } else if (this.props.uploadFileStatus == Status.FAILURE) {
        this.onFailure();
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
      if (!_SELF.state.hasRendered){
        _SELF.state.hasRendered = true;
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
      }
    });
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  checkCreateChannel(user) {
    this.setState({otherUser: user});
    var canCreateChannel = true;
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
        photos.push(
          {
            source: {
                uri: item.message,
            },
          },
      );
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
        this.setMediaData(response)
      });
    } else if (index === OPEN_GALLERY) {
      ImagePicker.openPicker(options).then(response => {
        this.setMediaData(response)
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
      this.refs.toast.show(Messages.NoInternet, TOAST_SHOW_TIME);
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
    this.state.channel.sendUserMessage(url, type, (message, error)=> {
      if (error) return;

      var _messages = [];
      _messages.push(message);
      if (this.state.lastMessage && message.createdAt - this.state.lastMessage.createdAt  > (1000 * 60 * 60)) {
        _messages.push({isDate: true, createdAt: message.createdAt});
      }

      var _newMessageList = _messages.concat(this.state.messages);
      this.setState({
        messages: _newMessageList,
        isFirst: false
      });
      this.filterPhotos(_newMessageList);
      this.state.lastMessage = message;
      this.text = '';
      this.commentInputRef.clear();
      this.setState({disabled: true});
    });
  }

  _onPhoto() {
    if (Platform.OS === 'android'){
      sb.disableStateChange();
    }
    this.ActionSheet.show();
  }

  async onSend() {
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
  
        var _messages = [];
        _messages.push(message);
        if (this.state.lastMessage && message.createdAt - this.state.lastMessage.createdAt  > (1000 * 60 * 60)) {
          _messages.push({isDate: true, createdAt: message.createdAt});
        }
  
        var _newMessageList = _messages.concat(this.state.messages);
        this.setState({
          messages: _newMessageList,
          isFirst: false
        });
        this.state.lastMessage = message;
        this.text = '';
        this.setState({disabled: true, commentHeight: 45});        
        this.commentInputRef.clear();
        this.setState({disabled: true});
      });
    } else {
      Keyboard.dismiss();
      this.refs.toast.show(Messages.NoInternet, TOAST_SHOW_TIME);
    }
  }

  onChangeText(text) {
    this.text= text;
    const disabled = (text.trim().length > 0) ? false : true;
    if (disabled === this.state.disabled) return;
    
    this.setState({ disabled })
  }

  _onAudio() {
    Keyboard.dismiss();
    this.setState({
      showWalkieTalkie: true
    });
  }

  onDoneRecording(filename, currentTime, filePath, fileSize) {
    const type = "audio/aac";
    this.props.dispatch({
      type: actionTypes.UPLOAD_ATTACH_FILE,
      file: {
        filename: filename,
        type: type,
        uri: filePath
      },
    });

    this.setState({showWalkieTalkie: false});
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
    const image = item.message;
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

  render() {
    const { isImageViewVisible, photos, currentPhotoIndex } = this.state;
    const currentUser = sb.currentUser;    
    const { user, room } = this.props.route.params;  
    var name = "";
    if (user) {
      name = user.firstName + " " + user.lastName;
    } else {
      name = room;
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <TopNavBar 
          title={name} 
          rightIcon="walkie_talkie" 
          onBack={() => this.onBack()}
          onRight={() => this._onAudio()}
        />
        <ChatView 
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.container} 
        >
          <View style={[styles.chatContainer, {transform: [{ scaleY: -1 }]}]}>
              <FlatList
                  enableEmptySections={true}
                  onEndReached={() => this._getChannelMessage(false)}
                  onEndReachedThreshold={PULLDOWN_DISTANCE}
                  data={this.state.messages}
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
            this.state.messages.length == 0
            ? <View style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                { 
                  !this.state.isFirst
                  ? <EmptyText icon="💬">{emptyText}</EmptyText>
                  : null
                }
              </View>
            : null 
          }
          {
            this.state.channel
              ? <CommentInput
                  textRef={(ref) => {this.commentInputRef=ref}}
                  style={{width: '100%', paddingLeft: 15, paddingRight: 15,zIndex: 100, paddingTop: 3, paddingBottom: 3, backgroundColor:'white'}}
                  inputStyle={{height: Math.max(30, this.state.commentHeight)}}
                  placeholder='Write a message...'
                  onChangeText={this.onChangeText}
                  onPost={this.onSend}
                  onImagePress={() => this._onPhoto()}
                  onAudioPress={() => this._onAudio()}
                  onGifPress={this.onInsertGifButtonPress}
                  onContentSizeChange={(event) => this.setState({
                    commentHeight: event.nativeEvent.contentSize.height
                  })}
                />
              : null
          }

          {
            this.state.showWalkieTalkie
            ? <WalkieTalkie 
                onDone={(currentTime, filePath, fileSize) => this.onDoneRecording(currentTime, filePath, fileSize)}
              />
            : null
          }

          <ActionSheet
            ref={o => this.ActionSheet = o}
            title={'Choose Media'}
            options={['Take Media...', 'Choose Media from Gallery...', 'Cancel']}
            cancelButtonIndex={2}
            onPress={(index) => this.selectActionSheet(index)}
          />
      </ChatView>
      <Toast ref="toast"/>
      { this.state.isLoading
        ? <LoadingOverlay />
        : null
      } 
      <ImageView
        images={photos}
        imageIndex={currentPhotoIndex}
        isSwipeCloseEnabled={true}
        isVisible={isImageViewVisible}
        onClose={() => this.setState({isImageViewVisible: false})}
      />     
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

  inputContainer: {
    height: 44,
    borderTopWidth: 1 / PixelRatio.get(),
    borderColor: '#b2b2b2',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    alignSelf: 'center',
    height: 30,
    width: 100,
    backgroundColor: '#FFF',
    flex: 1,
    padding: 0,
    margin: 0,
    fontSize: 15,
  },
  photoButton: {
    marginTop: 11,
    marginRight: 10,
  },
  sendButton: {
    marginTop: 11,
    marginLeft: 10,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f7f8fc',
    padding: 5,
  },

  adListItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e6e9f0',
    padding: 5,
    margin: 5,
  },

  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15
  },
  senderIcon: {
    width: 30,
    height: 30
  },
  senderContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  senderText: {
    fontSize: 12,
    color: '#ababab'
  },
  dateText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#ababab',
    fontWeight: 'bold'
  }
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
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ChatScreen);