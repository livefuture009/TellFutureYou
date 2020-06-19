import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';

export default class Label extends React.Component {
  	render() {
    	return (
    		<View style={styles.container}>
    			<Image style={styles.sadIcon} source={Images.sad}/>
    			<Text style={[this.props.style, styles.textLabel]}>{this.props.title}</Text>
    		</View>	   		
    	);
  	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		top: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},

	sadIcon: {
		width: 50,
		height: 50,
		marginBottom: 10,
	},
	textLabel: {
		fontFamily: Fonts.regular,
		fontSize: 18,
	}
});