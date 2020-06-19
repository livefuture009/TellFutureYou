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
import MultiSelect from 'react-native-multiple-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import LabelFormInput from '../components/LabelFormInput'
import EditAvatar from '../components/Provider/EditAvatar'
import Colors from '../theme/Colors'
import Styles from '../theme/Styles'
import LoadingOverlay from '../components/LoadingOverlay'
import Messages from '../theme/Messages'
import { TOAST_SHOW_TIME, Status } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import {validateEmail, getOnlyAlphabetLetters} from '../functions'

class EditProfile extends Component {
  static navigationOptions = {
    headerShown: false,
  };

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
      zipcode: '',
      availabilityFrom: '',
      availabilityTo: '',
      rate: '',
      services: [],
      aboutService: '',
      currentLat: 0,
      currentLng: 0,

      firstNameError: '',
      lastNameError: '',
      emailError: '',
      phoneError: '',
      locationError: '',
      availabilityFromError: '',
      availabilityToError: '',
      rateError: '',
      servicesError: '',
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
        currentLat: currentUser.geolocation.coordinates[1],
        currentLng: currentUser.geolocation.coordinates[0],
      });

      if (currentUser.type == "provider") {
        this.setState({
          availabilityFrom: currentUser.availabilityFrom,
          availabilityTo: currentUser.availabilityTo,
          rate: currentUser.rate,
          services: currentUser.services,
          aboutService: currentUser.aboutService,
          currentLat: currentUser.geolocation.coordinates[1],
          currentLng: currentUser.geolocation.coordinates[0],
        });
      }
    }      
  }

  componentDidUpdate(prevProps, prevState) {
    // Get Geo Data.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        this.setState({
          zipcode: this.props.geoData.zipcode,
          currentLat: this.props.geoData.lat, 
          currentLng: this.props.geoData.lng
        }, () => {
          this.updateProfileData();
        });        
      } else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure(this.props.errorGlobalMessage);
      }      
    }

    if (prevProps.updateCustomerStatus != this.props.updateCustomerStatus) {
      if (this.props.updateCustomerStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showMessage("Profile has been updated successfully!", true);
      } else if (this.props.updateCustomerStatus == Status.FAILURE) {
        this.onFailure(this.props.errorMessage);
      }      
    }    
    
    if (prevProps.updateProviderStatus != this.props.updateProviderStatus) {
      if (this.props.updateProviderStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showMessage("Profile has been updated successfully!", true);
      } else if (this.props.updateProviderStatus == Status.FAILURE) {
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
      firstName, 
      lastName, 
      email, 
      phone, 
      location, 
      locationText,
      availabilityFrom, 
      availabilityTo, 
      rate, 
      services,
      aboutService,
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

    if (currentUser.type == "provider") {
      if (availabilityFrom == null || availabilityFrom.length == 0) {
        this.setState({availabilityFromError: Messages.InvalidAvailabilityFrom});
        isValid = false;
      }
  
      if (availabilityTo == null || availabilityTo.length == 0) {
        this.setState({availabilityToError: Messages.InvalidAvailabilityTo});
        isValid = false;
      }
  
      var timeStart = new Date("01/01/2007 " + availabilityFrom);
      var timeEnd = new Date("01/01/2007 " + availabilityTo);
      if (timeStart >= timeEnd) {
        this.setState({availabilityFromError: Messages.InvalidAvailabilityFrom});
        isValid = false;
      }
  
      if (rate == null || rate.length == 0) {
        this.setState({rateError: Messages.InvalidRate});
        isValid = false;
      }
  
      if (services == null || services.length <= 0) {
        this.setState({servicesError: Messages.InvalidService});
        isValid = false;
      }
    }

    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.GET_GEODATA,
          address: location,
        });
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
      availabilityFrom,
      availabilityTo,
      rate,
      services,
      aboutService,
      avatarFile,
      currentLat,
      currentLng
    } = this.state;

    let user = {
      id,
      firstName,
      lastName,
      email,
      phone,
      location,
      availabilityFrom,
      availabilityTo,
      rate,
      services,
      aboutService,
      avatarFile,
      currentLat,
      currentLng
    };

    const { currentUser } = this.props;
    if (currentUser.type == "provider") {
      this.props.dispatch({
        type: actionTypes.UPDATE_PROVIDER,
        user: user,
      });
    } else {
      this.props.dispatch({
        type: actionTypes.UPDATE_CUSTOMER,
        user: user,
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
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title="EDIT PROFILE" align="left" onBack={() => this.onBack()}/>

          <KeyboardAwareScrollView>
            <View>
              <View style={styles.profileBox}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <EditAvatar avatar={this.state.avatar} style={{ marginTop: -80}} onTakePhoto={() => this.onTakePicture()} />
                </View>              
                <View style={styles.rowView}>
                  <LabelFormInput
                          label="First name" 
                          type="text"
                          placeholderTextColor={Colors.placeholderTextColor}
                          value={this.state.firstName} 
                          errorMessage={this.state.firstNameError}
                          style={{width: '45%'}}
                          returnKeyType="next"                                       
                          onSubmitEditing={() => { this.lastNameInput.focus() }}
                          onChangeText={this.onChangeFirstName} />

                      <LabelFormInput
                          label="Last name" 
                          type="text"
                          placeholderTextColor={Colors.placeholderTextColor}
                          value={this.state.lastName} 
                          errorMessage={this.state.lastNameError}
                          style={{width: '45%'}}
                          returnKeyType="next"                                       
                          onRefInput={(input) => { this.lastNameInput = input }}
                          onSubmitEditing={() => { this.emailInput.focus() }}
                          onChangeText={this.onChangeLastName} />
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
                  onChangeText={this.onChangeEmail} />

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

                {
                  currentUser.type == "provider" &&
                  <View>
                    <View style={styles.rowView}>
                      <LabelFormInput
                            label="Availability from" 
                            type="dropdown"
                            data={this.filterData(this.props.availabilities)}
                            value={this.state.availabilityFrom} 
                            errorMessage={this.state.availabilityFromError}
                            style={{width: '45%'}}
                            onChangeText={(text) => this.setState({availabilityFrom: text, availabilityFromError: null})} />

                          <LabelFormInput
                            label="To" 
                            type="dropdown"
                            data={this.filterData(this.props.availabilities)}
                            value={this.state.availabilityTo} 
                            errorMessage={this.state.availabilityToError}
                            style={{width: '45%'}}
                            onChangeText={(text) => this.setState({availabilityTo: text, availabilityToError: null})} />
                    </View>

                    <LabelFormInput
                    label="Rate" 
                    type="dropdown"
                    data={this.filterData(this.props.rates)} 
                    value={this.state.rate} 
                    errorMessage={this.state.rateError}
                    onChangeText={(text) => this.setState({rate: text, rateError: null})} />

                    <MultiSelect
                      hideTags
                      items={this.props.services}
                      uniqueKey="_id"
                      ref={(component) => { this.multiSelect = component }}
                      onSelectedItemsChange={this.onSelectedItemsChange}
                      selectedItems={this.state.services}
                      selectText="Pick Services"
                      searchInputPlaceholderText="Search Services..."
                      tagRemoveIconColor={Colors.appColor}
                      tagBorderColor={Colors.appColor}
                      tagTextColor={Colors.appColor}
                      selectedItemTextColor={Colors.appColor}
                      selectedItemIconColor={Colors.appColor}
                      itemTextColor="#000"
                      displayKey="name"
                      searchInputStyle={{ fontFamily: "OpenSans", fontSize: 16, padding: 5, color: '#CCC' }}
                      submitButtonColor={Colors.appColor}
                      submitButtonText="Select"
                      itemFontSize={16}
                      fontFamily="OpenSans"
                      selectedItemFontFamily="OpenSans"
                      itemFontFamily="OpenSans"             
                      altFontFamily="OpenSans"
                      fontSize={16}
                      hideDropdown={true}
                      styleDropdownMenu={{backgroundColor: 'red'}}
                      styleInputGroup={{ paddingVertical: 5}}
                      styleItemsContainer={{paddingVertical: 10}}
                      styleRowList={{paddingVertical: 5}}
                    />
                    {
                      this.multiSelect &&
                      <View>
                          {this.multiSelect.getSelectedItemsExt(this.state.services)}
                      </View> 
                    }
                    { (this.state.servicesError && this.state.servicesError.length > 0)
                      ? <Text style={Styles.errorText}>{this.state.servicesError}</Text>
                      : null
                    }

                    <LabelFormInput
                    label="About Service" 
                    type="textview"
                    style={{marginTop: 25}}
                    value={this.state.aboutService} 
                    onChangeText={(text) => this.setState({aboutService: text})} 
                    />              
                  </View>
                }
              </View>

              <View style={styles.centerView}>
                <RoundButton 
                  title="Save Changes" 
                  theme="blue" 
                  style={styles.blueButton} 
                  onPress={() => this.onMakeChanges()} />
              </View>
            </View>
          </KeyboardAwareScrollView>
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
    backgroundColor: '#ededf1',
  },

  centerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },

  blueButton: {
    width: '90%'
  },

  profileBox: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 86,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderColor,
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
    availabilities: state.globals.availabilities,
    rates: state.globals.rates,
    services: state.globals.services,
    geoData: state.globals.geoData,
    getGeoDataStatus: state.globals.getGeoDataStatus,
    errorGlobalMessage: state.globals.errorMessage,
      
    currentUser: state.user.currentUser,
    updateProviderStatus: state.user.updateProviderStatus,
    updateCustomerStatus: state.user.updateCustomerStatus,
    errorMessage: state.user.errorMessage,    
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(EditProfile);