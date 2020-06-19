import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Fonts from '../theme/Fonts';

class LocationItem extends Component {
    render() {
        return (
            <TouchableOpacity onPress={() => this.props.onSelectAddress(this.props.description)}>
                <Text style={[styles.addressText, this.props.theme==='black' ? styles.blackText : styles.whiteText]}>{this.props.description}</Text>       
            </TouchableOpacity>
        );
    }
}

export default LocationItem;

const styles = StyleSheet.create({
    addressText: {
        fontFamily: Fonts.regular,
        fontStyle: 'italic',
        fontSize: 12,
        paddingTop: 5,
        paddingBottom: 5,
        paddingHorizontal: 15,
    },

    blackText: {
        color: 'gray',
    },

    whiteText: {
        color: 'white',
    },
});

