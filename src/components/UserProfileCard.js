import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Avatar from './Avatar'
import RoundButton from './RoundButton'
import TopTabBar from './TopTabBar'
import Rate from './Rate'
import ReviewCell from './ReviewCell'
import SubServicesBox from './SubServicesBox'
import TextView from './TextView'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { JOB_STATUS } from '../constants'
import Fonts from '../theme/Fonts';
import Colors from '../theme/Colors';
import Images from '../theme/Images';
import Styles from '../theme/Styles';

class UserProfileCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
          currentPage: 0,
          rate: 0,
          reviewText: '',
          errorMessage: null,
        }
    }

    onSelectPage(index) {
        this.setState({currentPage: index});
    }

    getReview(jobHistory) {
        var avgRate = 0; 
        var jobCount = 0;
        if (jobHistory && jobHistory.length > 0) {
            jobHistory.forEach(job => {
                if (job.review) {
                    avgRate += job.review.score;
                    jobCount ++;
                }                
            });
            avgRate = Math.round( avgRate / jobCount );
            return avgRate;      
        }
        return 0;
    }

    getServicesForProvider(provider) {
        var list = [];
        const { services } = this.props;
    
        if (provider && provider.services && provider.services.length > 0) {
          provider.services.forEach(item => {
            services.forEach(s => {
              if (item == s._id) {
                list.push(s.name);
                return;
              }
            });
          });
    
        }    
        list.sort(function(a, b){
            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
        })
        return list;
    }

    checkWriteReview(userType, status) {
        if (userType === "customer" && (status === JOB_STATUS.COMPLETED || status === JOB_STATUS.CANCELLED)) {
            return true;    
        }
        return false;
    }

    onChangeRate(rate) {
        this.setState({ rate: rate, errorMessage: null });
    }

    writeReview() {
        const { rate, reviewText } = this.state;
        if (rate <= 0) {
            this.setState({errorMessage: "Please select a rating."});
            return;
        }
    

        if (reviewText === null || reviewText.trim().length === 0) {
            this.setState({errorMessage: "Please write a review."});
            return;
        }

        this.props.onWriteReview(rate, reviewText.trim());
    }

    renderWriteReview() {
        const { errorMessage } = this.state;
        const { job } = this.props;
        var rate = this.state.rate;
        var text = this.state.reviewText;
        var isEditable = true;

        if (job.review) {
            rate = job.review.score;
            text = job.review.text;
            isEditable = false;
        }
        return (
            <View style={styles.writeReviewBox}>
                { isEditable && <Text style={styles.reviewTipText}>Your review will be public. Thank you for always being courteous and respectful.</Text> }
                <Rate size="xlarge" rate={rate} touchable={isEditable} style={{marginBottom: 20}} onChangeRate={(rate) => this.onChangeRate(rate)}/>
                {
                    isEditable
                    ? <View style={{ width: '100%', paddingLeft: 25, paddingRight: 25, marginBottom: 20 }}>
                            <TextView 
                                value={text} 
                                isEditable={isEditable}
                                onChangeText={(text) => this.setState({reviewText: text, errorMessage: null})} 
                            />
                        </View>
                    : <Text style={styles.feedbackText}>{text}</Text>
                }
                { errorMessage && <Text style={Styles.errorText}>{errorMessage}</Text>}                
                {
                    isEditable && 
                    <RoundButton 
                        title="Write Review" 
                        theme="blue" 
                        style={styles.blueButton} 
                        onPress={() => this.writeReview()} 
                    />
                }
            </View>
        )
    }

    render() {
        const { currentPage } = this.state;
        const { profile, userType, jobHistory, status, isShowInviteButton, onInvite, onSendMessage } = this.props;
        const reviewCount = jobHistory ? jobHistory.length : 0;
        const services = this.getServicesForProvider(profile);
        const review = jobHistory ? this.getReview(jobHistory) : 0;
        const isShowWriteReview = this.checkWriteReview(userType, status);
        const name = profile.firstName + " " + profile.lastName;
        const rate = profile.rate ? profile.rate : '';
        const aboutService = (profile && profile.aboutService) ? profile.aboutService : '';

        return (
            <KeyboardAwareScrollView style={this.props.style}>
                <View style={styles.container}>
                    <Avatar 
                        avatar={profile.avatar} 
                        style={{marginTop: 20}}
                    />
                    <Text style={styles.nameText}>{name}</Text>
                    {
                        !isShowWriteReview && 
                        <Rate rate={review} size="large" />
                    }
                    <Text style={styles.subText}>{rate}</Text>       
                    <RoundButton 
                        title="SEND MESSAGE" 
                        theme="blue" 
                        style={styles.chatButton} 
                        onPress={() => onSendMessage(profile)} 
                    />              
                    {
                        isShowWriteReview
                        ? this.renderWriteReview()
                        : <View style={styles.contentView}>
                            <TopTabBar 
                                titles={["ABOUT", "REVIEWS"]} 
                                currentPage={this.state.currentPage} 
                                onSelectPage={(index) => this.onSelectPage(index)} 
                                style={{backgroundColor: 'white'}}
                            />

                            {/* About Page */}
                            {
                                currentPage == 0 && 
                                <View style={styles.slideView}>
                                    <View style={styles.rowView}>
                                        <Image source={Images.ico_mail} style={styles.icoImage} />
                                        <Text style={styles.locationText}>{profile.email}</Text>
                                     </View>     
                                    
                                     <View style={styles.rowView}>
                                         <Image source={Images.ico_phone} style={styles.icoImage} />
                                         <Text style={styles.locationText}>{profile.phone}</Text>
                                     </View>
                                    
                                     <View style={styles.rowView}>
                                         <Image source={Images.ico_address} style={styles.icoImage} />
                                         <Text style={styles.locationText}>{profile.location}</Text>                
                                     </View>

                                     <View style={styles.rowView}>
                                         <Image source={Images.timer_icon} style={styles.icoImage} />
                                         <Text style={styles.locationText}>{profile.availabilityFrom} - {profile.availabilityTo}</Text>                
                                     </View>
                                    
                                    {
                                         services && services.length > 0 
                                         ? <SubServicesBox services={services} />
                                         : null
                                    }
                                    {
                                        aboutService && aboutService.length > 0
                                        ? <View>
                                            <Text style={styles.sectionTitle}>About Service:</Text>
                                            <Text style={styles.aboutText}>{aboutService}</Text>
                                        </View>
                                        : null 
                                    }
                                </View>
                            }

                            {/* Review Page */}
                            {
                                currentPage == 1 && 
                                <View style={{flex: 1}}>
                                    <View style={styles.reviewInfo}>
                                        <Text style={styles.reviewInfoText}>{reviewCount} Reviews</Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        {/* <Image
                                            style={styles.starImage}
                                            source={Images.star_selected}
                                        />
                                        <Text style={styles.reviewValueText}>{review}</Text>
                                        <Text style={styles.reviewTotalText}>/5</Text> */}
                                        </View>
                                    </View>
                                    {
                                        jobHistory.map((job, index) => {
                                            return <ReviewCell job={job} key={index} />
                                        })
                                    }
                                </View>
                            }

                            {
                                isShowInviteButton && 
                                <View style={styles.centerView}>
                                    <RoundButton 
                                        title="Invite" 
                                        theme="blue" 
                                        style={styles.blueButton} 
                                        onPress={onInvite} 
                                    />
                                </View>
                            }
                        </View>
                    }
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

export default UserProfileCard;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', 
        backgroundColor: 'white',
    },

    nameText: {
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 26,
        marginTop: 7,
        color: Colors.textColor
    },

    icoImage: {
        width: 22,
        height: 22,
        marginRight: 10,
        marginTop: 3,
    },

    subText: {
        fontFamily: 'OpenSans',
        fontSize: 17,
        marginTop: 3,
        marginBottom: 15,
        color: Colors.subTextColor
    },

    contentView: {
        backgroundColor: 'white',
        width: '100%',
    },

    chatButton: {
        marginBottom: 25,
        width: '50%'
    },

    slideView: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 30,
    },

    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 7,
    },

    rowTextView: {
        marginTop: 10,
        marginBottom: 10,
    },

    locationText: {
        fontFamily: 'OpenSans',
        fontSize: 16,
        marginTop: 3,
        color: Colors.subTextColor
    },

    labelText: {
        fontFamily: 'OpenSans',
        fontSize: 16,
        marginTop: 3,
        color: Colors.subTextColor
    },

    contentText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        marginTop: 10,
        color: Colors.subTextColor,
        borderWidth: 1,
        borderColor: 'lightgray',
        padding: 10,
        borderRadius: 10,
        minHeight: 150,
    },

    reviewInfo: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    
    reviewInfoText: {
        fontFamily: 'OpenSans',
        fontSize: 16,
        textTransform: 'uppercase',
    },

    reviewTotalText: {
        fontFamily: 'OpenSans',
        fontSize: 16,
        marginTop: 7,
    },

    reviewValueText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 28,
        color: Colors.subText,
        marginLeft: 5,
    },

    centerView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    starImage: {
        width: 30,
        height: 30,
    },
    
    blueButton: {
        marginTop: 15,
        width: '90%',
        marginBottom: 30,
    },

    writeReviewBox: {
        width: '100%', 
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor,
        paddingVertical: 20,
    },  

    reviewTipText: {
        fontFamily: 'OpenSans',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
        color: 'gray',
    },

    feedbackText: {
        fontFamily: Fonts.italic,
        fontSize: 20,
        paddingHorizontal: 20,
        textAlign: 'center',
        color: Colors.textColor,
    },

    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: 16,
    },

    aboutText: {
        fontFamily: Fonts.light,
        marginTop: 10,
    }
});