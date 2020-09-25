import React, { Component } from 'react';
import PropTypes from "prop-types"
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import FastImage from 'react-native-fast-image'

class Avatar extends Component {
    static propTypes = {
        data: PropTypes.object,
    }

    constructor() {
        super()
        this.state = {
          
        }
    }

    render() {
        const { avatar, status } = this.props; 
        return (
            <View style={[this.props.style, styles.container]}>
                <View style={styles.avatarBox}>
                    <FastImage
                      style={styles.avatarImage}
                      source={avatar ? {uri: avatar} : Images.account_icon}
                    />
                    {status && <Text style={styles.statusText}>{status}</Text>}
                </View>                
            </View>
        );
    }
}

export default Avatar;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarBox: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,        
    },

    statusText: {
        borderWidth: 1,
        borderColor: '#e4e8ea',
        borderRadius: 10,
        textTransform: 'uppercase',
        fontFamily: Fonts.regular,
        fontSize: 9,
        borderColor: Colors.ticketColor,
        color: Colors.ticketColor,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
        marginTop: -7,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
});