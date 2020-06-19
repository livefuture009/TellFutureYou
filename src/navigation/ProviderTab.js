import React from 'react';
import { Platform, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Images from '../theme/Images'
import Colors from '../theme/Colors'

import ProviderHome from '../screens/Provider/ProviderHomeScreen';
import ProviderSettings from '../screens/Provider/ProviderSettingsScreen';
import ProviderHistory from '../screens/Provider/ProviderHistoryScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProviderHome" component={ProviderHome} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProviderHistory" component={ProviderHistory} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProviderSettings" component={ProviderSettings} options={{ headerShown: false, gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

class ProviderTab extends React.Component {
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


export default ProviderTab;