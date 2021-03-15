import React from 'react';
import Modal from 'react-native-modal';
import { StyleSheet, View, TouchableOpacity, Image, Text, FlatList, Dimensions } from 'react-native';
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';
import { QUOTE_LIST } from '../../constants';
import QuoteCell from './QuoteCell'

const win = Dimensions.get('window');

export default class QuoteDialog extends React.Component {
    constructor() {
        super()
        this.state = {
            selectedIndex: -1,
        }
    }

    onApply() {
        const { onSelectQuote } = this.props;
        const { selectedIndex } = this.state;

        if (selectedIndex >= 0) {
            const quote = QUOTE_LIST[selectedIndex];
            onSelectQuote(quote);
        }
    }

    render() {
        const { selectedIndex } = this.state;
        const { isVisible, onClose, onSelect } = this.props;
        return (
        <Modal isVisible={isVisible}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.titleText}>Select Quotes</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Image source={Images.close_icon} style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    <FlatList
                        data={QUOTE_LIST}
                        style={[styles.listView, {height: win.height - 250}]}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={() => (<View style={{height: 10}}/>)}
                        renderItem={({item, index}) => (
                        <QuoteCell 
                            data={item}
                            index={index}
                            isSelected={(index == selectedIndex) ? true: false}
                            onSelect={(index) => this.setState({selectedIndex: index})}
                        />
                        )}
                    />
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => this.onApply()}>
                        <Text style={styles.applyText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    overflow: 'hidden',
  },

  header: {
    backgroundColor: 'white',
    position: 'relative',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 0.5,
  },

  titleText: {
    fontFamily: Fonts.regular,
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 12,
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  closeIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  body: {
  },

  listView: {
      paddingTop: 10,
  },

  footer: {
    borderTopWidth: 0.5,
    borderTopColor: 'lightgray',
    backgroundColor: 'white',
  },

  applyText: {
    fontFamily: Fonts.regular,
    textAlign: 'center',
    fontSize: 17,
    color: 'black',
    paddingVertical: 12,
    textTransform: 'uppercase',
  },

});