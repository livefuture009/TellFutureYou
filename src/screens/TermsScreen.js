import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  StatusBar,
  ActivityIndicator
} from 'react-native';

import TopNavBar from '../components/TopNavBar'
import { WebView } from 'react-native-webview';
import Colors from '../theme/Colors'
import { SafeAreaConsumer } from 'react-native-safe-area-context';

class TermsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true);
  }

  ActivityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color={Colors.appColor}
        size='large'
        style={styles.ActivityIndicatorStyle}
      />
    );
  }
 

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SafeAreaConsumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar title="Terms of Service" align="left" onBack={() => this.onBack()}/>                      
              <View style={styles.container}>
                <WebView 
                  style={{ flex: 1 }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  renderLoading={this.ActivityIndicatorLoadingView} 
                  startInLoadingState={true}  
                  source={{ uri: 'http://12helpme.com/terms-and-conditions.html' }} 
                />
              </View>
            </View>
          }
        </SafeAreaConsumer>
      </View>
    );
  }
}

export default TermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  ActivityIndicatorStyle:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  
  }
})
