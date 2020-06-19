import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Moment from 'moment';
import Colors from '../../theme/Colors';
import { JOB_STATUS, DATE_FORMAT } from '../../constants.js'
import Images from '../../theme/Images';
import Fonts from '../../theme/Fonts';
import FastImage from 'react-native-fast-image'

class OrderCell extends Component {
    constructor(props) {
        super(props)
        this.state = {
          
        }
    }

    getStatus(job) {
        if (job.offer && job.offer.user) {
          return JOB_STATUS.OFFER_SENT;
        }
        return job.status;
    }

    render() {
        const { data, userType } = this.props;
        var date = data.createdAt;
        var proposalCount = data.proposals ? data.proposals.length : 0;  
        var datePrefix = "Date Posted: ";
        const status = this.getStatus(data);
        if (status === JOB_STATUS.OFFER_SENT) {
            date = data.offer.createdAt;
        } else if (status === JOB_STATUS.PROGRESSING) {
            datePrefix = "Started On: ";
            date = data.hire.createdAt;

        } else if (status === JOB_STATUS.COMPLETED) {
            datePrefix = "Completed On: ";
            date = data.completedAt;
        }

        return (
            <View style={[this.props.style, styles.container]}>
                <TouchableOpacity style={styles.mainView} onPress={() => this.props.onChoose(data)}>
                    {
                        data.photos && data.photos.length > 0 
                        ? <FastImage
                            style={styles.image}
                            source={{uri: data.photos[0]}}
                        />
                          
                        : null
                    }                

                    <View style={styles.contentView}>
                        <View style={{width: '95%'}}>
                            <Text style={styles.titleText} numberOfLines={2} ellipsizeMode='tail'>{data.title}</Text>
                            <View style={styles.oneRow}>
                                <Text style={styles.labelText}>{datePrefix}</Text>
                                <Text style={styles.addressText}>{Moment(date).format(DATE_FORMAT)}</Text>
                            </View>
                            
                            <View style={styles.oneRow}>
                                <Text style={styles.labelText}>Status: </Text>
                                {
                                    status == JOB_STATUS.NEW
                                    ? <Text style={[styles.statusText, styles.newText]}>{userType == "customer" ? "New" : "Get Offer" }</Text>
                                    : null
                                }

                                {
                                    status == JOB_STATUS.OFFER_SENT
                                    ? <Text style={[styles.statusText, styles.offerText]}>{userType == "customer" ? "Offer Sent" : "Get Offer" }</Text>
                                    : null
                                }

                                {
                                    status == JOB_STATUS.PROGRESSING
                                    ? <Text style={[styles.statusText, styles.progressText]}>In Progress</Text>
                                    : null
                                }

                                {
                                    status == JOB_STATUS.COMPLETED
                                    ? <Text style={[styles.statusText, styles.completedText]}>Completed</Text>
                                    : null
                                }

                                {
                                    status == JOB_STATUS.CANCELLED
                                    ? <Text style={[styles.statusText, styles.cancelText]}>Cancelled</Text>
                                    : null
                                }                                
                            </View>
                            {
                                (status == JOB_STATUS.NEW && proposalCount > 0) && 
                                <View style={styles.oneRow}>
                                    <Text style={styles.labelText}>Applicants: </Text>
                                    <Text style={styles.valueText}>{proposalCount}</Text>
                                </View>
                            }
                        </View>

                        <Image
                          style={styles.arrowIcon}
                          source={Images.arrow_right}
                        />                    
                    </View>    
                </TouchableOpacity>     
            </View>
        );
    }
}

export default OrderCell;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 8,
        marginBottom: 10,
    },

    mainView: {
        padding: 8,        
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',  
        borderRadius: 10,
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
        borderRadius: 10,
        width: 80,
        height: 75,
        resizeMode: 'cover',
        marginRight: 14,
        backgroundColor: Colors.placeholderColor,
    },

    contentView: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingRight: 10,
    },

    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 16,
    },

    oneRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    labelText: {
        fontFamily: Fonts.bold,
    },

    valueText: {
        fontFamily: Fonts.regular,
    },

    addressText: {
        fontFamily: Fonts.regular,
    },

    arrowIcon: {
        width: 10,
        height: 20,
    },

    statusText: {
        fontFamily: Fonts.regular,
        textTransform: 'uppercase',
    },

    newText: {
        color: Colors.newJobTextColor,
    },

    offerText: {
        color: Colors.offerSentTextColor,
    },

    appliedText: {
        color: Colors.appliedJobTextColor,
    },

    progressText: {
        color: Colors.workingJobTextColor,
    },

    completedText: {
        color: Colors.completedJobTextColor,
    },

    cancelText: {
        color: Colors.cancelTextColor,
    },
});