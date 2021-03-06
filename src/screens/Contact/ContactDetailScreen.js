import React, { Component } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet'
import Toast from 'react-native-easy-toast'
import TopNavBar from '../../components/TopNavBar'
import RoundButton from '../../components/RoundButton'
import LabelFormInput from '../../components/LabelFormInput'
import EditAvatar from '../../components/EditAvatar'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import {validateEmail, getOnlyAlphabetLetters} from '../../functions'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

class ContactDetailScreen extends Component {
  constructor() {
    super()
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
        isDisabled: false,
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.contact) {
      const { contact } = this.props.route.params;
      var isDisabled = false;
      if (contact.status > 0) {
        isDisabled = true;
      }

      this.setState({
        id: contact._id,
        avatar: contact.avatar,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        isEditing: true,
        isDisabled: isDisabled
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
    
    // Remove Contact.
    if (prevProps.removeContactStatus != this.props.removeContactStatus) {
      if (this.props.removeContactStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showMessage(Messages.SuccessRemoveContact, true);
      } else if (this.props.removeContactStatus == Status.FAILURE) {
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
    this.toast.show(message, TOAST_SHOW_TIME);
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

    // Check Email if you have any contact.
    if (currentUser.contacts && currentUser.contacts.length > 0) {
      currentUser.contacts.forEach(c => {
        if (c._id != id && c.email == email) {
          this.setState({emailError: Messages.ContactIsExisting});
          isValid = false;
          return;          
        }
      });
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

  onRemoveContact() {
    const { currentUser } = this.props;
    const { id } = this.state;
    this.setState({isLoading: true}, () => {
      this.props.dispatch({
        type: actionTypes.REMOVE_CONTACT,
        userId: currentUser._id,
        contactId: id,
      });
    });
  }

  onTakePicture() {
    this.ActionSheet.show();
  }

  async onSelectMedia(index) {
    try {
      if (Platform.OS == "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "App Camera Permission",
            message:"App needs access to your camera ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.openImagePicker(index);
        } 
        else {
          console.log("Camera permission denied");
        }
      }
      else {
        this.openImagePicker(index);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  openImagePicker(index) {
    const options = {
			mediaType: 'photo',
		};
		
		if (index == 0) {
			launchCamera(options, (response) => {
				if (response.didCancel) {
				  console.log('User cancelled image picker');
				} else if (response.error) {
				  console.log('ImagePicker Error: ', response.error);
				} else {
					this.addPhoto(response);
				}
			});
		}
		else if (index == 1) {
			launchImageLibrary(options, (response) => {
				if (response.didCancel) {
				  console.log('User cancelled image picker');
				} else if (response.error) {
				  console.log('ImagePicker Error: ', response.error);
				} else {
					this.addPhoto(response);
				}
			});
		}
  }

  addPhoto(response) {
    this.setState({
      avatar: response.uri,
      avatarFile: response
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
    const { isEditing, isDisabled } = this.state;
    var title = "ADD CONTACT";
    if (isEditing) {
      if (isDisabled) {
        title = "VIEW CONTACT";
      } else {
        title = "EDIT CONTACT";
      }      
    }
    

    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title={title} 
                align="left" 
                rightButton={isEditing ? "remove" : null}
                onBack={() => this.onBack()}
                onRight={() => this.onRemoveContact()}
              />
              <View style={styles.container}>
                <View style={styles.profileBox}>
                <KeyboardAwareScrollView style={{paddingHorizontal: 20}}>      
                  <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                    <EditAvatar avatar={this.state.avatar} onTakePhoto={() => this.onTakePicture()} />
                  </View>                          
                  <LabelFormInput
                      label="First Name" 
                      type="text"
                      placeholder="John"
                      placeholderTextColor={Colors.placeholderColor}
                      editable={!isDisabled}
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
                      editable={!isDisabled}
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
                    editable={!isDisabled}
                    value={this.state.email} 
                    autoCapitalize={false}
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
                    editable={!isDisabled}
                    value={this.state.phone} 
                    errorMessage={this.state.phoneError}
                    returnKeyType="done"                                       
                    onRefInput={(input) => { this.phoneInput = input }}
                    onSubmitEditing={() => { this.onMakeChanges() }}
                    onChangeText={(text) => this.setState({phone: text, phoneError: null})} />

                  {
                    !isDisabled &&
                    <View style={styles.centerView}>
                      <RoundButton 
                        title="Save" 
                        theme="blue" 
                        style={styles.blueButton} 
                        onPress={() => this.onMakeChanges()} />
                    </View>
                  }
                  
                  </KeyboardAwareScrollView>
              </View>
          </View>
            </View>
          }
        </SafeAreaInsetsContext.Consumer>
        <ActionSheet
					ref={o => this.ActionSheet = o}
					title={'Select Image'}
					options={['Camera', 'Photo Library', 'Cancel']}
					cancelButtonIndex={2}
					onPress={(index) => this.onSelectMedia(index)}
				/>
        <Toast ref={ref => (this.toast = ref)}/>
        { this.state.isLoading && <LoadingOverlay /> }
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

  centerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,    
  },

  blueButton: {
    width: '100%'
  },

  profileBox: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
    removeContactStatus: state.user.removeContactStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ContactDetailScreen);