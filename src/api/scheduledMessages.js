import { url } from '../constants';

//////////////////////////////////////////////////////////////////
//////////////////// GET Scheduled Messages. /////////////////////
//////////////////////////////////////////////////////////////////

export const getScheduledMessages = (userId, channelId) => {
    const method = 'POST';
    const request_url = `${url}/scheduled_message/get_list`
    const headers = {
        'Content-Type': 'application/json',
    }
    const body = JSON.stringify({ 
        userId, 
        channelId, 
    });

    return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};

//////////////////////////////////////////////////////////////////
//////////////////// GET Scheduled Messages. /////////////////////
//////////////////////////////////////////////////////////////////

export const createScheduledMessage = (data) => {
    const method = 'POST';
    const request_url = `${url}/scheduled_message/create`
    const headers = {
        'Content-Type': 'application/json',
    }
    console.log("data: ", data);
    const body = JSON.stringify({ 
        message: data.message,
        creator: data.creator, 
        type: data.type,
        scheduledAt: data.scheduledAt,
        channelId: data.channelId, 
        channelURL: data.channelURL,
    });

    return fetch(request_url, { method, body, headers})
    .then((res) => res.json());
};
