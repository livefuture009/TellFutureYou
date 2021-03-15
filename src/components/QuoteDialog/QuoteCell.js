import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import Fonts from '../../theme/Fonts'
import Images from '../../theme/Images'

export default class QuoteCell extends React.Component {
  	render() {
        const { data, index, isSelected, onSelect } = this.props;
        const content = data?.content;
        const author = data?.author;

    	return (
            <TouchableOpacity onPress={() => onSelect(index)}>
                <View style={[styles.container, isSelected ? styles.selected: {}]}>
                    <Image source={Images.icon_quote_start} style={styles.quoteIcon} />
                    <Text style={styles.quoteText}>{content}</Text>
                    <Text style={styles.authorText}>{author}</Text>
                    <View style={{alignItems: 'flex-end'}}>
                        <Image source={Images.icon_quote_end} style={styles.quoteIcon}/>
                    </View>                        
                </View>
            </TouchableOpacity>
        );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginBottom: 15,
        marginHorizontal: 15,
        padding: 10,
        borderRadius: 10,
    },

    selected: {
        borderWidth: 2,
        borderColor: '#60b8c3',
    },

    quoteView: {

    },

    quoteText: {
        fontFamily: Fonts.regular,
        fontSize: 17,
        color: 'black',
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: 5,
    },

    quoteIcon: {
        width: 25,
        height: 18,
        resizeMode: 'contain',
    },

    authorText: {
        fontFamily: Fonts.light,
        fontStyle: 'italic',
        color: 'gray',
        textAlign: 'right',
        fontSize: 12,
        marginBottom: 10,
        marginRight: 10,
    },
});