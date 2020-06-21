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

// import ProviderProfileScreen from '../screens/Customer/ProviderProfileScreen';
// import CustomerJobDetailScreen from '../screens/Customer/CustomerJobDetailScreen';


// import DepositPaymentMethodScreen from '../screens/Customer/DepositPaymentMethodScreen';
// import BankDepositScreen from '../screens/Customer/BankDepositScreen';
// import CardDepositScreen from '../screens/Customer/CardDepositScreen';
// import PaypalDepositScreen from '../screens/Customer/PaypalDepositScreen';
// import TransactionHistoryScreen from '../screens/Customer/TransactionHistoryScreen';

// import ProviderOrderDetailScreen from '../screens/Provider/ProviderOrderDetailScreen';
// import CustomerDetailScreen from '../screens/Provider/CustomerDetailScreen';
// import ProviderJobDetailScreen from '../screens/Provider/ProviderJobDetailScreen';
// import ProviderEarningsScreen from '../screens/Provider/ProviderEarningsScreen';
// import PaymentMethodScreen from '../screens/Provider/PaymentMethodScreen';
// import PaypalWithdrawScreen from '../screens/Provider/PaypalWithdrawScreen';
// import BankWithdrawScreen from '../screens/Provider/BankWithdrawScreen';

// import NotificationScreen from '../screens/NotificationScreen';

// import ChatListScreen from '../screens/Chat/ChatListScreen';
// import ChatSceen from '../screens/Chat/ChatSceen';

import MainTab from './MainTab';
// import CustomerTab from './CustomerTab';


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
        <Stack.Screen name="MainTab" component={MainTab} options={{ headerShown: false, gestureEnabled: false }}/>
        
        {/* 
        <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ProviderProfile" component={ProviderProfileScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="CustomerJobDetail" component={CustomerJobDetailScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="Pay" component={PayScreen} options={{ headerShown: false, gestureEnabled: false }}/>

        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="DepositPaymentMethod" component={DepositPaymentMethodScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="BankDeposit" component={BankDepositScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="CardDeposit" component={CardDepositScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="PaypalDeposit" component={PaypalDepositScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} options={{ headerShown: false, gestureEnabled: false }}/>

        <Stack.Screen name="ProviderOrderDetail" component={ProviderOrderDetailScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ProviderJobDetail" component={ProviderJobDetailScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ProviderEarnings" component={ProviderEarningsScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="PaypalWithdraw" component={PaypalWithdrawScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="BankWithdraw" component={BankWithdrawScreen} options={{ headerShown: false, gestureEnabled: false }}/>

        <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ChatList" component={ChatListScreen} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="Chat" component={ChatSceen} options={{ headerShown: false, gestureEnabled: false }}/>

        <Stack.Screen name="CustomerTab" component={CustomerTab} options={{ headerShown: false, gestureEnabled: false }}/>
        <Stack.Screen name="ProviderTab" component={ProviderTab} options={{ headerShown: false, gestureEnabled: false }}/> */}
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

export default AppNavigator;

