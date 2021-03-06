import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView
} from 'react-native';

import {connect} from 'react-redux';
import HeaderInfoBar from '../../components/HeaderInfoBar'
import SettingsInfoCell from '../../components/SettingsInfoCell'
import { TOAST_SHOW_TIME, Status, WEB_PAGE_TYPE, USER_LEVEL } from '../../constants.js'
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

  onSubscription() {
    this.props.navigation.navigate('Subscription');
  }

  onLogout=()=> {
    AsyncStorage.clear();
    this.props.navigation.popToTop();
    
    // Reset Reducer.
    setTimeout(() => {
      this.props.dispatch({
        type: actionTypes.RESET_USER,
      });   

      this.props.dispatch({
        type: actionTypes.RESET_NOTIFICATION,
      });   
    }, 1000);
  }

  onTerms() {
    this.props.navigation.navigate('Terms', {page: WEB_PAGE_TYPE.TERMS});
  }

  onPrivacy() {
    this.props.navigation.navigate('Terms', {page: WEB_PAGE_TYPE.PRIVACY});
  }
  
  render() {
    const { currentUser } = this.props;
    const avatar = (currentUser && currentUser.avatar)  ? currentUser.avatar : '';
    const firstName = (currentUser && currentUser.firstName)  ? currentUser.firstName : '';
    const lastName = (currentUser && currentUser.lastName)  ? currentUser.lastName : '';
    const socialType = (currentUser && currentUser.socialType)  ? currentUser.socialType : '';

    var level = "Free Member";
    if (currentUser.level == USER_LEVEL.STANDARD) {
      level = "Standard Member";
    } else if (currentUser.level == USER_LEVEL.PREMIUM) {
      level = "Premium Member";
    }
    
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.appColor}}>
        <HeaderInfoBar 
          title="MY ACCOUNT" 
          rightButton="logout"
          onRight={this.onLogout}
        />
        <View style={styles.container}>
          <View style={styles.bottomView}/>
          <ScrollView>
            <View style={styles.contentView}>
              <View style={styles.profileBox}>
                <View style={styles.avatarContainer}>
                  <FastImage source={avatar ? {uri: avatar} : Images.account_icon} style={styles.avatarImage}/>
                </View>              
                <Text style={styles.nameText}>{firstName} {lastName}</Text>
                <Text style={styles.emailText}>{level}</Text>
              </View>

              <View style={{paddingHorizontal: 20}}>
                <SettingsInfoCell 
                  label="Edit Profile" 
                  type="submenu" 
                  icon={Images.icon_profile}
                  onPress={() => this.onMoveEditProfile()}
                />
                {
                  (socialType == null || socialType == "") 
                  ? <SettingsInfoCell 
                      label="Change Password" 
                      type="submenu" 
                      icon={Images.icon_password}
                      onPress={() => this.onMoveChangePassword()}
                    />
                  : null
                }
                <SettingsInfoCell 
                  label="My Subscription" 
                  type="submenu" 
                  icon={Images.icon_subscription}
                  onPress={() => this.onSubscription()}
                />
                <SettingsInfoCell 
                  label="Terms and Conditions" 
                  type="submenu" 
                  icon={Images.icon_terms}
                  onPress={() => this.onTerms()}
                />
                <SettingsInfoCell 
                  label="Privacy Policy" 
                  type="submenu" 
                  icon={Images.icon_privacy}
                  onPress={() => this.onPrivacy()}
                />
              </View>
            </View>
          </ScrollView>
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
    paddingBottom: 20,
  },

  bottomView: {
    position: 'absolute',
    bottom: 0,
    height: 300,
    width: '100%',
    backgroundColor: '#f2f2f5',
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
    fontStyle: 'italic',
    fontSize: 14,
    opacity: 0.5,
    textTransform: 'uppercase',
  },

  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },

  avatarImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
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
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(MyAccountScreen);