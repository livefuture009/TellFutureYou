import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
  Keyboard,
  AppState
} from 'react-native';

import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-easy-toast'
import Colors from '../../theme/Colors'
import RoundButton from '../../components/RoundButton'
import LabelFormInput from '../../components/LabelFormInput'
import TopNavBar from '../../components/TopNavBar'
import ImagePickerSlider from '../../components/ImagePickerSlider'
import LoadingOverlay from '../../components/LoadingOverlay'
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import { TOAST_SHOW_TIME, NOTIFICATION_TYPE, JOB_STATUS, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import { filterOnlyDigits } from '../../functions'

class JobPostScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      job: {
        title: '',
        description: '',
        location: '',
        locationText: '',
        zipcode: '',
        lat: 0,
        lng: 0,
        rate: '',
        duration: '',
        photos: [],
        service: '',
        subCategories: [],
        providers: [],
        status: JOB_STATUS.NEW,

        titleError: '',
        descriptionError: '',
        locationError: '',
        zipcodeError: '',
        rateError: '', 
        durationError: '', 
      },
      
      isLoading: false,
      appState: AppState.currentState,
    }    
  }

  componentDidMount() {
    let _SELF = this;
    setTimeout(function(){
      _SELF.initData();      
    }, 200);

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }
    this.setState({appState: nextAppState});
  }

  initData() {
    if (this.props.currentUser) {
      const { service, subCategories } = this.props.route.params;
      const user = this.props.currentUser;

      let job = this.state.job;
      job.service = service;
      job.subCategories = subCategories;
      job.user_id = user._id;
      job.lat = this.props.currentLat;
      job.lng = this.props.currentLng;

      this.setState({
        job: job
      })
    }
  }


  componentDidUpdate(prevProps, prevState) {
    // Create Job.
    if (prevProps.createJobStatus != this.props.createJobStatus) {
      if (this.props.createJobStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        if (this.state.appState == "background") {
          const { backLevel } = this.props.route.params;
          this.props.navigation.pop(backLevel);
          this.props.navigation.navigate('HistoryStack');
        } else {
          this.onCompletedJobPost(this.props.job);
        }
      } else if (this.props.createJobStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Get Geo Data for zipcode.
    if (prevProps.getGeoDataStatus != this.props.getGeoDataStatus) {
      if (this.props.getGeoDataStatus == Status.SUCCESS) {
        this.getGeoDataSuccess();
      } else if (this.props.getGeoDataStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onCompletedJobPost(job) {
    Alert.alert(
      '',
      Messages.AlertJobPosted,
      [
        {text: 'OK', onPress: () => {
          const { backLevel } = this.props.route.params;
          this.props.navigation.pop(backLevel);
          this.props.navigation.navigate('HistoryStack');
        }},
      ],
      { cancelable: false }
    );   
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onPostJob() {
    Keyboard.dismiss();
    var isValid = true;

    const job = this.state.job;

    // Title.
    if (job.title == null || job.title.length == 0) {
      job.titleError = Messages.InvalidJobTitle;
      isValid = false;
    }

    // Description
    if (job.description == null || job.description.length == 0) {
      job.descriptionError = Messages.InvalidJobDescription;
      isValid = false;
    }

    // Location.
    if (job.location == null || job.location.length == 0 || job.location != job.locationText) {
      job.locationError = Messages.InvalidLocation;
      isValid = false;
    }

    // Zip Code.
    if (job.zipcode == null || job.zipcode.length == 0) {
      job.zipcodeError = Messages.InvalidZipCode;
      isValid = false;
    }
    
    // Rate.
    if (job.rate === null || job.rate === "" || isNaN(job.rate) || parseFloat(job.rate) <= 0) {
      job.rateError = Messages.InvalidRate;
      isValid = false;
    }

    // Duration
    if (job.duration === null || job.duration === "" || isNaN(job.duration) || parseFloat(job.duration) <= 0) {
      job.durationError = Messages.InvalidLimit;
      isValid = false;
    }
    
    this.setState({job: job});
    if (isValid) {
      this.setState({isLoading: true}, () => { 
        this.props.dispatch({
          type: actionTypes.CREATE_NEW_JOB,
          job: job,
        });
      });  
      
    }
  }

  onSelectedProviders(list) {
    const { job } = this.state;
    job.invites = list;
    this.setState({job: job});
  }

  onFindProvider() {
    // Selected Job
    const { job } = this.state;
    this.props.navigation.navigate('ProviderList', {
      job: job,
      onSelectedProviders: (list) => {
        this.onSelectedProviders(list)
      }
    });    
  }

  onTakePicture() {
    const options = {
      title: 'Select Image',
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

        let job = this.state.job;
        job.photos.push(response);
        this.setState({
          job: job
        });
      }
    });
  }

  onRemovePhoto(index) {
    let job = this.state.job;
    job.photos.splice(index, 1);
    this.setState({
      job: job
    });
  }

  filterData(data) {
    var response = [];
    for (var i = 0; i < data.length; i++) {
      const item = data[i];
      response.push({
        id: item._id, 
        label: item.name, 
        value: item.name,
      });
    }

    return response;
  }

  onChangeLocation(address) {
    const { job } = this.state;
    job.location = address;
    job.locationText = address;
    this.setState({job});
    if (address && address.length > 0) {
      this.props.dispatch({
        type: actionTypes.GET_GEODATA,
        address: address,
      });
    }    
  }

  getGeoDataSuccess() {
    const lat = this.props.geoData.lat;
    const lng = this.props.geoData.lng;
    const zipcode = this.props.geoData.zipcode;
    let job = this.state.job;

    job.lat = lat;
    job.lng = lng;
    job.zipcode = zipcode;
    job.zipcodeError = null;

    this.setState({
      isLoading: false,
      job: job,
    });
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  changeJob(key, value) {
    var job = this.state.job;

    if (key == "title") {
      job.title = value;
      job.titleError = '';
    }
    else if (key == "description") {
      job.description = value;
      job.descriptionError = '';
    }
    else if (key == "location") {
      job.locationText = value;
      job.locationError = '';
    }
    else if (key == "rate") {
      job.rate = value;
      job.rateError = '';
    }
    else if (key == "duration") {
      job.duration = filterOnlyDigits(value);
      job.durationError = '';
    }
    else if (key == "zipcode") {
      job.zipcode = value;
      job.zipcodeError = '';
    }

    this.setState({job: job});
  }

  render() {
    const { job } = this.state;
    const serviceName = job.service.name;
    const title = "POST A JOB - " + serviceName;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title={title.toUpperCase()} align="left" onBack={() => this.onBack()}/>
          <KeyboardAwareScrollView>
            <View>
              <View style={styles.contentView}>
                  <ImagePickerSlider
                    placeholderImage={Images.placeholder_image}
                    placeholderText="Add Image"
                    photos={job.photos} 
                    onTakePhoto={() => this.onTakePicture()} 
                    onRemovePhoto={(index) => this.onRemovePhoto(index)}
                  />
                  <LabelFormInput
                    label="Job Title" 
                    type="text"
                    placeholderTextColor={Colors.placeholderTextColor}
                    value={job.title} 
                    errorMessage={job.titleError}
                    style={{marginTop: 30}}
                    returnKeyType="next"   
                    maxLength={100}                                    
                    onSubmitEditing={() => { this.jobDescriptionInput.focus() }}
                    onChangeText={(text) => this.changeJob('title', text)} />

                  <LabelFormInput
                    label="Job Description" 
                    type="textview"
                    value={job.description} 
                    errorMessage={job.descriptionError}
                    onRefInput={(input) => { this.jobDescriptionInput = input }}
                    onChangeText={(text) => this.changeJob('description', text)} />              

                  <LabelFormInput
                      label="Set Location" 
                      type="address"
                      placeholderTextColor={Colors.placeholderTextColor}
                      value={job.locationText}
                      errorMessage={job.locationError} 
                      returnKeyType="next"                                 
                      onSelectAddress={(address) => this.onChangeLocation(address)}      
                      onRefInput={(input) => { this.locationInput = input }}
                      onChangeText={(text) => this.changeJob('location', text)} 
                      onSubmitEditing={() => { this.zipcodeInput.focus() }}
                  />

                  <LabelFormInput
                    label="Zip Code" 
                    type="number"
                    maxLength={9}
                    placeholderTextColor={Colors.placeholderTextColor}
                    value={this.state.job.zipcode} 
                    errorMessage={this.state.job.zipcodeError}
                    returnKeyType="next"                                       
                    onRefInput={(input) => { this.zipcodeInput = input }}
                    onChangeText={(text) => this.changeJob('zipcode', text)} 
                    onSubmitEditing={() => { this.hourlyRateInput.focus() }}
                  />

                  <View style={styles.rowView}>
                    <LabelFormInput
                      label="Hourly Rate ($)" 
                      type="number"
                      maxLength={5}
                      value={this.state.job.limit} 
                      errorMessage={this.state.job.rateError} 
                      style={{width: '45%'}}
                      returnKeyType="next"                                       
                      onChangeText={(text) => this.changeJob('rate', text.trim())} 
                      onRefInput={(input) => { this.hourlyRateInput = input }}
                      onSubmitEditing={() => { this.durationInput.focus() }}
                    />

                  <LabelFormInput
                    label="Duration (hrs)" 
                    type="number"
                    maxLength={5}
                    value={this.state.job.duration} 
                    errorMessage={this.state.job.durationError} 
                    style={{width: '45%'}}
                    returnKeyType="done"                                       
                    onChangeText={(text) => this.changeJob('duration', text.trim())} 
                    onRefInput={(input) => { this.durationInput = input }}
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                  />                 

                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <RoundButton 
                    title="Find Providers" 
                    theme="outline" 
                    style={styles.blueButton} 
                    onPress={() => this.onFindProvider()} />

                  <RoundButton 
                    title="Post Job" 
                    theme="blue" 
                    style={styles.blueButton} 
                    onPress={() => this.onPostJob()} />
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
    backgroundColor: Colors.pageColor,
  },

  contentView: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }, 

  blueButton: {
    width: '48%'
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
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
    geoData: state.globals.geoData,
    getGeoDataStatus: state.globals.getGeoDataStatus,

    currentUser: state.user.currentUser,
    currentLat: state.user.lat,
    currentLng: state.user.lng,

    job: state.jobs.job,
    errorMessage: state.jobs.errorMessage,    
    createJobStatus: state.jobs.createJobStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(JobPostScreen);