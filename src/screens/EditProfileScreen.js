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
import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import LabelFormInput from '../components/LabelFormInput'
import EditAvatar from '../components/EditAvatar'
import Colors from '../theme/Colors'
import Styles from '../theme/Styles'
import LoadingOverlay from '../components/LoadingOverlay'
import Messages from '../theme/Messages'
import { TOAST_SHOW_TIME, Status } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import {validateEmail, getOnlyAlphabetLetters} from '../functions'

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      avatar: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      locationText: '',
      
      firstNameError: '',
      lastNameError: '',
      emailError: '',
      phoneError: '',
      locationError: '',
      isLoading: false,
    }
  }

  componentDidMount() {
    if (this.props.currentUser) {
      const { currentUser } = this.props;
      this.setState({
        id: currentUser._id,
        avatar: currentUser.avatar,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        location: currentUser.location,
        locationText: currentUser.location,
      });
    }      
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.updateProfileStatus != this.props.updateProfileStatus) {
      if (this.props.updateProfileStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showMessage("Profile has been updated successfully!", true);
      } else if (this.props.updateProfileStatus == Status.FAILURE) {
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
      firstName, 
      lastName, 
      email, 
      phone, 
      location, 
      locationText,
      avatarFile
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

    if (location == null || location.length == 0 || location != locationText) {
      this.setState({locationError: Messages.InvalidLocation});
      isValid = false;
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.updateProfileData();
      });  
    }
  }

  updateProfileData() {
    const {
      id,
      firstName,
      lastName,
      email,
      phone,
      location,
      avatarFile,
    } = this.state;

    let user = {
      id,
      firstName,
      lastName,
      email,
      phone,
      location,
      avatarFile,
    };

    this.props.dispatch({
      type: actionTypes.UPDATE_PROFILE,
      user: user,
    });
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

  filterData(data) {
    var response = [];
    for (var i = 0; i < data.length; i++) {
      const item = data[i];
      response.push({
        id: item._id, 
        label: item.name, 
        value: item.name
      });
    }

    return response;
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
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <TopNavBar title="EDIT PROFILE" onBack={() => this.onBack()}/>
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <View>
              <View style={styles.profileBox}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <EditAvatar avatar={this.state.avatar} style={{ marginTop: -80}} onTakePhoto={() => this.onTakePicture()} />
                </View>              
                <View style={styles.rowView}>
                  <LabelFormInput
                    label="First Name" 
                    type="text"
                    placeholderTextColor={Colors.placeholderTextColor}
                    value={this.state.firstName} 
                    errorMessage={this.state.firstNameError}
                    style={{width: '45%'}}
                    returnKeyType="next"                                       
                    onSubmitEditing={() => { this.lastNameInput.focus() }}
                    onChangeText={this.onChangeFirstName} 
                  />

                  <LabelFormInput
                    label="Last Name" 
                    type="text"
                    placeholderTextColor={Colors.placeholderTextColor}
                    value={this.state.lastName} 
                    errorMessage={this.state.lastNameError}
                    style={{width: '45%'}}
                    returnKeyType="next"                                       
                    onRefInput={(input) => { this.lastNameInput = input }}
                    onSubmitEditing={() => { this.emailInput.focus() }}
                    onChangeText={this.onChangeLastName} 
                  />
                </View>

                <LabelFormInput
                  label="Email" 
                  type="email"
                  placeholderTextColor={Colors.placeholderTextColor}
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
                  placeholderTextColor={Colors.placeholderTextColor}
                  value={this.state.phone} 
                  errorMessage={this.state.phoneError}
                  returnKeyType="next"                                       
                  onRefInput={(input) => { this.phoneInput = input }}
                  onSubmitEditing={() => { this.locationInput.focus() }}
                  onChangeText={(text) => this.setState({phone: text, phoneError: null})} />

                <LabelFormInput
                  label="Location" 
                  type="address"
                  returnKeyType="next"
                  placeholderTextColor={Colors.placeholderTextColor}
                  value={this.state.locationText}
                  errorMessage={this.state.locationError} 
                  onRefInput={(input) => { this.locationInput = input }}
                  onSelectAddress={(address) => this.onChangeLocation(address)}     
                  onChangeText={(text) => this.setState({locationText: text, locationError: null})} 
                />

                <View style={styles.centerView}>
                  <RoundButton 
                    title="Save Changes" 
                    theme="blue" 
                    style={styles.blueButton} 
                    onPress={() => this.onMakeChanges()} />
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
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
    marginTop: 76,
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
    updateProfileStatus: state.user.updateProfileStatus,
    errorMessage: state.user.errorMessage,    
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(EditProfile);