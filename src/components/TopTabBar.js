import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { RELOAD_GLOBAL_TIME } from '../constants';
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
					style={[styles.tabButton, {width: (100 / titles.length - 3) + "%"}, currentPage == i ? styles.selectButton : null]} 
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
		paddingTop: 7,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 48,
		zIndex: 2,
	},

	tabButton: {
		width: '50%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',		
	},

	selectButton: {
		marginHorizontal: 10,
		backgroundColor: 'white',	
		borderRadius: 25,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 20,
		elevation: 5,
	},

	buttonText: {
		textAlign: 'center',
		fontFamily: Fonts.light,
		color: 'rgba(0, 0, 0, 0.7)',
		fontSize: 17,
	},

	buttonSelectText: {
		fontFamily: Fonts.regular,
		textAlign: 'center',
		fontSize: 17,
		color: 'black',	
	},
});