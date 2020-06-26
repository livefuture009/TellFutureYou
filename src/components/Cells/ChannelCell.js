import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import Colors from '../../theme/Colors';
import Images from '../../theme/Images';
import FastImage from 'react-native-fast-image'
import Moment from 'moment';

export default class ChannelCell extends React.PureComponent {
  getChannelName(currentUser, channel) {
    const members = channel.members;
    if (members[0].userId === currentUser.userId) {
      return members[1].nickname;
    } else {
      return members[0].nickname;
    }
  }

  getProfileImage(currentUser, channel) {
    const members = channel.members;
    if (members[0].userId === currentUser.userId) {
      return members[1].profileUrl;
    } else {
      return members[0].profileUrl;
    }
  }

  render() {
    const { channel, currentUser } = this.props;
    const room = this.getChannelName(currentUser, channel);
    const messageType = channel.lastMessage ? channel.lastMessage.data : '';
    var message = '';
    if (messageType == 'image' || messageType == 'audio') {
      message = '[' + messageType + ']';
    } else {
      message = channel.lastMessage ? channel.lastMessage.message : '';
    }

    const avatar = this.getProfileImage(currentUser, channel);
    var time = ''
    if (channel.lastMessage) {
      const createdAt = channel.lastMessage ? channel.lastMessage.createdAt : '';      
      time = Moment(createdAt).fromNow(true) + " ago";
    }
    

    return (
      <TouchableOpacity onPress={() => this.props.onPress(channel, room)} style={styles.listItem}>
        <View style={{flexDirection: 'row', alignItems: 'center', width: '60%'}}>
          <FastImage
            style={styles.avatarImage}
            source={avatar ? {uri: avatar} : Images.account_icon}
          />
          <View>
            <Text style={channel.unreadMessageCount > 0 ? styles.boldTitleLabel : styles.titleLabel}>{room}</Text>
            <Text style={styles.lastMessageText} numberOfLines={2}>{message}</Text>
          </View>          
        </View>
      <Text style={styles.timeText}>{time}</Text>
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#D8D8D8',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  avatarImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    resizeMode: 'cover',
    backgroundColor: 'gray',
  }, 

  boldTitleLabel: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: Colors.appColor,
  },

  titleLabel: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 17,
    color: 'black',
  },

  unreadBadge: {
    backgroundColor: Colors.appColor,
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  lastMessageText: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: 'gray',
    marginTop: 3,
  },

  timeText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: 'gray',
  },
});
