import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Images from '../theme/Images'

import ContactListScreen from '../screens/Contact/ContactListScreen';
import ChatListScreen from '../screens/Chat/ChatListScreen';
import FriendScreen from '../screens/Friend/FriendScreen';
import MyAccountScreen from '../screens/MyAccount/MyAccountScreen';
import NotificationScreen from '../screens/NotificationScreen'

import TabBarItem from './TabBarItem';

const Tab = createBottomTabNavigator();

class CustomerTab extends React.Component {
  render() {
      return (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  var iconImage;
                  if (route.name === 'ChatList') {
                    iconImage = focused ? Images.tab_message_selected : Images.tab_message;
                  }
                  else if (route.name === 'Friend') {
                    iconImage = focused ? Images.tab_friend_selected : Images.tab_friend;
                  } 
                  else if (route.name === 'ContactList') {
                    iconImage = focused ? Images.tab_contact_selected : Images.tab_contact;
                  } 
                  else if (route.name === 'Notification') {
                    iconImage = focused ? Images.tab_notification_selected : Images.tab_notification;
                  } 
                  else if (route.name === 'MyAccount') {
                    iconImage = focused ? Images.tab_settings_selected : Images.tab_settings;
                  }
                  return <TabBarItem icon={iconImage} page={route.name} />;
                },
              })}
              tabBarOptions={{
                showLabel: false,
              }}
            >
              <Tab.Screen name="ChatList" component={ChatListScreen} />
              <Tab.Screen name="Friend" component={FriendScreen} />
              <Tab.Screen name="ContactList" component={ContactListScreen} />
              <Tab.Screen name="Notification" component={NotificationScreen} />
              <Tab.Screen name="MyAccount" component={MyAccountScreen} />
            </Tab.Navigator>
      );      
  }
}

export default CustomerTab;