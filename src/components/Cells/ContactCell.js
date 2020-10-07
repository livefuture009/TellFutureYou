import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Platform, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image'
import { CONTACT_STATUS } from '../../constants';
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images';

const win = Dimensions.get('window');

export default class ContactCell extends React.Component {
    onAction(data) {
        const { onSendInvite, onSendMessage, onCancelRequest, onRemoveFriend, onAcceptRequest } = this.props;

        if (data.status == CONTACT_STATUS.NONE) {
            onSendInvite(data);
        } 
        else if (data.status == CONTACT_STATUS.EXIST_ACCOUNT) {
            onSendMessage(data);
        }
        else if (data.status == CONTACT_STATUS.SENT_REQUEST) {
            onCancelRequest(data);
        }
        else if (data.status == CONTACT_STATUS.FRIEND) {
            onRemoveFriend(data);
        }
        else if (data.status == CONTACT_STATUS.RECEIVE_REQUEST) {
            onAcceptRequest(data);
        }
    }

  	render() {
        const { data, isImport, onSelect } = this.props;
        const avatar = data.avatar ? {uri: data.avatar} : Images.account_icon;
    	return (
	   		<TouchableOpacity style={styles.container} onPress={() => onSelect(data)}>
                <View style={[styles.contentView, Platform.OS == "ios" ? styles.shadowView: {}]}>
                    <View style={styles.leftView}>
                        <FastImage source={avatar} style={styles.avatarPhoto} />
                        <View style={styles.infoView}>
                            <Text style={styles.nameText}>{data.firstName} {data.lastName}</Text>
                            <Text style={styles.phoneText}>{data.phone}</Text>
                            <Text style={styles.phoneText}>{data.email}</Text>
                        </View>                    
                    </View>
                    <View style={styles.rightView}>
                    {
                        isImport
                        ? <Image source={data.selected ? Images.checkbox_selected : Images.checkbox_normal} style={styles.checkboxIcon}/>
                        : <TouchableOpacity onPress={() => this.onAction(data)}>
                            {
                                data.status == CONTACT_STATUS.NONE &&
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={styles.actionButton}>
                                        <Text style={styles.actionButtonText}>Send Invite</Text>
                                    </View>        
                                    <Image source={Images.arrow_right} style={styles.arrowIcon}/>
                                </View>
                            }
                            
                            {
                                data.status === CONTACT_STATUS.EXIST_ACCOUNT &&
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={[styles.actionButton, styles.addFriendBtn]}>
                                        <Text style={styles.actionButtonText}>Add Friend</Text>
                                    </View>        
                                    <Image source={Images.arrow_right} style={styles.arrowIcon}/>
                                </View>
                            }
                            {
                                data.status === CONTACT_STATUS.SENT_REQUEST &&
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={[styles.actionButton, {backgroundColor: Colors.redColor}]}>
                                        <Text style={styles.actionButtonText}>Cancel Request</Text>
                                    </View>        
                                    <Image source={Images.arrow_right} style={styles.arrowIcon}/>
                                </View>
                            }
                            {
                                data.status === CONTACT_STATUS.FRIEND &&
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={[styles.actionButton, {backgroundColor: Colors.redColor}]}>
                                        <Text style={styles.actionButtonText}>Remove Friend</Text>
                                    </View>        
                                    <Image source={Images.arrow_right} style={styles.arrowIcon}/>
                                </View>
                            }
                            {
                                data.status === CONTACT_STATUS.RECEIVE_REQUEST &&
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={[styles.actionButton, styles.acceptBtn]}>
                                        <Text style={styles.actionButtonText}>Accept Request</Text>
                                    </View>        
                                    <Image source={Images.arrow_right} style={styles.arrowIcon}/>
                                </View>
                            }
                        </TouchableOpacity>

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
        width: win.width - 190,
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

    infoView: {
        width: win.width - 250,
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

    addFriendBtn: {
        backgroundColor: Colors.newJobTextColor,
        shadowColor: Colors.newJobTextColor,
    },

    acceptBtn: {
        backgroundColor: Colors.workingJobTextColor,
        shadowColor: Colors.workingJobTextColor,
    },

    actionButtonText: {
        fontFamily: Fonts.regular,
        color: 'white',
        fontSize: 13,
    },

    checkboxIcon: {
        width: 22,
		height: 22,
		resizeMode: 'contain',
    },

    arrowIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginLeft: 5,
        marginRight: -5,
    },
});