import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Colors from '../theme/Colors'

export default class BlueBar extends React.Component {
  	render() {
    	return (
	   		<Text style={[this.props.style, styles.textLabel]}>{this.props.title}</Text>
    );
  }
}

const styles = StyleSheet.create({
	textLabel: {
		fontFamily: 'OpenSans',
		fontSize: 13,
		backgroundColor: Colors.appColor,
		color: 'white',
		padding: 10,
		textAlign: 'center',
		zIndex: 2,
		shadowColor: Colors.appColor,
		shadowOffset: {
			width: 0,
			height: 20,
		},
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 5,
	}
});