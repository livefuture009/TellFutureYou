import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import FastImage from 'react-native-fast-image'
import CheckBox from '../CheckBox'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images';

export default class ContactCell extends React.Component {
  	render() {
        const { data, isImport, onSelect, onSendInvite, onSendMessage } = this.props;
        const avatar = data.avatar ? {uri: data.avatar} : Images.account_icon;

    	return (
	   		<TouchableOpacity style={styles.container} onPress={() => onSelect(data)}>
                <View style={[styles.contentView, Platform.OS == "ios" ? styles.shadowView: {}]}>
                    <View style={styles.leftView}>
                        <FastImage source={avatar} style={styles.avatarPhoto} />
                        <View>
                            <Text style={styles.nameText}>{data.firstName} {data.lastName}</Text>
                            <Text style={styles.phoneText}>{data.phone}</Text>
                            <Text style={styles.phoneText}>{data.email}</Text>
                        </View>                    
                    </View>
                    <View style={{width: '50%', alignItems: 'flex-end'}}>
                    {
                        isImport
                        ? <CheckBox value={data.selected} />
                        : <TouchableOpacity onPress={() => {
                            if (data.status === 0) {
                                onSendInvite(data);
                            } else {
                                onSendMessage(data);
                            }
                            }}>
                            <View style={styles.actionButton}>
                                {
                                    data.status === 0
                                    ? <Text style={styles.actionButtonText}>Send Invite</Text>
                                    : <Text style={styles.actionButtonText}>Send Message</Text>
                                }
                            </View>
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
});