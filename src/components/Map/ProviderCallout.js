import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import Colors from '../../theme/Colors'
import Images from '../../theme/Images';
import RoundButton from '../RoundButton';

export default class ProviderCallout extends Component {
    getDistance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    }

    render() {
        const { provider, currentLat, currentLng, showProfileButton, onProfile } = this.props;
        const name = provider?.firstName + " " + provider?.lastName;
        const distance = this.getDistance(currentLat, currentLng, provider.geolocation.coordinates[1], provider.geolocation.coordinates[0], "K")
        return (
            <View style={styles.container}>
                <Text style={styles.nameText}>{name}</Text>
                <View style={styles.rowView}>
                    <Image source={Images.pin_icon} style={styles.pinImage} />
                    <Text style={styles.distanceText}>{distance.toFixed(2)}km away</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 200,
        paddingTop: 5,
        paddingBottom: 15,
        alignItems: 'center',
    },

    nameText: {
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },

    distanceText: {
        fontFamily: 'OpenSans',
        marginLeft: 5,
        color: '#8c8c8c',
    },

    pinImage: {
        width: 15,
        height: 20,
    },

    rowView: {
        flexDirection: 'row',
    },

    blueButton: {
        marginTop: 15,
        width: 185,
    },
});