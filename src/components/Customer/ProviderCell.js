import React, { Component } from 'react';
import PropTypes from "prop-types"
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import Rate from '../Rate'
import Colors from '../../theme/Colors'
import Images from '../../theme/Images';
import FastImage from 'react-native-fast-image'

class ProviderCell extends Component {
    static propTypes = {
        data: PropTypes.object,
    }

    constructor(props) {
        super(props)
        this.state = {
          
        }
    }

    getServiceNames(services, ids) {
        var names = [];

        if (services && services.length > 0) {
            for (var i = 0; i < services.length; i++) {
                if (ids && ids.length > 0) {
                    for (var j = 0; j < ids.length; j++) {
                        if (services[i]._id === ids[j]) {
                            names.push(services[i].name);
                            break;
                        }
                    }
                }                
            }
        }         
        return names.join(', ');
    }


    getStatus(provider, job) {
        // // Check hired.
        // if (job.providers && job.providers.length > 0) {
        //     for (var i = 0; i < job.providers.length; i++) {
        //         if (job.providers[i]._id == provider._id) {
        //             return "Invited";
        //         }
        //     }
        // } 

        // Check Verified
        if (provider.isPublished) {
            return "Verified";
        }

        return null;
    }

    render() {
        const { data, job, isInvited } = this.props;
        const services = this.getServiceNames(this.props.services, data.services)
        const status = isInvited ? "Invited" : this.getStatus(data, job);

        return (
            <TouchableOpacity style={[this.props.style, styles.container]} onPress={() => this.props.onChoose(data)}>
                <FastImage
                  style={styles.image}
                  source={data.avatar ? {uri: data.avatar} : Images.account_icon}
                />

                <View style={styles.contentView}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.titleText}>{data.firstName} {data.lastName}</Text>
                            {status && <Text style={[styles.ticket, status=== "Invited" ? {color: 'green', borderColor: 'green'} : {}]}>{status}</Text>}
                            
                        </View>
                        { 
                            services ? <Text style={styles.addressText}>{services}</Text> : null
                        }
                        <Text style={styles.rateText}>{data.rate}</Text>
                    </View>
                    {
                        status !== "Invited" &&
                        <Image
                        style={styles.arrowIcon}
                        source={Images.arrow_right}
                        />                    
                    }                    
                </View>                
            </TouchableOpacity>
        );
    }
}

export default ProviderCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 8,
        borderWidth: 2,
        borderColor: '#e6e6e6',
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },

    image: {
        width: 80,
        height: 75,
        borderRadius: 10,
        marginRight: 14,
    },

    contentView: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingRight: 10,
    },

    titleText: {
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 18,
    },

    addressText: {
        fontFamily: 'OpenSans',
        marginTop: 2,
        color: Colors.subTextColor,
    },

    noGiveFeedbackText: {
        fontFamily: 'OpenSans',
        color: 'lightgray',
        fontStyle: 'italic',
        fontSize: 12,
    },

    ticket: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.ticketColor,
        color: Colors.ticketColor,
        textTransform: 'uppercase',
        fontFamily: 'OpenSans',
        fontSize: 9,
        marginLeft: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
        paddingBottom: 2,
    },

    rateText: {
        fontFamily: 'OpenSans',
        marginTop: 2,
    },

    arrowIcon: {
        width: 10,
        height: 20,
    }
});