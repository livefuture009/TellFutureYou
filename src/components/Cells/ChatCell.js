import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Dimensions, Image,
} from 'react-native';
import Moment from 'moment';
import { QUOTE_LIST } from '../../constants'
import FastImage from 'react-native-fast-image'
import Fonts from '../../theme/Fonts';
import Images from '../../theme/Images';

const win = Dimensions.get('window');

export default class ChatCell extends React.PureComponent {
  getChannelName(currentUser, name) {
    const username = currentUser.nickname;
    if (username) {
      let newName = name.replace(`${username}_`, '');
      newName = newName.replace(`_${username}`, '');
      return newName;
    }

    return name;
  }

  _renderTextCell() {
    const { item, currentUser } = this.props;
    const isCurrentMessage = (item._sender.userId === currentUser.userId);
    var message = (item && item.message) ? item.message : "";

    return (
      <Text style={[styles.messageText, isCurrentMessage ? {color: 'white'} : {color: 'black'}]}>{message}</Text>
    )
  }

  _renderQuoteCell() {
    const { item, currentUser } = this.props;
    const isCurrentMessage = (item._sender.userId === currentUser.userId);
    var message = (item && item.message) ? item.message : "";
    var selectedQuote = null;
    QUOTE_LIST.forEach(q => {
      if (q.content == message) {
        selectedQuote = q;
        return;
      }
    });
    
    return (
      <View style={styles.quoteView}>
        <Image source={Images.icon_quote_start} style={styles.quoteIcon} />
        <Text style={[styles.quoteText, isCurrentMessage ? {color: 'white'} : {color: 'black'}]}>{selectedQuote.content}</Text>
        <Text style={[styles.authorText, isCurrentMessage ? {color: 'white'} : {color: 'gray'} ]}>{selectedQuote.author}</Text>
        <View style={{alignItems: 'flex-end'}}>
          <Image source={Images.icon_quote_end} style={styles.quoteIcon} />
        </View>
      </View>
    )
  }

  _renderImageCell() {
    const { item, currentUser } = this.props;
    const isCurrentMessage = (item._sender.userId === currentUser.userId);
    var message = (item && item.message) ? item.message : "";
    var imageUrl = null;

    const array = message.split("\r\n");
    if (array && array.length > 0) {
      imageUrl = array[0];
      message = "";

      if (array.length > 1) {
        message = array[1];
      }
    }

    return (
      <View>
        {
          imageUrl
          ? <FastImage style={styles.imageBox} key={imageUrl} source={{ uri: imageUrl }} />
          : null
        }
        {
          (message && message.length > 0)
          ? <Text style={[styles.messageText, isCurrentMessage ? {color: 'white'} : {color: 'black'}]}>{message}</Text>
          : null
        }
      </View>
    )
  }

  render() {
    const { item, currentUser, onPressImage } = this.props;
    var message = (item && item.message) ? item.message : "";
    const type = (item && item.data) ? item.data : "";
    const otherUsername = (item && item._sender && item._sender.nickname) ? item._sender.nickname : "";
    const time = (item && item.createdAt) ? Moment(item.createdAt).format('DD MMM YYYY, hh:mm A') : "";
    const isCurrentMessage = (item._sender.userId === currentUser.userId);
    const MessageView = (type == 'image') ? TouchableOpacity : View;

    return (
      <View style={{ flex: 1, marginBottom: 15 }}>
        <View style={[styles.listItem, { transform: [{ scaleY: -1 }]}, isCurrentMessage ? {alignItems: 'flex-end'} : {alignItems: 'flex-start'}]}>
          { !isCurrentMessage && <Text style={styles.usernameText}>{otherUsername}</Text> }
          <MessageView style={[styles.messageBox, isCurrentMessage ? styles.myMessageBox : styles.targetMessageBox]} onPress={() => onPressImage(item)}>
            { (type == "image") && this._renderImageCell() }
            { (type == "quote") && this._renderQuoteCell() }
            { (type == null || type == "") && this._renderTextCell() }
          </MessageView>
          <Text style={[styles.timeText, isCurrentMessage ? {textAlign: 'right'} : {textAlign: 'left'}]}>
            {time}
          </Text>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
  },

  titleLabel: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#8D8D8D',
  },

  messageBox: {
    maxWidth: '80%',
    borderRadius: 10,
    shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 5,
  },

  targetMessageBox: {
    backgroundColor: 'white',
  },

  myMessageBox: {
    justifyContent: 'flex-end',
    backgroundColor: '#35b4ef',
  },

  usernameText: {
    fontFamily: Fonts.regular,
    color: 'gray',
    fontSize: 15,
    marginBottom: 5,
  },

  messageText: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    paddingHorizontal : 15,
    paddingVertical: 10,
  },

  imageBox: {
    resizeMode: 'cover',
    borderRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: 'rgb(150,150,150)',
    height: 190,
    width: win.width * 0.8 - 15,
  },
  
  timeText: {
    fontFamily: Fonts.regular,
    color: 'gray',
    fontSize: 12,
    marginRight: 3,
    marginTop: 4,
  },

  quoteView: {
    padding: 10,
  },

  quoteIcon: {
    width: 25,
    height: 18,
    resizeMode: 'contain',
  },

  quoteText: {
    fontFamily: Fonts.regular,
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },

  authorText: {
    fontFamily: Fonts.light,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'right',
    marginRight: 10,
    marginBottom: 10,
  },
});
