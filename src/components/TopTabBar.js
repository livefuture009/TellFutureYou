import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Colors from "../theme/Colors";
import Fonts from "../theme/Fonts";

export default class TopTabBar extends React.Component {
	render() {
		const { titles } = this.props;
		return (
			<View style={[this.props.style, styles.container]}>
				{
					titles.map((title, i) =>
    		    	<TouchableOpacity 
					style={[styles.tabButton, {width: (100 / titles.length) + "%"}, this.props.currentPage == i ? styles.selectButton : null]} 
    		    		onPress={() => this.props.onSelectPage(i)} 
    		    		key={i} >
						<Text style={this.props.currentPage == i ? styles.buttonSelectText : styles.buttonText}>{title}</Text>
					</TouchableOpacity>	  
    				)
				}
	    	</View>
	    );
  	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
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
		color: '#b1b1b1',
		fontSize: 17,
	},

	buttonSelectText: {
		textAlign: 'center',
		fontFamily: Fonts.bold,
		fontSize: 17,
		color: Colors.appColor,		
	},
});