import React, { Component } from 'react';
import {
  View,
  Alert,
  SafeAreaView,
  Text,
  StyleSheet,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import LabelFormInput from '../../components/LabelFormInput'
import EditAvatar from '../../components/EditAvatar'
import Colors from '../../theme/Colors'
import LoadingOverlay from '../../components/LoadingOverlay'
import Messages from '../../theme/Messages'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import {validateEmail, getOnlyAlphabetLetters} from '../../functions'

class ContactDetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
        id: '',
        avatar: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',

        firstNameError: '',
        lastNameError: '',
        emailError: '',
        phoneError: '',
        isLoading: false,
        isEditing: false,
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.contact) {
      const { contact } = this.props.route.params;
      this.setState({
        id: contact._id,
        avatar: contact.avatar,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        isEditing: true
      });
    }     
  }

  componentDidUpdate(prevProps, prevState) {
    // Add Contact
    if (prevProps.addContactStatus != this.props.addContactStatus) {
      if (this.props.addContactStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showMessage(Messages.SuccessAddContact, true);
      } else if (this.props.addContactStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }    

    // Edit Contact
    if (prevProps.editContactStatus != this.props.editContactStatus) {
      if (this.props.editContactStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showMessage(Messages.SuccessEditContact, true);
      } else if (this.props.editContactStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }    
  }

  showMessage(message, isBack) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          if (isBack) this.onBack();
        }},
      ],
      {cancelable: false},
    ); 
  }

  onFailure(message) {
    if (!(message && message.length > 0)) {
      message = Messages.NetWorkError;
    }
    this.setState({isLoading: false});
    this.refs.toast.show(message, TOAST_SHOW_TIME);
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ services: selectedItems, servicesError: null });
  };

  onBack() {
    this.props.navigation.goBack();
  }

  onChangeLocation(address) {
    this.setState({location: address, locationText: address});
  }

  onMakeChanges() {
    Keyboard.dismiss();
    const { currentUser } = this.props;
    var isValid = true;
    const {
      id,
      firstName, 
      lastName, 
      email, 
      phone, 
      avatarFile,
      isEditing
    } = this.state;

    if (firstName == null || firstName.length == 0) {
      this.setState({firstNameError: Messages.InvalidFirstname});
      isValid = false;
    }

    if (lastName == null || lastName.length == 0) {
      this.setState({lastNameError: Messages.InvalidLastname});
      isValid = false;
    }

    if (email == null || email.length == 0 || !validateEmail(email)) {
      this.setState({emailError: Messages.InvalidEmail});
      isValid = false;
    }

    if (phone == null || phone.length == 0) {
      this.setState({phoneError: Messages.InvalidPhone});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        var user = {
          firstName,
          lastName,
          email,
          phone,
          avatarFile,
        };

        if (isEditing) {
          user.id = id;
          this.props.dispatch({
            type: actionTypes.EDIT_CONTACT,
            contact: user,
            userId: currentUser._id,
          });
        } else {
          this.props.dispatch({
            type: actionTypes.ADD_CONTACT,
            contact: user,
            userId: currentUser._id,
          });
        }
      });  
    }
  }

  onTakePicture() {
    const options = {
      title: 'Select Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        this.setState({
          avatar: response.uri,
          avatarFile: response
        });
      }
    });
  }

  onChangeFirstName =(text)=> {
    const name = getOnlyAlphabetLetters(text);
    this.setState({firstName: name, firstNameError: null});
  }

  onChangeLastName =(text)=> {
    const name = getOnlyAlphabetLetters(text);
    this.setState({lastName: name, lastNameError: null});
  }

  onChangeEmail =(text)=> {
    if (validateEmail(text)) {
      this.setState({email: text, emailError: null})
    } else {
      this.setState({email: text})
    }
  }

  render() {
    const { currentUser } = this.props;
    const { isEditing } = this.state;
    var title = "ADD CONTACT";
    if (isEditing) title = "EDIT CONTACT";

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <TopNavBar title={title} align="left" onBack={() => this.onBack()}/>
        <View style={styles.container}>
              <View style={styles.profileBox}>
              <KeyboardAwareScrollView>      
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <EditAvatar avatar={this.state.avatar} onTakePhoto={() => this.onTakePicture()} />
                </View>                          
                <LabelFormInput
                    label="First Name" 
                    type="text"
                    placeholder="John"
                    placeholderTextColor={Colors.placeholderColor}
                    value={this.state.firstName} 
                    errorMessage={this.state.firstNameError}
                    returnKeyType="next"                                       
                    onSubmitEditing={() => { this.lastNameInput.focus() }}
                    onChangeText={this.onChangeFirstName} 
                    style={{marginTop: 20}}
                />

                <LabelFormInput
                    label="Last Name" 
                    type="text"
                    placeholder="Doe"
                    placeholderTextColor={Colors.placeholderColor}
                    value={this.state.lastName} 
                    errorMessage={this.state.lastNameError}
                    returnKeyType="next"                                       
                    onRefInput={(input) => { this.lastNameInput = input }}
                    onSubmitEditing={() => { this.emailInput.focus() }}
                    onChangeText={this.onChangeLastName} 
                />

                <LabelFormInput
                  label="Email" 
                  type="email"
                  placeholder="john@email.com"
                  placeholderTextColor={Colors.placeholderColor}
                  value={this.state.email} 
                  errorMessage={this.state.emailError}
                  returnKeyType="next"                                       
                  onRefInput={(input) => { this.emailInput = input }}
                  onSubmitEditing={() => { this.phoneInput.focus() }}
                  onChangeText={this.onChangeEmail} 
                />

                <LabelFormInput
                  label="Phone" 
                  type="phone"
                  placeholder="123-456-7890"
                  placeholderTextColor={Colors.placeholderColor}
                  value={this.state.phone} 
                  errorMessage={this.state.phoneError}
                  returnKeyType="done"                                       
                  onRefInput={(input) => { this.phoneInput = input }}
                  onSubmitEditing={() => { this.onMakeChanges() }}
                  onChangeText={(text) => this.setState({phone: text, phoneError: null})} />

                <View style={styles.centerView}>
                  <RoundButton 
                    title="Save" 
                    theme="blue" 
                    style={styles.blueButton} 
                    onPress={() => this.onMakeChanges()} />
                </View>
                </KeyboardAwareScrollView>
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

  centerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },

  blueButton: {
    width: '90%'
  },

  profileBox: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
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
    addContactStatus: state.user.addContactStatus,    
    editContactStatus: state.user.editContactStatus,    
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ContactDetailScreen);