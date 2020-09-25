import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';

import { WebView } from 'react-native-webview';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { WEB_PAGE_TYPE, TERMS_LINK, PRIVACY_LINK } from '../constants'
import Images from '../theme/Images'
import Colors from '../theme/Colors'

class TermsScreen extends Component {
  constructor() {
    super()
    this.state = {
      page: -1,
    }
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true);
    if (this.props.route.params && this.props.route.params.page) {
      const { page } = this.props.route.params;
      console.log("page: ", page);
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
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SafeAreaConsumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TouchableOpacity style={styles.btnBack} onPress={() => this.onBack()}>
                <Image source={Images.icon_white_back} style={styles.backIcon}/>
              </TouchableOpacity>
              <View style={styles.container}>
                {
                  (link && link.length > 0) 
                    ? <WebView 
                        style={{ flex: 1 }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        renderLoading={this.ActivityIndicatorLoadingView} 
                        startInLoadingState={true}  
                        source={{ uri: link }} 
                      />                  
                    : null
                }
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
  },

  btnBack: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 2,
  },

  backIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  }

})
