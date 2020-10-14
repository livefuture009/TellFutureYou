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
import FriendCell from '../../components/Cells/FriendCell'
import actionTypes from '../../actions/actionTypes';
import EmptyView from '../../components/EmptyView'
import { TOAST_SHOW_TIME, Status } from '../../constants.js'
import { getFriendCountByLevel } from '../../functions'
import Colors from '../../theme/Colors'
import Messages from '../../theme/Messages'

class FriendScreen extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      isShowSearch: false,
      currentPage: 0,
      selectedFriend: null,

      friends: [],
      requests: [],
      sents: [],
    }    
  }

  componentDidMount() {
    this.setState({isLoading: true}, () => {
      this.fetchFriends();
    });

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.fetchFriends();    
    });
  }

  fetchFriends() {
    const { currentUser } = this.props;
    this.props.dispatch({
      type: actionTypes.GET_MY_FRIENDS,
      userId: currentUser._id,
    });
  }

  componentWillUnmount() {
    this.focusListener();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.friends != this.props.friends) {
      this.filterFriends();
    }

    // Get My Friends.
    if (prevProps.getMyFriendsStatus != this.props.getMyFriendsStatus) {
      if (this.props.getMyFriendsStatus == Status.SUCCESS) {
        this.filterFriends();
      } 
      else if (this.props.getMyFriendsStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Send Friend Request
    if (prevProps.sendFriendRequestStatus != this.props.sendFriendRequestStatus) {
      if (this.props.sendFriendRequestStatus == Status.SUCCESS) {
        this.onSelectPage(2);
      } 
      else if (this.props.sendFriendRequestStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Accept Friend Request
    if (prevProps.acceptFriendRequestStatus != this.props.acceptFriendRequestStatus) {
      if (this.props.acceptFriendRequestStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.filterFriends();
        this.onSelectPage(0);
      } 
      else if (this.props.acceptFriendRequestStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Decline Friend Request
    if (prevProps.declineFriendRequestStatus != this.props.declineFriendRequestStatus) {
      if (this.props.declineFriendRequestStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.filterFriends();
      } 
      else if (this.props.declineFriendRequestStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Remove Friend
    if (prevProps.removeFriendStatus != this.props.removeFriendStatus) {
      if (this.props.removeFriendStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.filterFriends();
      } 
      else if (this.props.removeFriendStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }

    // Change Active Page.
    if (prevProps.changeActiveFriendPageStatus != this.props.changeActiveFriendPageStatus) {
      if (this.props.changeActiveFriendPageStatus == Status.SUCCESS) {
        const { activePage } = this.props;
        this.onSelectPage(activePage);
      } 
    } 
    
    // Get Friend Count
    if (prevProps.getFriendCountStatus != this.props.getFriendCountStatus) {
      if (this.props.getFriendCountStatus == Status.SUCCESS) {
        this.setState({isLoading: false});
        this.checkAcceptFriendRequest(this.props.friendCount);
      } 
      else if (this.props.getFriendCountStatus == Status.FAILURE) {
        this.onFailure();
      }      
    }
  }

  filterFriends() {
    const { currentUser } = this.props;
    const { friends } = this.props;

    const list = [];
    const requests = [];
    const sents = [];

    if (friends) {
      friends.forEach(f => {
        if (f.status == 1) {
          list.push(f);
        }
        else {
          if (f.creator == currentUser._id) {
            sents.push(f);
          }
          else {
            requests.push(f);
          }
        }
      });
    }

    this.setState({
      isLoading: false, 
      friends: list,
      requests: requests,
      sents: sents
    });
  }

  onFailure() {
    this.setState({isLoading: false});
    this.toast.show(this.props.errorMessage, TOAST_SHOW_TIME);
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

  onAcceptFriend=(friend)=> {
    const { friends } = this.state;
    const { currentUser } = this.props;
    const friendCount = friends ? friends.length: 0;
    const limitCount = getFriendCountByLevel(currentUser.level);

    // Check current user's friends count.
    if (friendCount >= limitCount ) {
      Alert.alert(
        Messages.UnableAcceptRequest,
        Messages.ReachedFriendLimit,
        [
          {text: 'Ok', onPress: () => console.log('Limited')},
        ],
        { cancelable: true }
      )
    } else {
      var otherUser = friend.user1;
      if (friend.user1._id == currentUser._id) {
        otherUser = friend.user2;
      }

      this.setState({isLoading: true, selectedFriend: friend}, () => {
        this.props.dispatch({
          type: actionTypes.GET_FRIEND_COUNT,
          userId: otherUser._id,
        });
      });      
    }
  }

  checkAcceptFriendRequest(friendCount) {
    const { selectedFriend } = this.state;
    const { currentUser } = this.props;
    const limitCount = getFriendCountByLevel(currentUser.level);

    console.log("friendCount: ", friendCount);
    console.log("limitCount: ", limitCount);

    if (friendCount >= limitCount ) {
      Alert.alert(
        Messages.UnableAcceptRequest,
        Messages.ReachedFriendLimitForOther,
        [
          {text: 'Ok', onPress: () => console.log('Limited')},
        ],
        { cancelable: true }
      )
    } else {
      if (selectedFriend) {
        this.setState({isLoading: true}, () => {
          this.props.dispatch({
            type: actionTypes.ACCEPT_FRIEND_REQUEST,
            userId: currentUser._id,
            friendId: selectedFriend._id
          });
        });
      }
    }
  }

  onDeclineFriend=(friend)=> {
    const { currentUser } = this.props;
    this.setState({isLoading: true}, () => {
      this.props.dispatch({
        type: actionTypes.DECLINE_FRIEND_REQUEST,
        userId: currentUser._id,
        friendId: friend._id
      });
    });
  }

  onSendMessage=(friend)=> {
    this.props.navigation.navigate("Chat", {user: friend});
  }

  onRemoveFriend=(friend)=> {
    const { currentUser } = this.props;
    this.setState({isLoading: true}, () => {
      this.props.dispatch({
        type: actionTypes.REMOVE_FRIEND,
        userId: currentUser._id,
        friendId: friend._id
      });
    });
  }

  _renderFriends() {
    const { currentUser } = this.props;
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
              <FriendCell 
                data={item}
                currentUser={currentUser}
                onSendMessage={this.onSendMessage}
                onRemove={this.onRemoveFriend}
              />
              )}
          />
          : <EmptyView title="No friends."/>
        }
      </View>
    )
  }

  _renderRequests() {
    const { currentUser } = this.props;
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
              <FriendCell 
                  data={item}
                  currentUser={currentUser}
                  onAccept={this.onAcceptFriend}
                  onDecline={this.onDeclineFriend}
              />
              )}
          />
          : <EmptyView title="No friend requests."/>
        }
      </View>
    )
  }

  _renderSent() {
    const { currentUser } = this.props;
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
              <FriendCell 
                  data={item}
                  currentUser={currentUser}
                  onRemove={this.onRemoveFriend}
              />
              )}
          />
          : <EmptyView title="No sent requests."/>
        }
      </View>
    )
  }

  render() {
    const { currentPage } = this.state;

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
        <Toast ref={ref => (this.toast = ref)}/>
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
    paddingTop: 15,
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
    friends: state.user.friends,
    activePage: state.user.activePage,
    friendCount: state.user.friendCount,

    errorMessage: state.user.errorMessage,
    getMyFriendsStatus: state.user.getMyFriendsStatus,
    sendFriendRequestStatus: state.user.sendFriendRequestStatus,
    acceptFriendRequestStatus: state.user.acceptFriendRequestStatus,
    declineFriendRequestStatus: state.user.declineFriendRequestStatus,
    removeFriendStatus: state.user.removeFriendStatus,
    changeActiveFriendPageStatus: state.user.changeActiveFriendPageStatus,
    getFriendCountStatus: state.user.getFriendCountStatus,
  };  
}

export default connect(mapStateToProps,mapDispatchToProps)(FriendScreen);