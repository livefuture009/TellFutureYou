import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Images from '../theme/Images'
import Colors from '../theme/Colors'

import CustomerHome from '../screens/Customer/CustomerHomeScreen';
import SubService from '../screens/Customer/SubServiceScreen';
import JobPost from '../screens/Customer/JobPostScreen';
import ProviderList from '../screens/Customer/ProviderListScreen';

import CustomerHistory from '../screens/Customer/CustomerHistoryScreen';

import CustomerSettings from '../screens/Customer/CustomerSettingsScreen';
import CustomerPayment from '../screens/Customer/CustomerPaymentScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CustomerHome" component={CustomerHome} options={{ headerShown: false, gestureEnabled: false }}/>
      <Stack.Screen name="SubService" component={SubService} options={{ headerShown: false, gestureEnabled: false }}/>
      <Stack.Screen name="JobPost" component={JobPost} options={{ headerShown: false, gestureEnabled: false }}/>
      <Stack.Screen name="ProviderList" component={ProviderList} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CustomerHistory" component={CustomerHistory} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CustomerSettings" component={CustomerSettings} options={{ headerShown: false, gestureEnabled: false }}/>
      <Stack.Screen name="CustomerPayment" component={CustomerPayment} options={{ headerShown: false, gestureEnabled: false }}/>
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

                  if (route.name === 'HomeStack') {
                    icon = Images.tab_home;
                    selectedIcon = Images.tab_home_selected;
                  }
                  else if (route.name === 'HistoryStack') {
                    icon = Images.tab_history;
                    selectedIcon = Images.tab_history_selected;
                  } 
                  else if (route.name === 'SettingsStack') {
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
              <Tab.Screen name="HomeStack" component={HomeStack} />
              <Tab.Screen name="HistoryStack" component={HistoryStack} />
              <Tab.Screen name="SettingsStack" component={SettingsStack} />
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