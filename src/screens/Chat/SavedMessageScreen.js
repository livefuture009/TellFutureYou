import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Image,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import PushNotification from "react-native-push-notification"
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import moment from 'moment';
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
import { TOAST_SHOW_TIME, Status, IMAGE_COMPRESS_QUALITY, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT } from '../../constants.js'
import EmptyText from '../../components/Decoration/EmptyText'
import LoadingOverlay from '../../components/LoadingOverlay'
import actionTypes from '../../actions/actionTypes';
import {checkInternetConnectivity} from '../../functions'
import ScheduleDialog from '../../components/ScheduleDialog'
import QuoteDialog from '../../components/QuoteDialog/QuoteDialog'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';

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
      isShowQuoteDialog: false,
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
        this.sentSelfMessageCompleted();
      } 
      else if (this.props.createSelfMessageStatus == Status.FAILURE) {
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

  sentSelfMessageCompleted() {
    const { selectedMessage, selectedUser } = this.props;

    // Send Scheduled Local Notification.
    if (selectedMessage.isSelf) {
      var message = "";
      if (selectedMessage.type == "text" || selectedMessage.type == "quote") {
        message = selectedMessage.message;
      }
      else {
        message = "[Image]";
      }

      PushNotification.localNotificationSchedule({
        id: selectedMessage._id, 
        message: message,
        date: moment(selectedMessage.scheduledAt).toDate(),
        allowWhileIdle: false,
        userInfo: {
          isSelf: true
        }
      });
    }

    if (selectedUser && selectedUser._id) {
      this.props.dispatch({
        type: actionTypes.SET_CURRENT_USER,
        user: selectedUser
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
    const options = {
      mediaType: 'photo',
      forceJpg:false
    };

    if (index === OPEN_CAMERA) {
      ImagePicker.openCamera(options).then(response => {
        this.setState({isShowScheduleDialog: true, selectedImage: response});
      });
    } 
    else if (index === OPEN_GALLERY) {
      ImagePicker.openPicker(options).then(response => {
        this.setState({isShowScheduleDialog: true, selectedImage: response});
      });
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
      this.setState({selectedImage: null});
    } 
    else {
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

  async addMediaMessage(url) {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      const { selectedScheduleData } = this.state;
      var data = {};
      if (selectedScheduleData) {
        data = selectedScheduleData;
        data['image'] = url;
      }
      else {
        const message = (this.text) ? this.text.trim() : "";
        const { currentUser } = this.props;
        data = {
          message,
          image: url,
          creator: currentUser._id,
          type: 'image',
        };
      }
      this.setState({isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.CREATE_SELF_MESSAGE,
          data
        });
      });
      this.resetMessageInput();
    } 
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

  _onPhoto=()=> {
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
    this.setState({
      disabled: true, 
      commentHeight: 45, 
      selectedImage: null,
      selectedQuote: null,
      selectedScheduleData: null,
    });        
    this.commentInputRef.clear();
  }

  onChangeText=(text)=> {
    this.text= text;
    const disabled = (text.trim().length > 0) ? false : true;
    if (disabled === this.state.disabled) return;
    this.setState({ disabled })
  }

  onMoveSchedulePage=()=> {
    this.props.navigation.navigate('ScheduleMessage');
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

  onSelectScheduleDate(date) {
    this.setState({isShowScheduleDialog: false});
    
    const { currentUser } = this.props;
    const { selectedQuote, selectedImage } = this.state;
    const scheduledAt = moment(date).unix() * 1000;
    var data = {
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
      this.props.dispatch({
        type: actionTypes.CREATE_SELF_MESSAGE,
        data,
      });
    });

    this.resetMessageInput();
  }

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
      }, 300);
    });
  }

  async sendQuoteMessage(quote) {
    const isConnected = await checkInternetConnectivity();
    if (isConnected) {
      const { currentUser } = this.props;
      this.setState({isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.CREATE_SELF_MESSAGE,
          data: {
            message: quote.content,
            author: quote.author,
            creator: currentUser._id,
            type: 'quote',
          },
        });
      });
      this.setState({selectedQuote: null});
    } 
    else {
      this.toast.show(Messages.NetWorkError, TOAST_SHOW_TIME);
    }
  }

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
      isShowScheduleDialog, 
      isShowQuoteDialog,
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
                { this._renderInspiration()}
                <View style={[styles.chatContainer, {transform: [{ scaleY: -1 }]}]}>
                  <FlatList
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={() => (<View style={{height: 20}}/>)}
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

    errorScheduledMessage: state.scheduledMessages.errorMessage,
    createSelfMessageStatus: state.scheduledMessages.createSelfMessageStatus,
    getSelfMessagesStatus: state.scheduledMessages.getSelfMessagesStatus,
    selfMessages: state.scheduledMessages.selfMessages,
    selectedUser: state.scheduledMessages.selectedUser,
    selectedMessage: state.scheduledMessages.selectedMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SavedMessageScreen);