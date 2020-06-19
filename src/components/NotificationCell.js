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
        return (
            <TouchableOpacity style={[this.props.style, styles.container]} onPress={() => this.props.onSelectNotification(this.props.data)}>
                <View style={styles.contentView}>
                    <FastImage
                      style={styles.image}
                      source={this.props.data.creator.avatar ? {uri: this.props.data.creator.avatar} : Images.account_icon}
                    />
                    <View style={{ flex: 1}}>
                        <Text style={styles.reviewText}>
                            <Text style={{fontFamily: Fonts.bold}}>{this.getName(this.props.data.creator.firstName, this.props.data.creator.lastName)}</Text>
                            {this.props.data.message}
                        </Text>
                        <Text style={styles.timeText}>{Moment(this.props.data.createdAt).fromNow(true)} ago</Text>
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
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
        backgroundColor: 'white',
    },

    contentView: {
        width: screenWidth - 50,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,        
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
        backgroundColor: 'red',
        width: 15,
        height: 15,
        borderRadius: 7,
    }

});