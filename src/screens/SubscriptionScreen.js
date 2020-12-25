import React, { Component } from 'react';
import {
  Alert,
  View,
  SafeAreaView,
  StyleSheet,
  FlatList
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';

import TopNavBar from '../components/TopNavBar'
import RoundButton from '../components/RoundButton'
import LoadingOverlay from '../components/LoadingOverlay'
import SubscriptionCell from '../components/Cells/SubscriptionCell'
import actionTypes from '../actions/actionTypes';
import { 
  TOAST_SHOW_TIME, 
  Status, 
  SUBSCRIPTION_STANDARD, 
  SUBSCRIPTION_PREMIUM, 
  USER_LEVEL 
} from '../constants.js'

import Messages from '../theme/Messages'
import Colors from '../theme/Colors'


const itemSubs = Platform.select({
  ios: [SUBSCRIPTION_STANDARD, SUBSCRIPTION_PREMIUM],
  android: [SUBSCRIPTION_STANDARD, SUBSCRIPTION_PREMIUM]
});

class SubscriptionScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isRequestSubscription: false,
      products: [],
      selectedIndex: -1,
    }    
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser.level == USER_LEVEL.STANDARD) {
      this.setState({selectedIndex: 0});
    } else if (currentUser.level == USER_LEVEL.PREMIUM) {
      this.setState({selectedIndex: 1});
    }
    this.initIAP();
  }

  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }

    RNIap.endConnection();
  }

  async initIAP() {
    try {
      await RNIap.initConnection();
      this.getSubscriptions();
    } catch (err) {
      console.warn(err.code, err.message);
    }
  }

  initIAPListener() {
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          if (this.state.isRequestSubscription) {
            this.finishTransaction(purchase);
          }          
        }
      },
    );

    this.purchaseErrorSubscription = purchaseErrorListener(
      (error) => {
        if (this.state.isRequestSubscription) {
          Alert.alert(Messages.SubscriptionCancelled, '');
        }        
        this.setState({isLoading: false, isRequestSubscription: false});
      },
    );
  }

  getSubscriptions = async () => {
    const _SELF = this;
    try {
        _SELF.setState({isLoading: true});
        const products = await RNIap.getSubscriptions(itemSubs);
        _SELF.setState({products: products, isLoading: false});
        _SELF.initIAPListener();
    } 
    catch (err) {
       console.warn(err.code, err.message);
       _SELF.setState({isLoading: false});
       Alert.alert(Messages.NetWorkError, '');
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.changeSubscriptionStatus != this.props.changeSubscriptionStatus) {
      if (this.props.changeSubscriptionStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.showMessage(Messages.SubscriptionCompleted, true);
      } 
      else if (this.props.changeSubscriptionStatus == Status.FAILURE) {
        this.setState({isLoading: false});
        this.showMessage(Messages.SubscriptionFailed, false);        
      }      
    }
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onFailure() {
    this.setState({isLoading: false});
    this.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  showMessage(message, isBack) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          if (isBack) this.onBack();
        }},
      ],
      {cancelable: false},
    ); 
  }

  finishTransaction(purchase) {
    const { currentUser } = this.props;
    this.setState({isRequestSubscription: false, isLoading: true});
    var level = currentUser.level;
    if (purchase.productId == SUBSCRIPTION_STANDARD) {
      level = USER_LEVEL.STANDARD;
    } else {
      level = USER_LEVEL.PREMIUM;
    }
    
    this.props.dispatch({
        type: actionTypes.CHANGE_SUBSCRIPTION,
        user_id: currentUser._id,
        level,
        subscription: purchase
    }); 
  }

  onSubscribe=()=> {
    const {selectedIndex, products} = this.state; 
    if (selectedIndex >= 0) {
      this.requestSubscription(products[selectedIndex].productId);
    }    
  }

  requestSubscription = async (sku) => {
    try {
      this.setState({isLoading: true, isRequestSubscription: true});
      await RNIap.requestSubscription(sku);
    } catch (err) {
      this.setState({isLoading: false, isRequestSubscription: false});
    }
  }

  render() {
    const { products, selectedIndex } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: Colors.appColor}}>
        <SafeAreaInsetsContext.Consumer>
          {insets => 
            <View style={{flex: 1, paddingTop: insets.top }} >
              <TopNavBar title="SUBSCRIPTION" align="left" onBack={() => this.onBack()} />
              <View style={styles.container}>
                <FlatList 
                  style={styles.listView}
                  data={products}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <SubscriptionCell 
                      data={item} 
                      key={index} 
                      index={index}
                      selectedIndex={selectedIndex}
                      onSelect={(index) => this.setState({selectedIndex: index})} 
                    />
                  )}
                />
                <View style={styles.viewBottom}>
                  <RoundButton 
                    title="Subscribe" 
                    theme="blue" 
                    style={styles.registerButton} 
                    onPress={this.onSubscribe} 
                  />
                </View>
              </View>
            </View>
          }
        </SafeAreaInsetsContext.Consumer>
        <Toast ref={ref => (this.toast = ref)}/>
        { this.state.isLoading && <LoadingOverlay /> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },

  contentView: {
    paddingTop: 30,
    paddingHorizontal: 30,
  },

  viewBottom: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 20,
  },

  registerButton: {
    marginTop: 20,
    width: '90%'
  },
})

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
    errorMessage: state.user.errorMessage,
    changeSubscriptionStatus: state.user.changeSubscriptionStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(SubscriptionScreen);