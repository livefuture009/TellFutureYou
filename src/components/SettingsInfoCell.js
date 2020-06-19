import React, { Component } from 'react';
import { Text, View, StyleSheet, Switch, Image, TouchableOpacity } from 'react-native';
import Colors from '../theme/Colors';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

class SettingsInfoCell extends Component {
    render() {
        return (
            <View style={[this.props.style]}>
                {
                    this.props.type == "submenu" 
                    ? <TouchableOpacity style={styles.container} onPress={() => this.props.onPress()}>
                        <Text style={styles.labelText}>{this.props.label}</Text>
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
                        <Text style={styles.labelText}>{this.props.label}</Text>
                        <Switch trackColor={{true: Colors.appColor, false: null}} value={this.props.value} onValueChange={(value) => this.props.onChange(value)}/>
                      </View>
                    : null
                }

                {
                    this.props.type == "red"
                    ? <TouchableOpacity style={styles.container} onPress={() => this.props.onPress()}>
                        <Text style={styles.redText}>{this.props.label}</Text>
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
    }
});