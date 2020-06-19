import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Rate from '../Rate'
import Colors from '../../theme/Colors'
import { JOB_STATUS } from '../../constants.js'
import Images from '../../theme/Images';
import FastImage from 'react-native-fast-image'

const screenWidth = Math.round(Dimensions.get('window').width);

class JobProviderCell extends Component {
    constructor(props) {
        super(props)
        this.state = {
          
        }
    }

    selectProvider() {
        const { job_id, data, reviews, job_status } = this.props;
        if (job_status == JOB_STATUS.COMPLETED || job_status == JOB_STATUS.CANCELED) {
            let score = this.getReview(reviews, job_status);
            if (score == -1) {
                this.props.onMakeFeedback(data, job_id);
            } else {
                this.props.onSelectProvider(data);    
            }
        } else {
            this.props.onSelectProvider(data);
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

    getStatus(provider, job_status) {
        // Check hired.
        if (job_status && job_status.length > 0) {
            return job_status;
        } 

        // Check Verified
        if (provider.isPublished) {
            return "Verified";
        }

        return null;
    }

    render() {
        const { data, job_status, reviews} = this.props;
        const services = this.getServiceNames(this.props.services, this.props.data.services)
        const status = this.getStatus(data, data.jobStatus);

        return (
            <TouchableOpacity style={[this.props.style, styles.container]} onPress={() => this.selectProvider()}>
                <View style={styles.contentView}>
                    <FastImage
                      style={styles.image}
                      source={this.props.data.avatar ? {uri: this.props.data.avatar} : Images.account_icon}
                    />
                    <View style={{width: screenWidth - 207, paddingRight: 5}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.titleText}>{data.firstName} {data.lastName}</Text>
                            {status && <Text style={styles.ticket}>{status}</Text>}
                        </View>
                        { 
                            services ? <Text style={styles.addressText}>{services}</Text> : null
                        }
                        <Text style={styles.rateText}>{data.rate}</Text>
                    </View>

                    {
                        this.props.job_status < JOB_STATUS.COMPLETED
                        ? <View style={{marginTop: 17}}>
                            {
                                this.props.data.jobStatus === "offer sent" || this.props.data.jobStatus === "hired"
                                ? <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => this.props.onCancel(this.props.data)}>
                                    <Text style={styles.actionText}>CANCEL</Text>
                                  </TouchableOpacity>
                                : <TouchableOpacity style={[styles.actionButton, styles.hireButton]} onPress={() => this.props.onHire(this.props.data)}>
                                    <Text style={styles.actionText}>HIRE</Text>
                                  </TouchableOpacity>
                            }
                          </View>
                        : null
                    }                    
                </View>                
            </TouchableOpacity>
        );
    }
}

export default JobProviderCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 14,
        backgroundColor: Colors.placeholderColor,
    },

    contentView: {
        flex: 1,
        flexDirection: 'row', 
        paddingRight: 10,
    },

    titleText: {
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 16,
    },

    addressText: {
        fontFamily: 'OpenSans',
        marginTop: 2,
        fontSize: 12,
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
        fontSize: 7,
        marginLeft: 7,
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 2,
        paddingBottom: 2,
    },

    actionButton: {
        width: 85,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },

    hireButton: {
        backgroundColor: Colors.appColor,
    },

    cancelButton: {
        backgroundColor: Colors.redColor,
    },

    actionText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'OpenSans',
        fontSize: 13,
    },

    rateText: {
        fontFamily: 'OpenSans',
        marginTop: 1,
    }
});