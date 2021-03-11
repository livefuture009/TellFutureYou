import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Image,
} from 'react-native';
import Fonts from '../../theme/Fonts';
import Moment from 'moment';
import FastImage from 'react-native-fast-image'

export default class SelfChatCell extends React.PureComponent {
  render() {
    const { data, onPressImage } = this.props;
    const width = 244;
    let height = 148;

    const type = (data && data.type) ? data.type : "";
    const message = (data && data.message) ? data.message : "";
    const time = Moment(data.createdAt).format('DD MMM YYYY, hh:mm A');

    return (
      <View style={{ flex: 1, marginBottom: 7, marginRight: 10 }}>
          <View style={[styles.listItem, { transform: [{ scaleY: -1 }] }]}>
            <View style={styles.myMessageBox}>
                {
                    (type == "text")
                    ? <Text style={styles.messageText}>{message}</Text>
                    : null
                }
            </View>
            <Text style={styles.myTimeText}>{time}</Text>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
        backgroundColor: '#35b4ef',
        color: 'white',
        maxWidth: '80%',
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
