import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Image,
} from 'react-native';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';
import Moment from 'moment';
import FastImage from 'react-native-fast-image'

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

  render() {
    const { item, currentUser, onPressImage } = this.props;
    const { data } = item;
    const width = 244;
    let height = 148;

    return (
      <View style={{ flex: 1 }}>
        {
          item && item.data == ''
            ? (
              <View style={[styles.listItem, { transform: [{ scaleY: -1 }] }]}>
                {
                  item._sender.userId === currentUser.userId
                    ? (
                      <View style={styles.myMessageBox}>
                        <Text style={[styles.messageText, styles.myMessage]}>{item.message}</Text>
                      </View>
                    )
                    : (
                      <View>
                        <Text style={styles.usernameText}>{item._sender.nickname}</Text>
                        <View style={styles.targetMessageBox}>
                          <Text style={[styles.messageText, styles.targetMessage]}>{item.message}</Text>
                        </View>
                      </View>
                    )
              }
              <Text style={item._sender.userId === currentUser.userId ? styles.myTimeText : styles.otherTimeText}>{Moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}</Text>
              </View>
            )
            : null
        }

        {
          item && item.data == 'image'
            ? (
              <View style={[styles.listItem, { transform: [{ scaleY: -1 }] }]}>
                {
                  item._sender.userId == currentUser.userId
                    ? (
                      <TouchableOpacity style={styles.myMessageBox} onPress={() => onPressImage(item)}>
                        <FastImage style={[styles.imageBox, { width, height }]} key={item.message} source={{ uri: item.message }} />
                      </TouchableOpacity>
                    )
                    : (
                      <View>
                        <Text style={styles.usernameText}>{item._sender.nickname}</Text>
                        <TouchableOpacity style={styles.targetMessageBox} onPress={() => onPressImage(item)}>
                          <FastImage style={[styles.imageBox, { width, height }]} key={item.message} source={{ uri: item.message }} />
                        </TouchableOpacity>
                      </View>
                    )
                }
                <Text style={item._sender.userId === currentUser.userId ? styles.myTimeText : styles.otherTimeText}>{Moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}</Text>
              </View>
            )
            : null
        }
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

  targetMessageBox: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  myMessageBox: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },

  usernameText: {
    fontFamily: Fonts.regular,
    color: 'gray',
    fontSize: 15,
    marginBottom: 5,
  },

  messageText: {
    fontFamily: Fonts.regular,
    color: 'black',
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },

  myMessage: {
    backgroundColor: '#35b4ef',
    color: 'white',
    maxWidth: '80%',
  },

  targetMessage: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    textAlign: 'left',
    maxWidth: '80%',
  },

  imageBox: {
    resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: 'rgb(150,150,150)',
  },
  
  myTimeText: {
    fontFamily: Fonts.regular,
    color: 'gray',
    textAlign: 'right',
    fontSize: 12,
    marginVertical: 3,
    marginRight: 3,
  },

  otherTimeText: {
    fontFamily: Fonts.regular,
    color: 'gray',
    textAlign: 'left',
    fontSize: 12,
    marginVertical: 3,
    marginLeft: 3,
  },
});
