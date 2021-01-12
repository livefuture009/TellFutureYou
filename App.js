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
import moment from 'moment';
import {
  LogBox,
  View,
  TextInput,
  Text,
} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator'

class Root extends Component {
  constructor() { 
    super(); 
    Text.defaultProps = {allowFontScaling: false};
    TextInput.defaultProps = {allowFontScaling: false};
  }

  componentDidMount() {
    LogBox.ignoreAllLogs();
    moment.locale('en', {
      relativeTime : {
        future: "in %s",
        past: "%s ",
        s:  "%ds",
        m:  "%dm",
        mm: "%dm",
        h:  "%dh",
        hh: "%dh",
        d:  "%dd",
        dd: "%dd",
        M:  "a month",
        MM: "%d months",
        y:  "%dy",
        yy: "%dy"
      }
  });
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