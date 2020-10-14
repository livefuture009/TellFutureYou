import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Platform, Dimensions } from 'react-native';
import { SUBSCRIPTION_STANDARD, SUBSCRIPTION_PREMIUM } from '../../constants'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'

const win = Dimensions.get('window');

export default class SubscriptionCell extends React.Component {
  	render() {
        const { data, index, selectedIndex, onSelect } = this.props;
        const productId = data.productId;
        var title = "Standard";
        var subTitle = "Allow add up to 10 Friends";

        if (productId == SUBSCRIPTION_PREMIUM) {
            title = "Premium";
            subTitle = "Allow add up to 20 Friends";
        }
        const price = data.localizedPrice;
    	return (
            <TouchableOpacity onPress={() => onSelect(index)}>
                <View style={[styles.container, selectedIndex == index ? {borderColor: Colors.appColor, borderWidth: 2} : {}]}>
                    <View style={styles.leftView}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.titleText}>{title}</Text>
                            {
                                (productId == SUBSCRIPTION_PREMIUM)
                                ? <Text style={styles.recommendedText}>Recommended</Text>
                                : null
                            }
                        </View>
                        <Text style={styles.subTitleText}>{subTitle}</Text>
                    </View>
                    <View style={styles.rightView}>
                        <Text style={styles.priceText}>{price}</Text>
                        <Text style={styles.durationText}>Monthly</Text>
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
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.borderColor,
    },

    leftView: {
        width: win.width - 190,
    },

    rightView: {
        width: 100, 
        alignItems: 'flex-end',
    },

    titleText: {
        fontFamily: Fonts.regular,
        fontSize: 20,
        textTransform: 'uppercase',
    },

    recommendedText: {
        fontFamily: Fonts.regular,
        fontSize: 10,
        backgroundColor: Colors.appColor2,
        color: 'white',
        marginLeft: 5,
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 10,
        overflow: 'hidden',
        textTransform: 'uppercase',
    },

    subTitleText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: 'gray',
        marginTop: 3,
    },

    priceText: {
        fontFamily: Fonts.bold,
        fontSize: 20,
        color: Colors.textColor,
    },

    durationText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.textColor,
        textTransform: 'uppercase',
        color: 'gray',
    }
});