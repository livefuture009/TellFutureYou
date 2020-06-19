import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../theme/Colors'
import Images from '../../theme/Images';
import FastImage from 'react-native-fast-image';

class EditAvatar extends Component {
    render() {
        return (
            <TouchableOpacity style={[this.props.style, styles.container]} onPress={() => this.props.onTakePhoto()}>
                <View style={styles.avatarBox}>
                    <FastImage
                      style={styles.avatarImage}
                      source={this.props.avatar ? {uri: this.props.avatar} : Images.account_icon}
                    />
                </View>                

                <View style={{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      style={styles.photoIcon}
                      source={Images.white_photo_icon}
                    />
                </View>                
            </TouchableOpacity>
        );
    }
}

export default EditAvatar;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 146,
        height: 146,
    },

    avatarBox: {
        width: '100%',
        height: '100%',
        borderRadius: 73,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.borderColor,
    },

    avatarImage: {
        width: 125,
        height: 125,
        borderRadius: 62.5,
        resizeMode: 'cover',
    },

    photoIcon: {
        width: 60,
        height: 47,
        resizeMode: 'contain',
    },
});