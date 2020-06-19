import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Colors from '../theme/Colors'
import Images from '../theme/Images'

class StepIndicator extends Component {
    render() {
        var items = [];
        for (var i = 0; i < this.props.steps; i++) {
            items.push(i + 1);
        }
        return (
            <View style={[this.props.style, styles.container]}>
                <View style={{flexDirection: 'row'}}>
                    <View style={styles.line}/>
                    {
                        items.map((item, index) => {
                            return (
                                <View 
                                    key={index}
                                    style={[
                                        styles.stepBox, 
                                        item <= this.props.current ? styles.active : styles.normal,
                                        index === 0 ? styles.firstBox : {},
                                        index === this.props.steps - 1 ? styles.lastBox : {},
                                    ]}
                                >
                                    {
                                        item < this.props.current 
                                        ? <Image source={Images.tick_white} style={styles.tickImage} />
                                        : <Text style={[styles.stepText, (index + 1) > this.props.current ? styles.noActiveText : {}]}>{item}</Text>
                                        
                                    }
                                </View>                        
                            )
                        })
                    }
                </View>
                
            </View>
        );
    }
}

export default StepIndicator;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
    },

    tickImage: {
        width: 20,
        height: 20,
    },

    stepBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
    },

    firstBox: {
        marginLeft: 0,
    },

    lastBox: {
        marginRight: 0,
    },

    stepText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },

    noActiveText: {
        opacity: 0.5,
    },

    active: {
        backgroundColor: Colors.appColor,
    },

    normal: {
        backgroundColor: '#1e1e5d',
    },

    line: {
        position: 'absolute',
        width: '100%',
        height: 2,
        backgroundColor: '#1e1e5d',
        top: 20,
    },
});