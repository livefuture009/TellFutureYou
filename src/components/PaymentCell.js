import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

class PaymentCell extends Component {
    render() {
        return (
            <View style={[this.props.style]}>
                <TouchableOpacity style={styles.container} onPress={() => this.props.onPress()}>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        {
                            this.props.method == "paypal"
                            ? <Image
                               style={styles.paypalIcon}
                               source={Images.paypal}
                              />   
                            : null
                        }

                        {
                            this.props.method == "bank"
                            ? <Image
                               style={styles.bankIcon}
                               source={Images.small_bank_icon}
                              />   
                            : null
                        }

                        {
                            this.props.method == "card"
                            ? <Image
                               style={styles.bankIcon}
                               source={Images.credit_card}
                              />   
                            : null
                        }
                        
                        <Text style={styles.labelText}>{this.props.label}</Text>
                    </View>
                    <Image
                       style={styles.arrowIcon}
                       source={Images.arrow_right}
                    />   
                </TouchableOpacity>
            </View>
        );
    }
}

export default PaymentCell;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 17,
        paddingBottom: 17,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f3f3f3',        
    },

    labelText: {
        fontFamily: Fonts.regular,
        color: 'black',
        fontSize: 18,
        marginLeft: 14,
    },

    redText: {
        fontFamily: Fonts.regular,
        color: 'red',
        fontSize: 18
    },

    paypalIcon: {
        width: 30,
        height: 35,
    },

    bankIcon: {
        width: 30,
        height: 30,
    },

    arrowIcon: {
        width: 10,
        height: 20,
    }
});