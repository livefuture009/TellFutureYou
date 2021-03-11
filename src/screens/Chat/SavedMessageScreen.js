import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import ActionSheet from 'react-native-actionsheet'
import ImageResizer from 'react-native-image-resizer';
import ImageView from 'react-native-image-view';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import TopNavBar from '../../components/TopNavBar'
import SelfChatCell from '../../components/Cells/SelfChatCell'
import CommentInput from '../../components/CommentInput';
import RNFS from 'react-native-fs';
import { TOAST_SHOW_TIME, Status, PULLDOWN_DISTANCE, IMAGE_COMPRESS_QUALITY, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT } from '../../constants.js'
import EmptyText from '../../components/Decoration/EmptyText'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import {checkInternetConnectivity} from '../../functions'
import moment from 'moment';
import ScheduleDialog from '../../components/ScheduleDialog'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

const OPEN_CAMERA=0;
const OPEN_GALLERY=1;

const ChatView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();


class SavedMessageScreen extends Component {
  constructor() {
    super()
    this.scheduleTime = null;
    this.state = {
        disabled: true,
        messages: [],
        commentHeight: 0,
        isLoading: false,
        photos: [],
        isImageViewVisible: false,
        isShowScheduleDialog: false,
        currentPhotoIndex: 0,
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

  componentDidMount() {
    const { currentUser } = this.props;
    this.setState({isLoading: true}, () => {
      this.props.dispatch({
        type: actionTypes.GET_SELF_MESSAGE,
        data: {
          userId: currentUser._id
        },
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Upload File.
    if (prevProps.uploadFileStatus != this.props.uploadFileStatus) {
      if (this.props.uploadFileStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.addMediaMessage(this.props.uploadedUrl, this.props.uploadedMediaType);
      } else if (this.props.uploadFileStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }

    // Get Self Messages.
    if (prevProps.getSelfMessagesStatus != this.props.getSelfMessagesStatus) {
      if (this.props.getSelfMessagesStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
      } else if (this.props.getSelfMessagesStatus == Status.FAILURE) {
        this.onFailure(this.props.errorScheduledMessage);
      }      
    }

    // Create Self Messages.
    if (prevProps.createSelfMessageStatus != this.props.createSelfMessageStatus) {
      if (this.props.createSelfMessageStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
      } else if (this.props.createSelfMessageStatus == Status.FAILURE) {
        this.onFailure(this.props.errorScheduledMessage);
      }      
    }

    if (prevProps.selfMessages != this.props.selfMessages) {
      this.setState({messages: this.props.selfMessages});
    }
  }

  onFailure(message) {
    this.setState({isLoading: false});
    this.toast.show(message, TOAST_SHOW_TIME);
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
    //   var _messages = [];
    //   _messages.push(message);
    //   if (this.state.lastMessage && message.createdAt - this.state.lastMessage.createdAt  > (1000 * 60 * 60)) {
    //     _messages.push({isDate: true, createdAt: message.createdAt});
    //   }

    //   var _newMessageList = _messages.concat(this.state.messages);
    //   this.setState({
    //     messages: _newMessageList,
    //     isFirst: false
    //   });
    //   this.filterPhotos(_newMessageList);
    //   this.text = '';
    //   this.commentInputRef.clear();
    //   this.setState({disabled: true});
  }

  _onPhoto=()=> {
    if (Platform.OS === 'android'){
      sb.disableStateChange();
    }
    this.ActionSheet.show();
  }

  onSend=async()=> {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      if (this.text) {
        const message = this.text.trim();
        if (message && message.length > 0) {
          const { currentUser } = this.props;
          this.setState({isLoading: true}, () => {
            this.props.dispatch({
              type: actionTypes.CREATE_SELF_MESSAGE,
              data: {
                message,
                creator: currentUser._id,
                type: 'text',
              },
            });
          });
          this.resetMessageInput();
        }
      }
    } 
    else {
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
    this.setState({ disabled })
  }

  onMoveSchedulePage=()=> {
    // const { channel } = this.state; 
    // this.props.navigation.navigate('ScheduleMessage', {channel: channel});
  }

  onBack() {
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

  onSchedule=()=> {
    if (this.state.disabled) return;
    Keyboard.dismiss();
    this.setState({isShowScheduleDialog: true});
  }

  render() {
    const { currentUser } = this.props;
    const { 
      disabled, 
      isImageViewVisible, 
      isShowScheduleDialog, 
      photos, 
      messages,
      currentPhotoIndex, 
      isFirst
    } = this.state;

    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title="Saved Messages" 
                rightButton="schedule"
                onBack={() => this.onBack()}
                onRight={this.onMoveSchedulePage}
              />
              <ChatView 
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={styles.container} 
              >
                <View style={[styles.chatContainer, {transform: [{ scaleY: -1 }]}]}>
                  <FlatList
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, i}) => (
                      <SelfChatCell 
                        data={item} 
                        onPressImage={this.onPressImage}
                      />
                    )}
                  />
                </View>
                {
                  (messages && messages.length == 0)
                  ? <TouchableWithoutFeedback 
                      onPress={() => Keyboard.dismiss()} 
                      style={{flex: 1}}
                    >
                      <View style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        { 
                          !isFirst
                          ? <EmptyText icon="💬">Saved messages will show up here.</EmptyText>
                          : null
                        }
                      </View>
                    </TouchableWithoutFeedback>
                  : null 
                }
                <CommentInput
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
                    placeholder='Write a message...'
                    disabled={disabled}
                    onChangeText={this.onChangeText}
                    onPost={this.onSend}
                    onSchedule={this.onSchedule}
                    onImagePress={this._onPhoto}
                />
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
          />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },

  chatContainer: {
    flex: 1,
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
    errorMessage: state.globals.errorMessage,
    currentUser: state.user.currentUser,
    uploadedUrl: state.globals.uploadedUrl,
    uploadedMediaType: state.globals.uploadedMediaType,
    uploadFileStatus: state.globals.uploadFileStatus,

    errorScheduledMessage: state.scheduledMessages.errorMessage,
    createSelfMessageStatus: state.scheduledMessages.createSelfMessageStatus,
    getSelfMessagesStatus: state.scheduledMessages.getSelfMessagesStatus,
    selfMessages: state.scheduledMessages.selfMessages,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SavedMessageScreen);