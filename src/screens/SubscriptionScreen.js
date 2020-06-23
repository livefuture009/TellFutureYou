import React, { Component } from 'react';
import {
  Alert,
  View,
  SafeAreaView,
  StyleSheet,
  Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import LoadingOverlay from '../components/LoadingOverlay'
import Messages from '../theme/Messages'
import Colors from '../theme/Colors'
import { TOAST_SHOW_TIME, Status, PASSWORD_MIN_LENGTH } from '../constants.js'
import actionTypes from '../actions/actionTypes';

class SubscriptionScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
    }    
  }

  componentDidUpdate(prevProps, prevState) {

  }

  onBack() {
    this.props.navigation.goBack();
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <View style={styles.container}>
          <TopNavBar title="SUBSCRIPTION" align="left" onBack={() => this.onBack()}/>
          <View style={styles.contentView}>
          </View>

          <View style={styles.viewBottom}>
            <RoundButton 
              title="Subscribe" 
              theme="blue" 
              style={styles.registerButton} 
              onPress={this.onChangePassword} 
            />
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
    backgroundColor: 'white',
  },

  contentView: {
    paddingTop: 30,
    paddingHorizontal: 30,
  },

  viewBottom: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 20,
  },

  registerButton: {
    marginTop: 20,
    width: '90%'
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
    changePasswordStatus: state.user.changePasswordStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SubscriptionScreen);