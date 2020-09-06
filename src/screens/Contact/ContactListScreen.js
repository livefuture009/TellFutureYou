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
import { filterName, getInviteMessage } from '../../functions';
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

class ContactListScreen extends Component {
  constructor(props) {
    super(props)
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

  getContacts() {
    const { currentUser } = this.props;
    if (currentUser && currentUser.contacts && currentUser.contacts.length > 0) {
      this.sortContacts(currentUser.contacts);
      var list = [];
      currentUser.contacts.forEach(c => {
        if (c.status < 2) {
          list.push(c);
        }
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
        this.props.navigation.navigate('FriendStack');
        this.props.dispatch({
          type: actionTypes.CHANGE_FRIEND_ACTIVE_PAGE,
          page: 2,
        });
        setTimeout(() => {
          this.props.dispatch({
            type: actionTypes.RESET_FRIEND_PAGE,
          });
        }, 1000);
      } 
      else if (this.props.sendFriendRequestStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
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
              this.refs.toast.show("Read Contacts Permission Denied", TOAST_SHOW_TIME);
            } else {
              this.parseContacts(contacts);
            }
          })
        } else {
          this.refs.toast.show("Read Contacts Permission Denied", TOAST_SHOW_TIME);
        }
      }
      catch (err) {
        console.warn(err)
      }
    }
    else {
      Contacts.getAll((err, contacts) => {
        if (err === 'denied'){
          this.refs.toast.show("Read Contacts Permission Denied", TOAST_SHOW_TIME);
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
    console.log("index: ", index);

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

    var content = getInviteMessage(receiver, sender);

    Mailer.mail({
      subject: 'TellFutureYou Invite',
      recipients: [selectedContact.email],
      body: content,
      isHTML: true,
    }, (error, event) => {
      Alert.alert(
        error,
        event,
        [
          {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
          {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
        ],
        { cancelable: true }
      )
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
          this.refs.toast.show(Messages.SMSPermissionDenied, TOAST_SHOW_TIME);
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

    var content = `Hello ${receiver},\r\n
      ${sender} invited you to use TellFutureYou app. Please download the app using the link below. \r\n
      https://apps.apple.com/us/app/chat-in/id1083597720
    `;

    SendSMS.send({
      body: content,
      recipients: [selectedContact.phone],
      successTypes: ['sent', 'queued'],
      allowAndroidSendWithoutReadPermission: true
    }, (completed, cancelled, error) => {
        console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
    });
  }

  onSendMessage=(data)=> {
    if (data.userId) {
      this.setState({isLoading: true}, () => {
        const { currentUser } = this.props;
        this.props.dispatch({
          type: actionTypes.SEND_FRIEND_REQUEST,
          userId: currentUser._id,
          friendId: data.userId
        });
      });
    }
  }

  onSelect=(data)=> {
    if (data.status == 0) {
      this.props.navigation.navigate('ContactDetail', {contact: data});
    }    
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
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <View style={styles.container}>
          <HeaderInfoBar 
            title="MY CONTACTS" 
            rightButton="plus"
            onRight={this.onAddContact}
          />
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
                        onSendInvite={this.onSendInvite}
                        onSendMessage={this.onSendMessage}
                        onSelect={this.onSelect}
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
        <Toast ref="toast"/>
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
    errorMessage: state.user.errorMessage,
    sendInviteStatus: state.user.sendInviteStatus,
    sendFriendRequestStatus: state.user.sendFriendRequestStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ContactListScreen);