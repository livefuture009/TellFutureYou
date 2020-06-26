import React from 'react';
import { View, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import TermsScreen from '../screens/TermsScreen';
import VerificationCodeScreen from '../screens/VerificationCodeScreen';
import ResetNewPasswordScreen from '../screens/ResetNewPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

import EditProfileScreen from '../screens/EditProfileScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ImportContactScreen from '../screens/Contact/ImportContactScreen';
import ContactDetailScreen from '../screens/Contact/ContactDetailScreen';
import ChatSceen from '../screens/Chat/ChatSceen';

import MainTab from './MainTab';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="Terms" component={TermsScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="VerificationCode" component={VerificationCodeScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ResetNewPassword" component={ResetNewPasswordScreen} options={{ headerShown: false, gestureEnabled: false }}/>        
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ImportContact" component={ImportContactScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ContactDetail" component={ContactDetailScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="Chat" component={ChatSceen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="MainTab" component={MainTab} options={{ headerShown: false, gestureEnabled: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

