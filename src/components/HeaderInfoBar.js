import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../theme/Colors';
import Images from '../theme/Images';
import Fonts from '../theme/Fonts';
import FastImage from 'react-native-fast-image'

export default class HeaderInfoBar extends React.Component {
  render() {
	const { 
		title, 
		rightButton,
		onRight, 
	} = this.props;

    return (
	    <View style={styles.container}>
	    	<Text style={styles.titleText}>{title}</Text>
	    	<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				{
					rightButton == "logout"
					? <TouchableOpacity onPress={() => onRight()}>
						<Text style={styles.buttonText}>Logout</Text>
					  </TouchableOpacity>
					: null
				}
	    	</View>
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 20,
		paddingBottom: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	titleText: {
		textAlign: 'left',
		fontFamily: Fonts.bold,
		fontSize: 28,
		color: 'black',
	},

	buttonText: {
		textAlign: 'right',
		fontFamily: Fonts.regular,
		fontSize: 16,
		color: 'rgba(0, 0 ,0, 0.7)',
	},
});