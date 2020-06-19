import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import moment from 'moment';
import Fonts from '../../theme/Fonts'
import { kFormatter } from '../../functions'
 
class EarningCell extends Component {

    render() {
        const { data } = this.props;
        const createAt = data.createdAt;
        const provider = data.provider;
        const customer = data.customer;
        const job = data.job;
        const total = kFormatter(data.total);

        return (
            <View style={styles.container}>
                <View style={{width: '80%'}}>
                    <Text style={styles.titleText}>{moment(createAt).format('DD MMM YYYY, hh:mm A')}</Text>
                    {
                        this.props.userType == "customer"
                        ? <Text style={styles.descriptionText}>Provider: <Text style={{fontWeight: 'bold'}}>{provider.firstName} {provider.lastName}</Text></Text>
                        : <Text style={styles.descriptionText}>Customer: <Text style={{fontWeight: 'bold'}}>{customer.firstName} {customer.lastName}</Text></Text>
                    }
                    
                    <Text style={styles.descriptionText} numberOfLines={2} ellipsizeMode='tail'>Job: <Text style={{fontWeight: 'bold'}}>{job.title}</Text></Text>                        
                </View>

                <View>
                    <Text style={styles.priceText}>${total}</Text>
                </View>
            </View>
        );
    }
}

export default EarningCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        backgroundColor: 'white',
    },    

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        marginBottom: 5,
    },

    descriptionText: {
        fontFamily: Fonts.regular,
        color: '#9e9e9e',
    },

    priceText: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        textAlign: 'right',
    },

    statusText: {
        fontFamily: Fonts.regular,
        textAlign: 'right',
        marginTop: 5,
        color: '#11ce4f'
    },

});