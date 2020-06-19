import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Moment from 'moment';
import Colors from '../../theme/Colors';
import Fonts from '../../theme/Fonts';

class OrderHeader extends Component {
    render() {
        return (
            <View style={[this.props.style, styles.container]} onPress={() => this.props.onChoose(this.props.data)}>
                {
                    this.props.data.photos && this.props.data.photos.length > 0 
                    ?  <Image
                          style={styles.image}
                          source={{uri: this.props.data.photos[0]}}
                        />                      
                    : null
                }                

                <View style={styles.contentView}>
                    <Text style={styles.titleText}>{this.props.data.title}</Text>
                    <View style={styles.oneRow}>
                        <Text style={styles.addressText}>Order from: </Text>
                        <Text style={styles.addressText}>{this.props.data.creator.firstName} {this.props.data.creator.lastName}</Text>
                    </View>
                    
                    <View style={styles.oneRow}>
                        <Text style={styles.addressText}>Order Date: </Text>
                        <Text style={styles.addressText}>{Moment(this.props.data.date).format('ddd DD, MMM YYYY')}</Text>
                    </View>
                </View>                
            </View>
        );
    }
}

export default OrderHeader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 14,
        backgroundColor: '#f4f4f7',
        alignItems: 'center',
    },

    image: {
        width: 100,
        height: 90,
        borderRadius: 10,
        marginRight: 25,
        backgroundColor: Colors.placeholderColor,
    },

    contentView: {
        flex: 1,
        paddingRight: 10,
    },

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 20,
        marginBottom: 5,
    },

    oneRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    labelText: {
        fontFamily: Fonts.bold,
    },

    addressText: {
        fontFamily: Fonts.regular,
    },
});