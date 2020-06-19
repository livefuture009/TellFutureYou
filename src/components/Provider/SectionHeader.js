import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import Fonts from '../../theme/Fonts'

class SectionHeader extends Component {
    render() {
        return (
            <Text style={styles.titleText}>{this.props.title}</Text>
        );
    }
}

export default SectionHeader;

const styles = StyleSheet.create({
    titleText: {
        backgroundColor: 'white',
        fontFamily: Fonts.regular,
        color: '#919191',
        textTransform: 'uppercase',
        fontSize: 16,
        padding: 10,
        marginBottom: 10,
    },
});