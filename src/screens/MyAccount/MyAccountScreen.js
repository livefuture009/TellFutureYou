import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView
} from 'react-native';

import {connect} from 'react-redux';
import HeaderInfoBar from '../../components/HeaderInfoBar'
import SettingsInfoCell from '../../components/SettingsInfoCell'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import actionTypes from '../../actions/actionTypes';
import * as Storage from '../../services/Storage'
import Colors from '../../theme/Colors'
import Images from '../../theme/Images'
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image'
import Fonts from '../../theme/Fonts';

class MyAccountScreen extends Component {
  onMoveEditProfile() {
    this.props.navigation.navigate('EditProfile');
  }

  onMoveChangePassword() {
    this.props.navigation.navigate('ChangePassword');
  }

  onMovePayment() {
    this.props.navigation.navigate('TransactionHistory');
  }

  onLogout() {
    AsyncStorage.clear();
    this.props.navigation.popToTop();
    
    // Reset Reducer.
    setTimeout(() => {
      this.props.dispatch({
        type: actionTypes.RESET_USER,
      });   

      this.props.dispatch({
        type: actionTypes.RESET_JOB,
      });   

      this.props.dispatch({
        type: actionTypes.RESET_NOTIFICATION,
      });   
    }, 1000);
  }

  onNotification() {
    this.props.navigation.navigate('Notification');  
  }

  onProfile() {
    this.props.navigation.navigate('EditProfile');  
  }

  onChat() {
    this.props.navigation.navigate('ChatList');  
  }
  
  render() {
    const { currentUser } = this.props;
    const avatar = (currentUser && currentUser.avatar)  ? currentUser.avatar : '';
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <View style={styles.container}>
          <HeaderInfoBar 
            title="MY ACCOUNT" 
          />

          <View style={styles.contentView}>
            <View style={styles.profileBox}>
              <View style={styles.avatarContainer}>
                <FastImage source={avatar ? {uri: avatar} : Images.account_icon} style={styles.avatarImage}/>
              </View>              
              <Text style={styles.nameText}>{currentUser.firstName} {currentUser.lastName}</Text>
              <Text style={styles.emailText}>{currentUser.email}</Text>
            </View>

            <SettingsInfoCell label="Edit Profile" type="submenu" onPress={() => this.onMoveEditProfile()}/>
            <SettingsInfoCell label="Change Password" type="submenu" onPress={() => this.onMoveChangePassword()}/>
            <SettingsInfoCell label="My Subscription" type="submenu" onPress={() => this.onMovePayment()}/>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentView: {
    flex: 1,
    backgroundColor: '#f2f2f5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 60,
  },

  profileBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
    marginBottom: 30,
  },

  nameText: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: '#454545',
    marginTop: 10,
  },

  emailText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  },

  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },

  avatarImage: {
    width: 105,
    height: 105,
    borderRadius: 52,
    backgroundColor: 'lightgray',
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
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(MyAccountScreen);