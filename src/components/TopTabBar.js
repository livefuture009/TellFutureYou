import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Colors from "../theme/Colors";
import Fonts from "../theme/Fonts";

export default class TopTabBar extends React.Component {
	render() {
		const { titles, currentPage, onSelectPage } = this.props;
		return (
			<View style={[this.props.style, styles.container]}>
				{
					titles.map((title, i) =>
    		    	<TouchableOpacity 
					style={[styles.tabButton, {width: (100 / titles.length) + "%"}, currentPage == i ? styles.selectButton : null]} 
    		    		onPress={() => onSelectPage(i)} 
    		    		key={i} >
						<Text style={currentPage == i ? styles.buttonSelectText : styles.buttonText}>{title}</Text>
					</TouchableOpacity>	  
    				)
				}
	    	</View>
	    );
  	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 48,
		zIndex: 2,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.05)'
	},

	tabButton: {
		width: '50%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',		
	},

	selectButton: {
		borderBottomWidth: 3,
		borderBottomColor: Colors.appColor,
		marginBottom: -2,
	},

	buttonText: {
		textAlign: 'center',
		fontFamily: Fonts.regular,
		color: 'black',
		fontSize: 17,
	},

	buttonSelectText: {
		textAlign: 'center',
		fontFamily: Fonts.bold,
		fontSize: 17,
		color: Colors.appColor,		
	},
});