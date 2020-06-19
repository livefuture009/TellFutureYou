import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';

import TopNavBar from '../components/TopNavBar'
import { WebView } from 'react-native-webview';
import Colors from '../theme/Colors'

class TermsScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  ActivityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color='#009688'
        size='large'
        style={styles.ActivityIndicatorStyle}
      />
    );
  }
 

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.navColor}}>
        <View style={styles.container}>
          <TopNavBar title="Terms of Service" onBack={() => this.onBack()}/>
          <WebView 
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            renderLoading={this.ActivityIndicatorLoadingView} 
            startInLoadingState={true}  
            source={{ uri: 'http://12helpme.com/terms-and-conditions.html' }} 
          />
        </View>
      </SafeAreaView>
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
