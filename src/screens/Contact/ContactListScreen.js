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
import Contacts from 'react-native-contacts';
import HeaderInfoBar from '../../components/HeaderInfoBar'
import SearchBox from '../../components/SearchBox'
import LoadingOverlay from '../../components/LoadingOverlay'
import AddContactDialog from '../../components/AddContactDialog'
import ContactCell from '../../components/Cells/ContactCell'
import actionTypes from '../../actions/actionTypes';
import EmptyView from '../../components/EmptyView'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

class ContactListScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      contacts: [],
      isShowAddContactDialog: false,
    }    
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser && currentUser.contacts && currentUser.contacts.length > 0) {
      this.setState({contacts: currentUser.contacts});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentUser != this.props.currentUser) {
      if (this.props.currentUser.contacts && this.props.currentUser.contacts.length > 0) {
        this.setState({contacts: this.props.currentUser.contacts});
      }  
    }

    if (prevProps.sendInviteStatus != this.props.sendInviteStatus) {
      if (this.props.sendInviteStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showResultMessage(Messages.SuccessInvite, false);
      } 
      else if (this.props.sendInviteStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onFailure() {
    this.setState({isLoading: false, isFirst: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onAddContact=()=> {
    this.setState({isShowAddContactDialog: true});
  }

  onSelectAddContact=(type)=> {
    this.setState({isShowAddContactDialog: false});
    if (type == 0) {
      this.importContacts();
    } else {
      this.props.navigation.navigate('AddNewContact');
    }
  }

  importContacts() {
    if (Platform.OS == 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'This app would like to view your contacts.',
          'buttonPositive': 'Please accept bare mortal'
        }
      ).then(() => {
        Contacts.getAll((err, contacts) => {
          if (err === 'denied'){
            // error
          } else {
            this.parseContacts(contacts);
          }
        })
      })
    } else {
      Contacts.getAll((err, contacts) => {
        if (err === 'denied'){
          // error
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
    const { currentUser } = this.props;
    const sender = currentUser.firstName + " " + currentUser.lastName;

    this.setState({isLoading: true});
    this.props.dispatch({
      type: actionTypes.SEND_INVITE,
      email: data.email,
      sender: sender,
      receiver: data.name
    });
  }

  onSendMessage=(data)=> {

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
    const { contacts, keyword, isFirst, isShowAddContactDialog } = this.state;

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
                onChangeText={(text) => this.searchService(text)}
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
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ContactListScreen);