import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Image,
} from 'react-native';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';
import Moment from 'moment';
import FastImage from 'react-native-fast-image'

export default class ScheduledChatCell extends React.PureComponent {
  render() {
    const { data } = this.props;
    const width = 244;
    let height = 148;

    return (
      <View style={{ flex: 1 }}>
        {
          data && data.type == 'text'
            ? (
              <View style={[styles.listItem, { transform: [{ scaleY: -1 }] }]}>
                <View style={styles.myMessageBox}>
                    <Text style={[styles.messageText, styles.myMessage]}>{data.message}</Text>
                </View>
                <Text style={styles.myTimeText}>{Moment(data.scheduledAt).format('DD MMM YYYY, hh:mm A')}</Text>
              </View>
            )
            : null
        }
        {
          data && data.type == 'image'
            ? (
              <View style={[styles.listItem, { transform: [{ scaleY: -1 }] }]}>
                <FastImage style={[styles.imageBox, { width, height }]} key={data.message} source={{ uri: item.message }} />
                <Text style={styles.myTimeText}>{Moment(data.scheduledAt).format('DD MMM YYYY, hh:mm A')}</Text>
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

  myMessageBox: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'flex-end',
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
});
