import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import ActionSheet from 'react-native-actionsheet'
import Mailer from 'react-native-mail';
import SendSMS from 'react-native-sms';
import Contacts from 'react-native-contacts';
import HeaderInfoBar from '../../components/HeaderInfoBar'
import SearchBox from '../../components/SearchBox'
import LoadingOverlay from '../../components/LoadingOverlay'
import AddContactDialog from '../../components/AddContactDialog'
import ContactCell from '../../components/Cells/ContactCell'
import actionTypes from '../../actions/actionTypes';
import EmptyView from '../../components/EmptyView'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import { filterName, getInviteMessage, getFriendCountByLevel } from '../../functions';
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

class ContactListScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      contacts: [],
      originalContacts: [],

      isShowAddContactDialog: false,
      inviteOptions: [],
      selectedContact: null
    }    
  }

  componentDidMount() {
    this.getContacts();

    this.focusListener = this.props.navigation.addListener('focus', () => {
      const { currentUser } = this.props;
      this.props.dispatch({
        type: actionTypes.GET_CONTACT_STATUS,
        userId: currentUser._id,
      });
    });
  }

  componentWillUnmount() {
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

  getContacts() {
    const { currentUser } = this.props;
    if (currentUser && currentUser.contacts) {
      this.sortContacts(currentUser.contacts);
      var list = [];
      currentUser.contacts.forEach(c => {
        list.push(c);
      });
      this.setState({
        contacts: list, 
        originalContacts: list
      });
    }
  }

  sortContacts(contacts) {
    contacts.sort((a, b) => {
      const firstNameA = a.firstName ? a.firstName.trim() : '';
      const lastNameA = a.lastName ? a.lastName.trim() : '';

      const firstNameB = b.firstName ? b.firstName.trim() : '';
      const lastNameB = b.lastName ? b.lastName.trim() : '';

      const nameA = filterName(firstNameA, lastNameA);
      const nameB = filterName(firstNameB, lastNameB);
      return nameA > nameB ? 1 : -1;
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentUser != this.props.currentUser) {
      this.getContacts();
    }

    // Send Invite.
    if (prevProps.sendInviteStatus != this.props.sendInviteStatus) {
      if (this.props.sendInviteStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showResultMessage(Messages.SuccessInvite, false);
      } 
      else if (this.props.sendInviteStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Send Friend Request.
    if (prevProps.sendFriendRequestStatus != this.props.sendFriendRequestStatus) {
      if (this.props.sendFriendRequestStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
      } 
      else if (this.props.sendFriendRequestStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Remove Request.
    if (prevProps.removeFriendStatus != this.props.removeFriendStatus) {
      if (this.props.removeFriendStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
      } 
      else if (this.props.removeFriendStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Accept Friend Request
    if (prevProps.acceptFriendRequestStatus != this.props.acceptFriendRequestStatus) {
      if (this.props.acceptFriendRequestStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
      } 
      else if (this.props.acceptFriendRequestStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onFailure() {
    this.setState({isLoading: false});
    this.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  onBack() {
    this.props.navigation.goBack();
  }

  searchContacts(keyword) {
    var text = keyword.toLowerCase().trim();
    const { originalContacts } = this.state;
    if (text && text.length > 0) {
      var list = [];
      if (originalContacts && originalContacts.length > 0) {
        originalContacts.forEach(item => {
          const name = item.firstName + " " + item.lastName;
          if (name.toLowerCase().indexOf(text) >= 0) {
              list.push(item);
          }
        });
        this.setState({contacts: list});
      }
    } 
    else {
        this.setState({contacts: originalContacts});
    }
  }

  onSelectContact=(c)=> {
    c.selected = !c.selected;
    const { contacts } = this.state;
    var list = [];
    if (contacts && contacts.length > 0) {
        contacts.forEach(item => {
            if (item.id == c.id) {
                list.push(c);
            } else {
                list.push(item);
            }
        });

        this.setState({contacts: list});
    }
  }

  onAddContact=()=> {
    this.setState({isShowAddContactDialog: true});
  }

  onSelectAddContact=(type)=> {
    this.setState({isShowAddContactDialog: false});
    if (type == 0) {
      this.importContacts();
    } else {
      this.props.navigation.navigate('ContactDetail');
    }
  }

  async importContacts() {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            'title': 'Contacts',
            'message': 'This app would like to view your contacts.',
            'buttonPositive': 'Accept'
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Contacts.getAll((err, contacts) => {
            if (err === 'denied'){
              this.toast.show("Read Contacts Permission Denied", TOAST_SHOW_TIME);
            } else {
              this.parseContacts(contacts);
            }
          })
        } else {
          this.toast.show("Read Contacts Permission Denied", TOAST_SHOW_TIME);
        }
      }
      catch (err) {
        console.warn(err)
      }
    }
    else {
      Contacts.getAll((err, contacts) => {
        if (err === 'denied'){
          this.toast.show("Read Contacts Permission Denied", TOAST_SHOW_TIME);
        } else {
          this.parseContacts(contacts);
        }
      })
    }
  }

  parseContacts(contacts) {
    this.props.navigation.navigate('ImportContact', {contacts: contacts});
  }

  onSendInvite=(data)=> {
    if (Platform.OS == "android") {
      this.setState({selectedContact: data}, () => {
        this.sendEmail();
      });      
    }
    else {
      var options = [];
      if (data.email && data.email.length > 0) {
        options.push('Via Email');
      }
  
      if (data.phone && data.phone.length > 0) {
        options.push('Via SMS');
      }
  
      if (options.length > 0) {
        options.push('Cancel');
        this.setState({selectedContact: data, inviteOptions: options}, () => {
          this.ActionSheet.show();
        });
      }
    }

    /*
    this.setState({isLoading: true});
    this.props.dispatch({
      type: actionTypes.SEND_INVITE,
      email: data.email,
      sender: sender,
      receiver: receiver
    });
    */
  }

  selectActionSheet(index) {
    const { inviteOptions } = this.state;
    if (inviteOptions[index] == "Via Email") {
      this.sendEmail();
    } 
    else if (inviteOptions[index] == "Via SMS") {
      this.sendSMS();
    }
    
  }

  sendEmail() {
    const { currentUser } = this.props;
    const { selectedContact } = this.state;
    const sender = currentUser.firstName + " " + currentUser.lastName;
    const receiver = selectedContact.firstName + " " + selectedContact.lastName;

    var content = getInviteMessage(receiver, sender, "email");

    Mailer.mail({
      subject: 'TellFutureYou Invite',
      recipients: [selectedContact.email],
      body: content,
      isHTML: true,
    }, (error, event) => {
      console.log("error: ", error);
      console.log("event: ", event);

      var message = "";
      if (error && error.length > 0) {
        if (error == "not_available") {
          message = Messages.MailNotAvailable;
        }
      }
      else {
        if (event == "sent") {
          message = Messages.InviteSent;
        }
      }

      if (message && message.length > 0) {
        Alert.alert(
          message,
          '',
          [
            {text: 'Ok', onPress: () => console.log('OK')},
          ],
          { cancelable: true }
        )
      }
    });
  }

  async sendSMS() {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            'title': 'SMS',
            'message': Messages.SMSAskPermission,
            'buttonPositive': 'Accept'
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.processSMS();
        } else {
          this.toast.show(Messages.SMSPermissionDenied, TOAST_SHOW_TIME);
        }
      }
      catch (err) {
        console.warn(err)
      }
    }
    else {
      this.processSMS();
    }
  }

  processSMS() {
    const { currentUser } = this.props;
    const { selectedContact } = this.state;

    const sender = currentUser.firstName + " " + currentUser.lastName;
    const receiver = selectedContact.firstName + " " + selectedContact.lastName;

    var content = getInviteMessage(receiver, sender, "sms");
    SendSMS.send({
      body: content,
      recipients: [selectedContact.phone],
      successTypes: ['sent', 'queued'],
      allowAndroidSendWithoutReadPermission: true
    }, (completed, cancelled, error) => {
      var message = "";
      if (error) {
        message = Messages.SMSNotAvailable;
      }
      else if (completed) {
        message = Messages.InviteSent;
      }
      else if (cancelled) {
        message = Messages.InviteFailed;
      }

      if (message && message.length > 0) {
        Alert.alert(
          message,
          '',
          [
            {text: 'Ok', onPress: () => console.log('OK')},
          ],
          { cancelable: true }
        )
      }
      console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
    });
  }

  onSendMessage=(data)=> {
    const { currentUser, friends } = this.props;
    const limitCount = getFriendCountByLevel(currentUser.level);
    const friendCount = friends ? friends.length : 0;
    
    console.log("limitCount: ", limitCount);
    console.log("friendCount: ", friendCount);

    if (friendCount >= limitCount ) {
      Alert.alert(
        Messages.UnableSendRequest,
        Messages.ReachedFriendLimit,
        [
          {text: 'Ok', onPress: () => console.log('Limited')},
        ],
        { cancelable: true }
      )
    } else {
      if (data.userId) {
        this.setState({isLoading: true}, () => {
          const { currentUser } = this.props;
          this.props.dispatch({
            type: actionTypes.SEND_FRIEND_REQUEST,
            userId: currentUser._id,
            friendId: data.userId,
            contactId: data._id
          });
        });
      }
    }
  }

  onRemoveFriend=(data)=> {
    if (data.friendId) {
      const { currentUser } = this.props;
      this.setState({isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.REMOVE_FRIEND,
          userId: currentUser._id,
          friendId: data.friendId
        });
      });
    }
  }

  acceptRequest=(data)=> {
    if (data.friendId) {
      const { currentUser } = this.props;
      this.setState({isLoading: true}, () => {
        this.props.dispatch({
          type: actionTypes.ACCEPT_FRIEND_REQUEST,
          userId: currentUser._id,
          friendId: data.friendId
        });
      });
    }
  }

  onSelect=(data)=> {
    this.props.navigation.navigate('ContactDetail', {contact: data});
  }

  showResultMessage(message, isBack) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          if (isBack) {
            this.onBack();
          }
        }},
      ]
    );  
  }

  render() {
    const { contacts, keyword, isShowAddContactDialog, inviteOptions } = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.appColor}}>
        <HeaderInfoBar 
          title="MY CONTACTS" 
          rightButton="plus"
          onRight={this.onAddContact}
        />
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <View style={styles.contentView}>
              <SearchBox 
                style={{marginTop: 10, marginBottom: 10}} 
                value={keyword} 
                placeholder="Search ..." 
                onChangeText={(text) => this.searchContacts(text)}
              />
              {
                (contacts && contacts.length > 0)
                ?  <FlatList
                    data={contacts}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={() => (<View style={{height: 70}}/>)}
                    renderItem={({ item, index }) => (
                      <ContactCell 
                        data={item}
                        onSelect={this.onSelect}
                        onSendInvite={this.onSendInvite}
                        onSendMessage={this.onSendMessage}
                        onCancelRequest={this.onRemoveFriend}
                        onRemoveFriend={this.onRemoveFriend}
                        onAcceptRequest={this.acceptRequest}
                      />
                    )}
                  />
                : <EmptyView title="No contacts."/>

              }
            </View>
          </View>
        </View>
        <AddContactDialog 
          isVisible={isShowAddContactDialog} 
          onClose={() => this.setState({isShowAddContactDialog: false})}
          onSelect={this.onSelectAddContact}
        />
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={inviteOptions}
          cancelButtonIndex={inviteOptions.length - 1}
          onPress={(index) => this.selectActionSheet(index)}
        />
        <Toast ref={ref => (this.toast = ref)}/>
        { this.state.isLoading && <LoadingOverlay /> } 
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentView: {
    flex: 1,
    backgroundColor: '#f2f2f5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
    friends: state.user.friends,
    errorMessage: state.user.errorMessage,
    sendInviteStatus: state.user.sendInviteStatus,
    sendFriendRequestStatus: state.user.sendFriendRequestStatus,
    removeFriendStatus: state.user.removeFriendStatus,
    acceptFriendRequestStatus: state.user.acceptFriendRequestStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ContactListScreen);