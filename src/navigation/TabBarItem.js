import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Image } from 'react-native';
import Fonts from '../theme/Fonts'

function TabBarItem({unreadMessages, unreadNumber, icon, page}) {
    return (
        <View>
            <Image source={icon} style={{width: 40, height: 40 }} />
            {
                (page === 'ChatList' && unreadMessages > 0) &&
                <Text style={styles.badgeText}>{unreadMessages}</Text>
            }
            {
                (page === 'Notification' && unreadNumber > 0) &&
                <Text style={styles.badgeText}>{unreadNumber}</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    badgeText: {
        fontFamily: Fonts.regular,
        color: 'white',
        backgroundColor: 'red',
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        textAlign: 'center',
        top: 0,
        right: 0,
        overflow: 'hidden',
    }
});

const mapStateToProps = state => ({
    unreadMessages: state.user.unreadMessages,
    unreadNumber: state.notifications.unreadNumber,
});

export default connect(mapStateToProps)(TabBarItem);
