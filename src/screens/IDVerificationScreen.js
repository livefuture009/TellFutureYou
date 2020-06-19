import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  Alert,
  Dimensions
} from 'react-native';

import {connect} from 'react-redux';
import BackgroundImage from '../components/BackgroundImage'
import StepIndicator from '../components/StepIndicator'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker';
import Toast, {DURATION} from 'react-native-easy-toast'

import LoadingOverlay from './../components/LoadingOverlay'
import RoundTextInput from './../components/RoundTextInput'
import LabelFormIDropdown from '../components/LabelFormIDropdown'
import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import BlueBar from '../components/SignUp/BlueBar'
import ImagePickerSlider from '../components/ImagePickerSlider'
import LabelFormInput from '../components/LabelFormInput'
import Messages from '../theme/Messages'
import Images from '../theme/Images'
import { TOAST_SHOW_TIME, Status } from '../constants.js'
import actionTypes from '../actions/actionTypes';
import * as Storage from '../services/Storage'
import { makeRandomText } from '../functions';

class IDVerificationScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      idCards: [],      
      idType: '',
      idNumber: '',
      otherInformation: '',

      idTypeError: '',
      idNumberError: '',
      otherInformationError: '',
    }

    this.idTypes = [
      {
        id: 1,
        label: "Passport",
        value: "Passport"
      },
      {
        id: 2,
        label: "National ID",
        value: "National ID"
      },
      {
        id: 3,
        label: "Citizen",
        value: "Citizen"
      },
      {
        id: 4,
        label: "Driver",
        value: "Driver"
      }
    ];
  }


  onBack() {
    this.props.navigation.goBack();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.registerProviderStatus != this.props.registerProviderStatus) {
      if (this.props.registerProviderStatus == Status.SUCCESS) {
        this.registerProviderSuccess();
      } else if (this.props.registerProviderStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onMoveHome() {
    Alert.alert(
      '',
      'Thank you for registering with Helpme. We will review your profile and approve it ASAP.',
      [
        {text: 'OK', onPress: () => {
          this.setState({isLoading: false}, () => { 
            this.props.navigation.popToTop();
          });           
        }},
      ],
      {cancelable: false},
    );    
  }

  onNext() {
    Keyboard.dismiss();

    let idCards = this.state.idCards;
    let idType = this.state.idType;
    let idNumber = this.state.idNumber;
    let otherInformation = this.state.otherInformation;

    var isValid = true;
    if (idCards == null || idCards.length <= 0) {
      let message = Messages.InvalidIDCard;
      this.refs.toast.show(message, DURATION.LENGTH_LONG);
      isValid = false;
    }

    if (idType == null || idType.length <= 0) {
      this.setState({idTypeError: Messages.InvalidIDType});
      isValid = false;
    }

    if (idNumber == null || idNumber.length <= 0) {
      this.setState({idNumberError: Messages.InvalidIDNumber});
      isValid = false;
    }

    if (isValid) {
      const { user } = this.props.route.params;
      user.idCards = idCards;
      user.idType = idType;
      user.idNumber = idNumber;
      user.idOtherInformation = otherInformation;

      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.REGISTER_PROVIDER,
          user: user,
          player_id: this.props.playerId,
          lat: this.props.lat,
          lng: this.props.lng,
        });
      });    
    }    
  }

  registerProviderSuccess() {
    this.setState({isLoading: false});
    this.onMoveHome();
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, DURATION.LENGTH_LONG);
  }

  onTakePicture() {
    const options = {
      title: 'Select ID Card',
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
        var fileName = "";
        if (response.fileName && response.fileName.length > 0) {
          fileName = response.fileName;
        } else {
          fileName = makeRandomText(20);
        }
        const photo = {
          fileName: fileName,
          type: response.type,
          uri: response.uri 
        };
        this.state.idCards.push(photo);
        this.setState({
          idCards: this.state.idCards,
        });
      }
    });
  }

  onRemovePhoto(index) {
    console.log(index);
    this.state.idCards.splice(index, 1);
    this.setState({
      idCards: this.state.idCards,
    });
  } 

  render() {
    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.container}>
            <TopNavBar title="ID Verification" theme="empty" onBack={() => this.onBack()}/>
            <StepIndicator steps={4} current={4} style={{marginTop: 20, marginBottom: 30}}/>
            <Text style={styles.descriptionText}>For the safety of our users, we need to verify your ID.</Text>
            <KeyboardAwareScrollView>
              <View style={styles.contentView}>
                <ImagePickerSlider
                  placeholderImage={Images.photo_icon}
                  placeholderText="Take Picture"
                  photos={this.state.idCards} 
                  errorMessage={this.state.idCardsError}
                  onTakePhoto={() => this.onTakePicture()} 
                  onRemovePhoto={(index) => this.onRemovePhoto(index)}
                />

                <View style={styles.rowView}>
                  <LabelFormIDropdown
                     label="ID Type" 
                     type="dropdown"
                     data={this.idTypes}
                     value={this.state.idType} 
                     errorMessage={this.state.idTypeError}
                     style={{width: '45%'}}
                     onSubmitEditing={(input) => { this.idNumberInput.focus() }}
                     onChangeText={(text) => this.setState({idType: text, idTypeError: null})} />

                  <RoundTextInput
                   label="ID Number" 
                   type="text"
                   value={this.state.idNumber} 
                   errorMessage={this.state.idNumberError}
                   style={{width: '45%'}}
                   returnKeyType="next"
                   onSubmitEditing={() => { this.otherInformationInput.focus() }}
                   onRefInput={(input) => { this.idNumberInput = input }}
                   onChangeText={(text) => this.setState({idNumber: text, idNumberError: null})}  />

                </View>       

                <RoundTextInput
                   label="Other Information" 
                   type="text"
                   value={this.state.otherInformation} 
                   returnKeyType="done"
                   onRefInput={(input) => { this.otherInformationInput = input }}
                   onChangeText={(text) => this.setState({otherInformation: text, errorMessage: null})} />

              </View>
            </KeyboardAwareScrollView>

            <View style={styles.viewBottom}>
              <RoundButton 
                title="Submit Verification" 
                theme="blue" 
                style={styles.nextButton} 
                onPress={() => this.onNext()} />
            </View>

            <Toast ref="toast"/>
            {
              this.state.isLoading
              ? <LoadingOverlay />
              : null
            }
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentView: {
    paddingTop: 20,
    paddingLeft: 35, 
    paddingRight: 35, 
  },

  viewBottom: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },

  nextButton: {
    marginLeft: 30,
    marginRight: 30,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  descriptionText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 13,
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
    playerId: state.user.playerId,
    lat: state.user.lat,
    lng: state.user.lng,
    registerProviderStatus: state.user.registerProviderStatus,
    errorMessage: state.user.errorMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(IDVerificationScreen);