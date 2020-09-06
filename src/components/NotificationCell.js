import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Moment from 'moment';
import FastImage from 'react-native-fast-image'
import Colors from '../theme/Colors'
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

const screenWidth = Dimensions.get('window').width;
class NotificationCell extends Component {

    getName(firstName, lastName) {
        var name = "";
        name = firstName + " ";

        if (lastName && lastName.length > 0) {
            name += lastName.charAt(0) + " ";
        }

        return name;
    }

    render() {
        const { data } = this.props;
        const avatar = (data && data.creator && data.creator.avatar) ? {uri: data.creator.avatar} : Images.account_icon;
        const message = (data && data.message) ? data.message : "";
        const time = (data && data.createdAt) ? Moment(this.props.data.createdAt).fromNow(true) + " ago" : "";
        const name = (data && data.creator) ? this.getName(data.creator.firstName, data.creator.lastName) : "";

        return (
            <TouchableOpacity style={[this.props.style, styles.container]} onPress={() => this.props.onSelectNotification(this.props.data)}>
                <View style={styles.contentView}>
                    <FastImage
                      style={styles.image}
                      source={avatar}
                    />
                    <View style={{ flex: 1}}>
                        <Text style={styles.reviewText}>
                            <Text style={{fontFamily: Fonts.bold}}>{name}</Text>
                            {message}
                        </Text>
                        <Text style={styles.timeText}>{time}</Text>
                    </View>
                </View>
                {
                    !this.props.data.isRead
                    ? <View style={styles.unReadContainer}>
                        <View style={styles.unReadView} />
                      </View>
                    : null
                }                
            </TouchableOpacity>
        );
    }
}

export default NotificationCell;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 10,
    },

    contentView: {
        width: screenWidth - 70,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,        
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        justifyContent: 'center',
    },

    reviewText: {
       fontFamily: Fonts.regular,
       fontSize: 16,
    },

    timeText: {
        fontFamily: Fonts.regular,
        marginTop: 3,
        fontSize: 14,
        color: Colors.subTextColor,
    },

    unReadContainer: {
        flex: 1,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },

    unReadView: {
        backgroundColor: Colors.appColor,
        width: 10,
        height: 10,
        borderRadius: 5,
    }

});