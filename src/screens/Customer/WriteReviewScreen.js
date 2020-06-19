import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-easy-toast'
import RoundButton from '../../components/RoundButton'
import TopNavBar from '../../components/TopNavBar'
import Avatar from '../../components/Avatar'
import Rate from '../../components/Rate'
import TextView from '../../components/TextView'
import LoadingOverlay from '../../components/LoadingOverlay'
import { TOAST_SHOW_TIME, JOB_STATUS, NOTIFICATION_TYPE, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'

class WriteReviewScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      rate: 0,
      reviewText: '',
      isLoading: false,
    }    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.writeReviewStatus != this.props.writeReviewStatus) {
      if (this.props.writeReviewStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.onBack();
      } else if (this.props.writeReviewStatus == Status.FAILURE) {
        this.setState({isLoading: false});
        this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onPostReview() {
    Keyboard.dismiss();

    if (this.state.isLoading) return;
    
    const { provider, job_id } = this.props.route.params;

    this.setState({isLoading: true});
    const currentUser = this.props.currentUser;

    // Write a review.
    this.props.dispatch({
      type: actionTypes.WRITE_REVIEW,
      user_id: currentUser._id,
      provider_id: provider._id,
      job_id: job_id,
      text: this.state.reviewText,
      score: this.state.rate
    });

    // Create Write Review Notification.
    const n = {
      creator: currentUser._id,
      receiver: provider._id,
      job: job_id,
      type: NOTIFICATION_TYPE.GIVE_REVIEW
    };

    this.props.dispatch({
      type: actionTypes.CREATE_NOTIFICATION,
      notification: n,
    });
  }

  onChangeRate(rate) {
    this.setState({ rate: rate });
  }
 
  render() {
    const { provider, job_id } = this.props.route.params;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title="WRITE REVIEW" align="left" onBack={() => this.onBack()}/>
          <KeyboardAwareScrollView>
            <View style={styles.contentView}>
              <Avatar avatar={provider.avatar} />
              <Text style={styles.nameText}>{provider.firstName} {provider.lastName}</Text>
              <Rate size="xlarge" rate={this.state.rate} touchable={true} style={{marginBottom: 20}} onChangeRate={(rate) => this.onChangeRate(rate)}/>
              <View style={{ width: '100%', paddingLeft: 25, paddingRight: 25, marginBottom: 20 }}>
                <TextView value={this.state.reviewText} onChangeText={(text) => this.setState({reviewText: text})} />
              </View>
            </View>
          </KeyboardAwareScrollView>

          <View style={styles.buttonContainer}>
            <RoundButton 
              title="Post Review" 
              theme="blue" 
              style={styles.blueButton} 
              onPress={() => this.onPostReview()} />
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
    backgroundColor: Colors.pageColor,
  },

  contentView: {
    alignItems: 'center',
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
    width: '48%'
  },

  buttonContainer: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },

  nameText: {
    fontFamily: Fonts.regular,
    fontSize: 21,
    textAlign: 'center',
    marginBottom: 10,
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
    provider: state.user.provider,
    writeReviewStatus: state.user.writeReviewStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(WriteReviewScreen);