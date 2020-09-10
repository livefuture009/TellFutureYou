/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import {store, persistor} from './src/store';
import {
  YellowBox,
  View,
  Text,
} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator'

class Root extends Component {
  componentDidMount() {
    YellowBox.ignoreWarnings(['Animated: `useNativeDriver`']);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<View><Text>Loading</Text></View>} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    );
  }
};
export default Root;