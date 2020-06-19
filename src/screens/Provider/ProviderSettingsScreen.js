import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  Dimensions
} from 'react-native';

import {connect} from 'react-redux';
import HeaderInfoBar from '../../components/HeaderInfoBar'
import SettingsInfoCell from '../../components/SettingsInfoCell'
import actionTypes from '../../actions/actionTypes';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from '../../theme/Colors'

class ProviderSettingsScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
  }
  
  onMoveEditProfile() {
    this.props.navigation.navigate('EditProfile');
  }

  onMoveChangePassword() {
    this.props.navigation.navigate('ChangePassword');
  }

  onMoveEarning() {
    this.props.navigation.navigate('ProviderEarnings');
  }

  onNotification() {
    this.props.navigation.navigate('Notification');  
  }

  onChat() {
    this.props.navigation.navigate('ChatList');  
  }

  onProfile() {
    this.props.navigation.navigate('EditProfile');  
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

  render() {
    const { unreadMessages, unreadNumber } = this.props;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <HeaderInfoBar title="SETTINGS" 
            user={this.props.currentUser} 
            isSearch={false}
            unReadMessageCount={unreadMessages}
            unReadNotificationCount={unreadNumber}
            onNotification={() => this.onNotification()}
            onProfile={() => this.onProfile()}
            onChat={() => this.onChat()}
          />

          <View style={styles.boxView}>
            <SettingsInfoCell label="Edit Profile" type="submenu" onPress={() => this.onMoveEditProfile()}/>
            <SettingsInfoCell label="Change Password" type="submenu" onPress={() => this.onMoveChangePassword()}/>
            <SettingsInfoCell label="Earnings" type="submenu" onPress={() => this.onMoveEarning()}/>
            <SettingsInfoCell label="Logout" type="red" onPress={() => this.onLogout()}/>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fc',
  },

  boxView: {
    backgroundColor: 'white',    
    borderWidth: 1,
    borderColor: '#f3f3f3',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    overflow: 'hidden',
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
    unreadMessages: state.user.unreadMessages,
    unreadNumber: state.notifications.unreadNumber,
    errorMessage: state.jobs.errorMessage,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(ProviderSettingsScreen);