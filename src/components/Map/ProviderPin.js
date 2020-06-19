import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Colors from '../../theme/Colors'
import Images from '../../theme/Images';
import FastImage from 'react-native-fast-image'

export default class ProviderPin extends Component {

    render() {
        const { avatar } = this.props;
        return (
            <View>  
              <Image source={Images.map_pin} style={styles.pinImage}/>
              <FastImage source={avatar ? {uri: avatar} : Images.account_icon} style={styles.avatarImage}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pinImage: {
        width: 50,
        height: 50,
      },

    avatarImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        position: 'absolute',
    },
});