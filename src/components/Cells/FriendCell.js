import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Platform } from 'react-native';
import FastImage from 'react-native-fast-image'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images';

export default class FriendCell extends React.Component {
  	render() {
        const { data, currentUser, onSelect } = this.props;
        var status = 0;
        var friend = data.user1; 
        if (data.user1._id == currentUser._id) {
            friend = data.user2;
        } 

        if (data.creator == currentUser._id) {
            status = 2;
        }

        const avatar = friend.avatar ? {uri: friend.avatar} : Images.account_icon;

    	return (
	   		<TouchableOpacity style={styles.container} onPress={() => onSelect(data)}>
                <View style={[styles.contentView, Platform.OS == "ios" ? styles.shadowView: {}]}>
                    <View style={styles.leftView}>
                        <FastImage source={avatar} style={styles.avatarPhoto} />
                        <View>
                            <Text style={styles.nameText}>{friend.firstName} {friend.lastName}</Text>
                            <Text style={styles.phoneText}>{friend.phone}</Text>
                            <Text style={styles.phoneText}>{friend.email}</Text>
                        </View>                    
                    </View>
                    <View style={{width: '50%', alignItems: 'flex-end'}}>
                        {
                            status == 0 && <View />
                        }
                        {
                            status == 1 && <View />
                        }
                        {
                            status == 2 && <Text style={styles.statusText}>Request Sent</Text>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
  }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        marginHorizontal: 15,
    },

    contentView: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    shadowView: {
        shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 20,
		elevation: 5,
    },

    leftView: {
        flexDirection: 'row',
        width: '45%',
    },

    avatarPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'lightgray',
        marginRight: 10,
    },

    nameText: {
        fontFamily: Fonts.bold,
        fontSize: 16,
    },

    phoneText: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        marginTop: 2,
    },

    actionButton: {
        width: 110,
        backgroundColor: Colors.appColor,
        paddingVertical: 5,
        borderRadius: 15,
        shadowColor: Colors.appColor,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.3,
		shadowRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },

    actionButtonText: {
        fontFamily: Fonts.regular,
        color: 'white',
    },

    checkboxIcon: {
        width: 22,
		height: 22,
		resizeMode: 'contain',
    },

    statusText: {
        fontFamily: Fonts.light,
        fontStyle: 'italic',
        fontSize: 14,
    },
});