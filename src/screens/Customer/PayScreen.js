import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-easy-toast'
import Colors from '../../theme/Colors'
import RoundButton from '../../components/RoundButton'
import TopNavBar from '../../components/TopNavBar'
import LoadingOverlay from '../../components/LoadingOverlay'
import BlueBar from '../../components/SignUp/BlueBar'
import FastImage from 'react-native-fast-image';
import Moment from 'moment';
import Messages from '../../theme/Messages'
import Images from '../../theme/Images'
import Styles from '../../theme/Styles'
import { NOTIFICATION_TYPE, TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import { filterOnlyDigits, truncateToDecimals } from '../../functions';

class PayScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      duration: '',
      durationError: null,
      isLoading: false,
    }    
  }

  componentDidMount() {
    const { job } = this.props.route.params;
    if (job) {
      this.setState({duration: job.duration + ""});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.payJobStatus != this.props.payJobStatus) {
      if (this.props.payJobStatus == Status.SUCCESS) {
        this.onSuccessPay();
        
      } else if (this.props.payJobStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onSuccessPay() {
    var { currentBalance, currentUser } = this.props;
    currentUser.balance = currentBalance;
    
    // Pay Job.
    this.props.dispatch({
      type: actionTypes.SET_CURRENT_USER,
      user: currentUser,
    });

    this.setState({isLoading: false});
    this.showMessage(Messages.AlertJobCompleted);
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  showMessage(message) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          this.onBack();
          const { onMoveHiredPage } = this.props.route.params;
          if (onMoveHiredPage) {
            onMoveHiredPage();
          }
        }},
      ],
      {cancelable: false},
    ); 
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onPay() {
    Keyboard.dismiss();
    if (this.state.isLoading) return;

    const { currentUser } = this.props;
    const duration = this.state.duration;
    if (duration === null || duration === "" || isNaN(duration) || parseFloat(duration) <= 0) {
      this.setState({durationError: Messages.InvalidLimit});
      return;
    }

    const currentBalance = (currentUser && currentUser.balance) ? currentUser.balance : 0;
    const { job } = this.props.route.params;  
    const provider = job.hire.user;
    const total = parseFloat(duration) * job.rate;

    if (currentBalance >= total) {
      // Show confirm dialog.
      Alert.alert(
        '',
        Messages.AskPayQuote,
        [
          {text: 'Yes', onPress: () => {
            // Pay Job.
            this.setState({isLoading: true});
            this.props.dispatch({
              type: actionTypes.PAY_JOB,
              job_id: job._id,
              customer_id: currentUser._id,
              provider_id: provider._id,
              amount: total,
            });

            this.generateNotification(NOTIFICATION_TYPE.COMPLETE_JOB, job, provider);
          }},
          {text: 'No', onPress: () => {}},
        ]
      );  
    } else {
      // Move Deposit Screen.
      this.props.navigation.navigate('DepositPaymentMethod');
    }
  }

  generateNotification(type, job, provider) {
    const { currentUser } = this.props;
    const n = {
      creator: currentUser._id,
      receiver: provider._id,
      job: job._id,
      type: type
    };

    this.props.dispatch({
      type: actionTypes.CREATE_NOTIFICATION,
      notification: n
    });
  }

  onChangeDuration(text) {
    const duration = filterOnlyDigits(text);
    this.setState({duration: duration, durationError: null});
  }

  render() {
    const { duration, durationError } = this.state;
    const { navigation, fee, currentUser } = this.props;  
    const { job } = this.props.route.params;   
    const provider = job.hire.user;
    const amount = duration ? (parseFloat(duration) * job.rate) : 0;
    const balance = (currentUser && currentUser.balance) ? truncateToDecimals(currentUser.balance) : 0;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title="Pay Service Provider" align="left" onBack={() => this.onBack()}/>
          <KeyboardAwareScrollView>
            <BlueBar title={"There will be " + fee + "% service fee."} />
            <View style={styles.contentView}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 5}}>
                <Text style={styles.balanceText}>Your Balance: </Text>              
                <Text style={styles.balanceValueText}>${balance}</Text>
              </View>
              <View style={styles.contractForm}>
                <View style={styles.oneRow}>
                  <Text style={styles.labelText}>Job ID: </Text>
                  <Text style={styles.valueText}>{job._id}</Text>
                </View>
                <View style={styles.oneRow}>
                  <Text style={styles.labelText}>Job Title: </Text>
                  <Text style={styles.valueText}>{job.title}</Text>
                </View>
                <View style={styles.oneRow}>
                  <Text style={styles.labelText}>Started On: </Text>
                  <Text style={styles.valueText}>{Moment(job.hire.createdAt).format('ddd DD, MMM YYYY')}</Text>
                </View>
                <View style={styles.oneRow}>
                  <Text style={styles.labelText}>Hourly Rate: </Text>
                  <Text style={styles.valueText}>${job.rate}</Text>
                </View>
                <View style={styles.oneRow}>
                  <Text style={styles.labelText}>Duration: </Text>
                  <Text style={styles.valueText}>{job.duration} hrs</Text>
                </View>
              </View>

              <View style={styles.providerForm}>
                <FastImage
                  style={styles.avatarImage}
                  source={provider.avatar ? {uri: provider.avatar} : Images.account_icon}
                />
                <View style={{width: '70%'}}>
                  <Text style={[styles.nameText, {fontWeight: 'bold', fontSize: 17}]}>{provider.firstName} {provider.lastName}</Text>
                  <Text style={styles.nameText}>{provider.location}</Text>
                  <Text style={styles.nameText}>{provider.rate}</Text>
                </View>                
              </View>

              <View style={{padding: 20, borderTopWidth: 1, borderTopColor: Colors.borderColor}}>
                <View style={styles.payForm}>
                  <Text style={styles.rateText}>${job.rate} x </Text>
                  <TextInput
                    style={styles.durationInput}
                    keyboardType="numeric"
                    underlineColorAndroid='transparent'
                    maxLength={5}
                    onChangeText={(text) => this.onChangeDuration(text)}
                    value={duration}
                    returnKeyType="done"
                  />
                  <Text style={[styles.rateText, {fontWeight: 'bold', fontSize: 24}]}> = ${amount.toFixed(2)}</Text>
                </View>                
                { durationError && <Text style={[Styles.errorMessage, {textAlign: 'center'}]}>{durationError}</Text>}
              </View>              
            </View>            
          </KeyboardAwareScrollView>
          <View style={styles.buttonContainer}>
            <RoundButton 
              title="Pay" 
              theme="blue" 
              style={styles.blueButton} 
              onPress={() => this.onPay()} />
          </View>
        </View>

        <Toast ref="toast"/>
        {
          this.state.isLoading
          ? <LoadingOverlay />
          : null
        } 
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
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  
  blueButton: {
    width: '90%'
  },

  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },

  balanceText: {
    fontFamily: 'OpenSans',
    fontSize: 25,
  },

  balanceValueText: {
    fontFamily: 'OpenSans',
    fontSize: 25,
    fontWeight: 'bold',
  },

  contractForm: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    paddingVertical: 20,
  },

  oneRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 5,
    paddingHorizontal: 20,
  },

  labelText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    fontWeight: 'bold',
    width: '30%'
  },

  valueText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    width: '65%'
  },

  providerForm: {
    padding: 20,
    flexDirection: 'row',
  },

  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'gray',
    marginRight: 20,    
  },

  nameText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
  },

  payForm: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }, 

  rateText: {
    fontFamily: 'OpenSans',
    fontSize: 20,
  },

  durationInput: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontFamily: 'OpenSans',
    fontSize: 20,
    color: 'black',
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
    errorMessage: state.jobs.errorMessage,
    fee: state.globals.fee,
    currentBalance: state.jobs.currentBalance,
    payJobStatus: state.jobs.payJobStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(PayScreen);