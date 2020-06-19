import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import MultiSelect from '../components/react-native-multiple-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TopNavBar from '../components/TopNavBar'
import BackgroundImage from '../components/BackgroundImage'
import StepIndicator from '../components/StepIndicator'
import LabelFormIDropdown from '../components/LabelFormIDropdown'
import RoundButton from '../components/RoundButton'
import Colors from '../theme/Colors'
import Messages from '../theme/Messages'
import Styles from '../theme/Styles'

class SignUp2Screen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      services: [],
      availabilityFrom: '',
      availabilityTo: '',
      rate: '',

      servicesError: null,
      availabilityFromError: '',
      availabilityToError: '',
      rateError: '',      
    }
  }

  componentDidMount() {

  }

  onBack() {
    this.props.navigation.goBack();
  }

  convertTime12to24(time12h){
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    if (hours.length == 1) {
      hours = "0" + hours;
    }
    return `${hours}:${minutes}`;
  }

  onChangeUser(key, value) {
    var user = this.state.user;
    if (key == "availabilityFrom") {
      this.setState({ availabilityFrom: value, availabilityFromError: "" });
    } else if (key == "availabilityTo") {
      this.setState({ availabilityTo: value, availabilityToError: "" });
    } else if (key == "rate") {
      this.setState({ rate: value, rateError: "" });
    } 

    this.setState({user: user});
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ services: selectedItems, servicesError: null });
  };

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

  onContinue() {
    Keyboard.dismiss();

    const services = this.state.services;
    const availabilityFrom = this.state.availabilityFrom;
    const availabilityTo = this.state.availabilityTo;
    const rate = this.state.rate;

    var isValid = true;
    if (services == null || services.length == 0) {
      this.setState({servicesError: Messages.InvalidServices});
      isValid = false;
    }

    if (availabilityFrom == null || availabilityFrom.length == 0) {
      this.setState({availabilityFromError: Messages.InvalidAvailabilityFrom});
      isValid = false;
    }

    if (availabilityTo == null || availabilityTo.length == 0) {
      this.setState({availabilityToError: Messages.InvalidAvailabilityTo});
      isValid = false;
    }

    if (rate == null || rate.length == 0) {
      this.setState({rateError: Messages.InvalidRate});
      isValid = false;
    }

    if (isValid) {
      const { user } = this.props.route.params;
      user.services = services;
      user.availabilityFrom = availabilityFrom;
      user.availabilityTo = availabilityTo;
      user.rate = rate;
      this.props.navigation.navigate("IDVerification", {user: user});
    }    
  }

  render() {
    const { servicesError } = this.state;
    return (
      <View style={{flex: 1}}>
        <BackgroundImage />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.container}>
            <TopNavBar title="Service Details" theme="empty" onBack={() => this.onBack()}/>
            <StepIndicator steps={4} current={3} style={{marginTop: 20, marginBottom: 30}}/>
            <KeyboardAwareScrollView>
               
              <View style={styles.contentView}>
                <Text style={styles.labelText}>Services</Text>
                <MultiSelect
                  hideTags
                  items={this.props.services}
                  uniqueKey="_id"
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onSelectedItemsChange}
                  selectedItems={this.state.services}
                  selectText=""
                  searchInputPlaceholderText="Search Services..."
                  tagRemoveIconColor={Colors.appColor}
                  tagBorderColor={Colors.appColor}
                  tagTextColor={Colors.appColor}
                  selectedItemTextColor={Colors.appColor}
                  selectedItemIconColor={Colors.appColor}
                  itemTextColor="#000"
                  displayKey="name"
                  submitButtonColor={Colors.appColor}
                  submitButtonText="Select"
                  itemFontSize={16}
                  fontFamily="OpenSans"
                  selectedItemFontFamily="OpenSans"
                  itemFontFamily="OpenSans"             
                  altFontFamily="OpenSans"
                  fontSize={16}
                  hideDropdown={true}
                  searchInputStyle={{ fontFamily: "OpenSans", fontSize: 16, padding: 5, color: '#CCC', backgroundColor: 'transparent', borderWidth: 0 }}                  
                  styleInputGroup={{ paddingVertical: 5, backgroundColor: 'transparent', borderWidth: 0, margin: 0}}
                  styleItemsContainer={{paddingVertical: 10, backgroundColor: 'transparent'}}
                  styleRowList={{paddingVertical: 5, backgroundColor: 'transparent'}}
                  styleMainWrapper={{backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.borderColor, borderRadius: 30, paddingLeft: 20, paddingRight: 20, paddingTop: 0, paddingBottom: 0, margin: 0}}
                  styleSelectorContainer={{backgroundColor: 'transparent', borderWidth: 0}}
                  styleDropdownMenu={{backgroundColor: 'transparent', borderWidth: 0, margin: 0, padding: 0}}
                  styleDropdownMenuSubsection={{backgroundColor: 'transparent', borderWidth: 0, padding: 0, marginTop: 2,}}
                />
                {
                  this.multiSelect &&
                  <View style={{marginTop: 5}}>
                      {this.multiSelect.getSelectedItemsExt(this.state.services)}
                  </View> 
                }

                { servicesError && <Text style={Styles.errorText}>{servicesError}</Text>}
                
                <View style={[styles.rowView, {marginTop: 30}]}>
                  <LabelFormIDropdown
                   label="Availability from" 
                   type="dropdown"
                   data={this.filterData(this.props.availabilities)}
                   value={this.state.availabilityFrom} 
                   errorMessage={this.state.availabilityFromError}
                   style={{width: '45%'}}
                   onRefInput={(input) => { this.availabilityFromInput = input }}
                   onChangeText={(text) => this.onChangeUser("availabilityFrom", text)} />

                  <LabelFormIDropdown
                   label="To" 
                   type="dropdown"
                   data={this.filterData(this.props.availabilities)}
                   value={this.state.availabilityTo} 
                   errorMessage={this.state.availabilityToError}
                   style={{width: '45%'}}
                   onRefInput={(input) => { this.availabilityToInput = input }}
                   onChangeText={(text) => this.onChangeUser("availabilityTo", text)} />
                </View>

                <LabelFormIDropdown
                   label="Rate" 
                   type="dropdown"
                   data={this.filterData(this.props.rates)}
                   value={this.state.rate} 
                   errorMessage={this.state.rateError}
                   onRefInput={(input) => { this.rateInput = input }}
                   onChangeText={(text) => this.onChangeUser("rate", text)} 
                />

              </View>

              <View style={styles.centerView}>
                <RoundButton 
                  title="Continue" 
                  theme="blue" 
                  style={styles.continueButton} 
                  onPress={() => this.onContinue()} />
              </View>
            </KeyboardAwareScrollView>
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
    paddingLeft: 35, 
    paddingRight: 35, 
    paddingTop: 20,
    paddingBottom: 20,
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  labelText: {
        fontFamily: 'OpenSans',
        color: '#7a79b5',
        marginBottom: 10,
        marginLeft: 10,
  },

  centerView: {
    width: '100%',
    marginBottom: 40,
  },

  continueButton: {
    marginLeft: 30,
    marginRight: 30,
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
    services: state.globals.services,    
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUp2Screen);