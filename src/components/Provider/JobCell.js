import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Moment from 'moment';
import FastImage from 'react-native-fast-image'
import Colors from '../../theme/Colors';
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';

class JobCell extends Component {
    render() {
        const { data, onChoose } = this.props;
        return (
            <TouchableOpacity style={[this.props.style, styles.container]} onPress={() => onChoose(data)}>
                {
                    data.photos && data.photos.length > 0
                    ? <FastImage
                        style={styles.image}
                        source={{uri: data.photos[0]}}
                      />
                    : null
                }
                

                <View style={styles.contentView}>
                    <View style={{width: '90%'}}>
                        <Text style={styles.titleText} numberOfLines={2} ellipsizeMode='tail'>{data.title}</Text>
                        <Text style={styles.addressText} numberOfLines={2} ellipsizeMode='tail'>{data.location}</Text>
                        <Text style={styles.addressText}>{Moment(data.createdAt).format('ddd DD, MMM YYYY')}</Text>
                        <Text style={styles.priceText}>${data.rate}/hour</Text>
                    </View>

                    <Image
                      style={styles.arrowIcon}
                      source={Images.arrow_right}
                    />                    
                </View>                
            </TouchableOpacity>
        );
    }
}

export default JobCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: 'white',
    },

    image: {
        width: 80,
        height: 75,
        borderRadius: 10,
        marginRight: 14,
        backgroundColor: Colors.placeholderColor
    },

    contentView: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingRight: 10,
    },

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        lineHeight: 18,
    },

    addressText: {
        fontFamily: Fonts.regular,
        fontSize: 13,
    },

    priceText: {
        fontFamily: Fonts.regular,
        fontSize: 13,
    },

    arrowIcon: {
        width: 10,
        height: 20,
    }
});