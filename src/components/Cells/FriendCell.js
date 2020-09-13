import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Platform, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images';

const win = Dimensions.get('window');

export default class FriendCell extends React.Component {
  	render() {
        const { data, currentUser, onSendMessage, onAccept, onDecline, onRemove } = this.props;
        var status = data.status;
        var friend = data.user1; 
        if (data.user1._id == currentUser._id) {
            friend = data.user2;
        } 
        if (status == 0 && data.creator == currentUser._id) {
            status = 2;
        }

        const avatar = friend.avatar ? {uri: friend.avatar} : Images.account_icon;

    	return (
            <View style={[styles.contentView, Platform.OS == "ios" ? styles.shadowView: {}]}>
                <View style={styles.leftView}>
                    <FastImage source={avatar} style={styles.avatarPhoto} />
                    <View style={styles.infoView}>
                        <Text style={styles.nameText}>{friend.firstName} {friend.lastName}</Text>
                        <Text style={styles.phoneText}>{friend.phone}</Text>
                        <Text style={styles.phoneText}>{friend.email}</Text>
                    </View>                    
                </View>
                <View style={styles.rightView}>
                    {
                        status == 0 && <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => onAccept(data)}>
                                <Image source={Images.checkbox_selected} style={styles.actionIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={() => onDecline(data)}>
                                <Image source={Images.circle_close} style={styles.actionIcon} />
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        status == 1 && <TouchableOpacity onPress={() => onSendMessage(friend)}>
                            <TouchableOpacity style={styles.messageButton} onPress={() => onSendMessage(friend)}>
                                <Text style={styles.actionButtonText}>Send Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(data)}>
                                <Text style={styles.actionButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    }
                    {
                        status == 2 && 
                        <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(data)}>
                            <Text style={styles.actionButtonText}>Cancel Request</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        );
  }
}

const styles = StyleSheet.create({
    contentView: {
        marginBottom: 15,
        marginHorizontal: 15,
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
        width: win.width - 190,
    },

    infoView: {
        width: win.width - 250,
    },

    rightView: {
        width: 135, 
        alignItems: 'flex-end',
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
        marginLeft: 10,
    },

    messageButton: {
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

    removeButton: {
        marginTop: 7,
        width: 110,
        backgroundColor: Colors.redColor,
        paddingVertical: 5,
        borderRadius: 15,
        shadowColor: Colors.redColor,
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
        fontSize: 13,
    },

    actionIcon: {
        width: 30,
		height: 30,
		resizeMode: 'contain',
    },

    statusText: {
        fontFamily: Fonts.light,
        fontStyle: 'italic',
        fontSize: 13,
        color: 'black'
    },
});