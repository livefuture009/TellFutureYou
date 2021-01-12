import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import TopNavBar from '../components/TopNavBar'
import { WebView } from 'react-native-webview';
import Colors from '../theme/Colors'
import { WEB_PAGE_TYPE, TERMS_LINK, PRIVACY_LINK } from '../constants';

class TermsScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor() {
    super()
    this.state = {
      page: -1,
    }
  }

  componentDidMount() {
    if (this.props.route.params && this.props.route.params.page) {
      const { page } = this.props.route.params;
      this.setState({page: page});
    }
  }

  onBack() {
    this.props.navigation.goBack();
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
    var title = "";
    var link = "";

    const { page } = this.state;
    if (page == WEB_PAGE_TYPE.TERMS) {
      title = "Terms and Conditions";
      link = TERMS_LINK;
    } 
    else if (page == WEB_PAGE_TYPE.PRIVACY) {
      title = "Privacy Policy";
      link = PRIVACY_LINK;
    }
    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar 
                title={title} 
                leftButton="back"
                onBack={() => this.onBack()}
              />                      
              <View style={styles.container}>
                <WebView 
                  style={{ flex: 1 }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  renderLoading={this.ActivityIndicatorLoadingView} 
                  startInLoadingState={true}  
                  source={{ uri: link }} 
                />
              </View>
            </View>
          }
        </SafeAreaInsetsContext.Consumer>
      </View>
    );
  }
}

export default TermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
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
