import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../../components/TopNavBar'
import SearchBox from '../../components/SearchBox'
import LoadingOverlay from '../../components/LoadingOverlay'
import ContactCell from '../../components/Cells/ContactCell'
import RoundButton from '../../components/RoundButton'
import actionTypes from '../../actions/actionTypes';
import EmptyView from '../../components/EmptyView'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'
import { filterName } from '../../functions';

class ImportContactScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      contacts: [],
      originalContacts: [],
      isShowAddContactDialog: false,
    }    
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.contacts) {
        const { contacts } = this.props.route.params;
        if (contacts && contacts.length > 0) {
            var list = [];
            contacts.forEach(c => {
                const firstName = c.givenName;
                const lastName = c.familyName;
                const avatar = c.thumbnailPath;
                var phone = '';
                if (c.phoneNumbers && c.phoneNumbers.length > 0) {
                    phone = c.phoneNumbers[0].number;
                }
                var email = '';
                if (c.emailAddresses && c.emailAddresses.length > 0) {
                    email = c.emailAddresses[0].email;
                }

                list.push({
                    id: c.recordID,
                    firstName: firstName,
                    lastName: lastName,
                    avatar: avatar,
                    phone: phone,
                    email: email,
                    selected: false,
                });
            });

            this.sortContacts(list);
            this.setState({contacts: list, originalContacts: list});
        }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.importContactsStatus != this.props.importContactsStatus) {
      if (this.props.importContactsStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showResultMessage(Messages.SuccessImportContacts, true);
      } 
      else if (this.props.importContactsStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  sortContacts(contacts) {
    contacts.sort((a, b) => {
      const nameA = filterName(a.firstName.trim(), a.lastName.trim());
      const nameB = filterName(b.firstName.trim(), b.lastName.trim());
      return nameA > nameB ? 1 : -1;
    })
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

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onImport=()=> {
    const { currentUser } = this.props;
    const { contacts } = this.state;
    var list = [];
    contacts.forEach(c => {
      if (c.selected) {
        list.push(c);
      }
    });

    if (list && list.length > 0) {
      this.setState({isLoading: true});
      this.props.dispatch({
        type: actionTypes.IMPORT_CONTACTS,
        userId: currentUser._id,
        contacts: list,
      });
    } 
    else {
      this.refs.toast.show(Messages.InvalidSelectedContacts, TOAST_SHOW_TIME);
    }
  }

  searchContacts(keyword) {
    var text = keyword.toLowerCase().trim();
    const { originalContacts } = this.state;
    if (text && text.length > 0) {
        var list = [];
        originalContacts.forEach(item => {
          
          if (item.firstName.toLowerCase().indexOf(text) >= 0 
          || item.lastName.toLowerCase().indexOf(text) >= 0
          || item.email.toLowerCase().indexOf(text) >= 0
          || item.phone.toLowerCase().indexOf(text) >= 0) 
          {
              list.push(item);
          }
        });

        this.setState({contacts: list});
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

  render() {
    const { contacts, keyword } = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.container}>
            <TopNavBar title="IMPORT CONTACTS" align="left" onBack={() => this.onBack()}/>
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
                        ?  <View style={{flex: 1}}>
                            <FlatList
                                data={contacts}
                                keyExtractor={(item, index) => index.toString()}
                                ListFooterComponent={() => (<View style={{height: 70}}/>)}
                                renderItem={({ item, index }) => (
                                <ContactCell 
                                    data={item} 
                                    isImport={true}
                                    onSelect={this.onSelectContact}
                                />
                                )}
                            />
                            <View style={styles.footer}>
                                <RoundButton title="Import" theme="blue" onPress={this.onImport}/>
                            </View>
                            </View>
                        : <EmptyView title="No contacts."/>
                    }
                </View>
            </View>
        </View>
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

  footer: {
    backgroundColor: 'white',
    padding: 20,
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
    importContactsStatus: state.user.importContactsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ImportContactScreen);