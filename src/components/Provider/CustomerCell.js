import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import Moment from 'moment';
import Rate from '../Rate'
import Colors from '../../theme/Colors'
import Images from '../../theme/Images';
import FastImage from 'react-native-fast-image'

class CustomerCell extends Component {
    render() {
        const { job } = this.props;
        const creator = job.creator;
        return (
            <View style={styles.container}>
                <FastImage
                  style={styles.image}
                  source={creator.avatar ? {uri: creator.avatar} : Images.account_icon}
                />

                <View style={styles.contentView}>
                    <Text style={styles.titleText}>{creator.firstName} {creator.lastName}</Text>
                    <Text style={styles.addressText}><Text style={styles.boldText}>Location:</Text> {job.location}</Text>
                    <Text style={styles.addressText}><Text style={styles.boldText}>Order Date:</Text> {Moment(job.date).format('ddd DD, MMM YYYY')}</Text>
                    <Text style={styles.addressText}><Text style={styles.boldText}>Due Date:</Text> {job.timeFrom} - {job.timeTo}</Text>
                </View>                
            </View>
        );
    }
}

export default CustomerCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 8,
        borderWidth: 2,
        borderColor: '#e6e6e6',
        borderRadius: 10,
        margin: 12,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },

    image: {
        width: 80,
        height: 75,
        borderRadius: 10,
        marginRight: 14,
    },

    contentView: {
        flex: 1,
        paddingRight: 10,
    },

    titleText: {
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 18,
    },

    boldText: {
        fontWeight: 'bold',
    },

    addressText: {
        fontFamily: 'OpenSans',
        marginTop: 2,
        color: Colors.subTextColor,
    },

    noGiveFeedbackText: {
        fontFamily: 'OpenSans',
        color: 'lightgray',
        fontStyle: 'italic',
        fontSize: 12,
    },

    ticket: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.ticketColor,
        color: Colors.ticketColor,
        textTransform: 'uppercase',
        fontFamily: 'OpenSans',
        fontSize: 9,
        marginLeft: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
    },

    arrowIcon: {
        width: 10,
        height: 20,
    }
});