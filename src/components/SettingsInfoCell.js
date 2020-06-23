import React, { Component } from 'react';
import { Text, View, StyleSheet, Switch, Image, TouchableOpacity } from 'react-native';
import Colors from '../theme/Colors';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

class SettingsInfoCell extends Component {
    render() {
        const { icon, label, value, onPress } = this.props;
        return (
            <View style={[this.props.style]}>
                {
                    this.props.type == "submenu" 
                    ? <TouchableOpacity style={styles.container} onPress={() => onPress()}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={icon} style={styles.iconImage} />
                            <Text style={styles.labelText}>{label}</Text>
                        </View>
                        <Image
                           style={styles.arrowIcon}
                           source={Images.arrow_right}
                        />   
                      </TouchableOpacity>

                    : null
                }

                {
                    this.props.type == "switch"
                    ? <View style={styles.container}>
                        <Text style={styles.labelText}>{label}</Text>
                        <Switch trackColor={{true: Colors.appColor, false: null}} value={value} onValueChange={(value) => this.props.onChange(value)}/>
                      </View>
                    : null
                }

                {
                    this.props.type == "red"
                    ? <TouchableOpacity style={styles.container} onPress={() => onPress()}>
                        <Text style={styles.redText}>{label}</Text>
                      </TouchableOpacity>
                    : null
                }

            </View>
        );
    }
}

export default SettingsInfoCell;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 17,
        paddingBottom: 17,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15, 
        borderRadius: 35,
    },

    labelText: {
        fontFamily: Fonts.bold,
        color: 'black',
        fontSize: 18
    },

    redText: {
        textAlign: 'center',
        fontFamily: Fonts.regular,
        color: Colors.redColor,
        width: '100%',
        fontSize: 18
    },

    arrowIcon: {
        width: 10,
        height: 20,
        resizeMode: 'contain',
    },

    iconImage: {
        width: 40,
        height: 40,
        marginRight: 5,
        resizeMode: 'contain',
    },
});