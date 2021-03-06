import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Image, TouchableOpacity,
} from 'react-native';
import Fonts from '../../theme/Fonts';
import Moment from 'moment';
import FastImage from 'react-native-fast-image'
import Images from '../../theme/Images';

export default class SelfChatCell extends React.PureComponent {
  render() {
    const { data, isShowSchedule, onSelect, onPressImage } = this.props;
    const type = (data && data.type) ? data.type : "";
    const message = (data && data.message) ? data.message : "";
    const author = (data && data.author) ? data.author : "";
    const image = (data && data.image) ? data.image : "";
    var time = Moment(data.createdAt).format('DD MMM YYYY, hh:mm A');
    if (isShowSchedule) {
      time = Moment(data.scheduledAt).format('DD MMM YYYY, hh:mm A');
    }

    const ContentView = isShowSchedule ? TouchableOpacity : View;
    return (
      <View style={{ flex: 1, marginBottom: 20, marginRight: 15 }}>
        <View style={[styles.listItem, { transform: [{ scaleY: -1 }] }]}>
          <ContentView style={styles.myMessageBox} onPress={() => {
            if (onSelect) {
              onSelect(data)
            }
          }}>
            {
              (type == "text")
              ? <Text style={styles.messageText}>{message}</Text>
              : null
            }
            {
              (type == "image")
              ? <TouchableOpacity style={{width: '100%'}} onPress={() => onPressImage(data)}>
                <FastImage source={{uri: image}} style={styles.photo}/>
                {
                  (message && message.length > 0)
                  ? <Text style={styles.messageText}>{message}</Text>
                  : null
                }
              </TouchableOpacity>
              : null
            }
            {
              (type == "quote")
              ? <View style={styles.quoteView}>
                <Image source={Images.icon_quote_start} style={styles.quoteIcon} />
                <Text style={styles.quoteText}>{message}</Text>
                <Text style={styles.authorText}>{author}</Text>
                <View style={{alignItems: 'flex-end'}}>
                  <Image source={Images.icon_quote_end} style={styles.quoteIcon} />
                </View>
              </View>
              : null
            }
          </ContentView>
          <Text style={styles.myTimeText}>{time}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    alignItems: 'flex-end',
  },

  myMessageBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    maxWidth: '80%',
    borderRadius: 10,
    shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 5,
    backgroundColor: 'white',
  },

  messageText: {
    fontFamily: Fonts.regular,
    color: 'black',
    fontSize: 15,
    paddingHorizontal : 15,
    paddingVertical: 10,
  },

  myTimeText: {
    fontFamily: Fonts.regular,
    color: 'gray',
    textAlign: 'right',
    fontSize: 11,
    marginTop: 9,
    marginRight: 3,
  },

  photo: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
    backgroundColor: 'lightgray',
    borderRadius: 10,
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
    color: 'gray',
    marginRight: 10,
    marginBottom: 10,
  },
});
