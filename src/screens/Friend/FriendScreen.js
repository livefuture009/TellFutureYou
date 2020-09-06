import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';

import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import Swiper from 'react-native-swiper'
import HeaderInfoBar from '../../components/HeaderInfoBar'
import TopTabBar from '../../components/TopTabBar'
import SearchBox from '../../components/SearchBox'
import LoadingOverlay from '../../components/LoadingOverlay'
import ContactCell from '../../components/Cells/ContactCell'
import actionTypes from '../../actions/actionTypes';
import EmptyView from '../../components/EmptyView'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

class FriendScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isShowSearch: false,
      currentPage: 0,

      friends: [],
      requests: [],
      sents: [],
    }    
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.props.dispatch({
        type: actionTypes.GET_MY_FRIENDS,
        userId: currentUser._id,
      });
    });
  }

  componentWillUnmount() {
    this.focusListener();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.getMyFriendsStatus != this.props.getMyFriendsStatus) {
      if (this.props.getMyFriendsStatus == Status.SUCCESS) {
        const { friends } = this.props;
        this.setState({isLoading: false, friends: friends});
      } 
      else if (this.props.getMyFriendsStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  onFailure() {
    this.setState({isLoading: false});
    this.refs.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
  }

  onBack() {
    this.props.navigation.goBack();
  }

  searchContacts(keyword) {
    var text = keyword.toLowerCase().trim();
    const { originalContacts } = this.state;
    if (text && text.length > 0) {
        var list = [];
        if (originalContacts && originalContacts.length > 0) {
          originalContacts.forEach(item => {
            const name = item.firstName + " " + item.lastName;
            if (name.toLowerCase().indexOf(text) >= 0) {
                list.push(item);
            }
          });
          this.setState({contacts: list});
        }
    } 
    else {
        this.setState({contacts: originalContacts});
    }
  }

  onSelectContact=(c)=> {
    c.selected = !c.selected;
    const { contacts } = this.state;
    var list = [];
    if (contacts && contacts.length > 0) {
        contacts.forEach(item => {
            if (item.id == c.id) {
                list.push(c);
            } else {
                list.push(item);
            }
        });

        this.setState({contacts: list});
    }
  }

  onSendMessage=(data)=> {
    this.props.navigation.navigate('Chat', {contact: data});
  }

  showResultMessage(message, isBack) {
    Alert.alert(
      '',
      message,
      [
        {text: 'OK', onPress: () => {
          if (isBack) {
            this.onBack();
          }
        }},
      ]
    );  
  }

  // Change Timeline and Restaurant Tab.
  onSelectPage=(page)=> {
    const change = page - this.state.currentPage;
    if (change) return this.swiper.scrollBy(change, true);
  }

  onSwipeIndexChanged=(index)=> {
    this.setState({currentPage: index});
  }

  _renderFriends() {
    const { friends } = this.state;
    return (
      <View style={styles.slide}>
        {
          (friends && friends.length > 0)
          ?  <FlatList
              data={friends}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => (<View style={{height: 70}}/>)}
              renderItem={({ item, index }) => (
              <ContactCell 
                  data={item}
                  onSendInvite={this.onSendInvite}
                  onSendMessage={this.onSendMessage}
                  onSelect={this.onSelect}
              />
              )}
          />
          : <EmptyView title="No friends."/>
        }
      </View>
    )
  }

  _renderRequests() {
    const { requests } = this.state;
    return (
      <View style={styles.slide}>
        {
          (requests && requests.length > 0)
          ?  <FlatList
              data={requests}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => (<View style={{height: 70}}/>)}
              renderItem={({ item, index }) => (
              <ContactCell 
                  data={item}
                  onSendInvite={this.onSendInvite}
                  onSendMessage={this.onSendMessage}
                  onSelect={this.onSelect}
              />
              )}
          />
          : <EmptyView title="No friend requests."/>
        }
      </View>
    )
  }

  _renderSent() {
    const { sents } = this.state;
    return (
      <View style={styles.slide}>
        {
          (sents && sents.length > 0)
          ?  <FlatList
              data={sents}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={() => (<View style={{height: 70}}/>)}
              renderItem={({ item, index }) => (
              <ContactCell 
                  data={item}
                  onSendInvite={this.onSendInvite}
                  onSendMessage={this.onSendMessage}
                  onSelect={this.onSelect}
              />
              )}
          />
          : <EmptyView title="No sent requests."/>
        }
      </View>
    )
  }

  render() {
    const { friends, keyword, isShowSearch, currentPage } = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.pageColor}}>
        <View style={styles.container}>
          <HeaderInfoBar 
            title="MY FRIENDS" 
          />
          <View style={{flex: 1}}>
            <View style={styles.contentView}>
                <TopTabBar
                    titles={["Friends", "Requests", "Sent"]}
                    currentPage={currentPage} 
                    onSelectPage={this.onSelectPage}
                />
                <Swiper 
                  style={styles.wrapper} 
                  ref={ref => (this.swiper = ref)}
                  showsPagination={false} 
                  loop={false}
                  onIndexChanged={this.onSwipeIndexChanged}
                >
                  { this._renderFriends() }
                  { this._renderRequests() }
                  { this._renderSent() }
                </Swiper>
            </View>
          </View>
        </View>
        <Toast ref="toast"/>
        { this.state.isLoading && <LoadingOverlay /> } 
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentView: {
    flex: 1,
    backgroundColor: '#f2f2f5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  slide: {
    flex: 1,
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
    getMyFriendsStatus: state.user.getMyFriendsStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(FriendScreen);