import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Images from '../theme/Images'
import Colors from '../theme/Colors'

import ContactListScreen from '../screens/Contact/ContactListScreen';
import ChatListScreen from '../screens/Chat/ChatListScreen';
import MyAccountScreen from '../screens/MyAccount/MyAccountScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatListScreen} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

function ContactStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ContactList" component={ContactListScreen} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

function MyAccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyAccount" component={MyAccountScreen} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

class CustomerTab extends React.Component {
  render() {
      return (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  var icon;
                  var selectedIcon;

                  if (route.name === 'ChatStack') {
                    icon = Images.tab_home;
                    selectedIcon = Images.tab_home_selected;
                  }
                  else if (route.name === 'ContactStack') {
                    icon = Images.tab_history;
                    selectedIcon = Images.tab_history_selected;
                  } 
                  else if (route.name === 'MyAccountStack') {
                    icon = Images.tab_settings;
                    selectedIcon = Images.tab_settings_selected;
                  }

                  return <Image
                    style={[styles.iconImage, !focused ? styles.inactiveIcon : null ]}
                    source={focused ? selectedIcon : icon} 
                  />
                },
              })}
              tabBarOptions={{
                showLabel: false,
              }}
            >
              <Tab.Screen name="ChatStack" component={ChatStack} />
              <Tab.Screen name="ContactStack" component={ContactStack} />
              <Tab.Screen name="MyAccountStack" component={MyAccountStack} />
            </Tab.Navigator>
      );      
  }
}

const styles = StyleSheet.create({
  iconImage: {
    width: 32,
    height: 32
  },

  inactiveIcon: {
    opacity: 0.3,
  },
})

export default CustomerTab;