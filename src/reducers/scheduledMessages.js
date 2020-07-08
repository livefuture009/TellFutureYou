import { createReducer } from 'reduxsauce';
import Types from '../actions/actionTypes';
import { Status } from '../constants';

export const initialState = {
  messages: [],
  errorMessage: '',

  getScheduledMessagesStatus: Status.NONE,
  createScheduledMessageStatus: Status.NONE,
};

//////////////////////////////////////////////////////////////////
////////////////// Get Scheduled Messages. ///////////////////////
//////////////////////////////////////////////////////////////////
const getScheduledMessagesRequest = (state) => ({
  ...state,
  getScheduledMessagesStatus: Status.REQUEST,
});

const getScheduledMessagesSuccess = (state, action) => ({
  ...state,
  messages: action.payload,
  getScheduledMessagesStatus: Status.SUCCESS,
});

const getScheduledMessagesFailure = (state, action) => ({
  ...state,
  errorMessage: action.error,
  getScheduledMessagesStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
////////////////// Create Schedule Message. //////////////////////
//////////////////////////////////////////////////////////////////
const createScheduledMessageRequest = (state) => ({
    ...state,
    createScheduledMessageStatus: Status.REQUEST,
});
  
const createScheduledMessageSuccess = (state, action) => {
    state.createScheduledMessageStatus = Status.SUCCESS;
    const message = action.payload;
    const messages = state.messages;
    messages.push(message);
    state.messages = messages;
    return {
      ...state,
    };
};

const createScheduledMessageFailure = (state, action) => ({
    ...state,
    errorMessage: action.error,
    createScheduledMessageStatus: Status.FAILURE,
});

//////////////////////////////////////////////////////////////////
////////////////////// RESET /////////////////////////////////////
//////////////////////////////////////////////////////////////////
const resetScheduledMessages = (state, action) => {
  state.messages = [];
  return {
    ...state,
  };
};


const actionHandlers = {
  [Types.GET_SCHEDULED_MESSAGES_REQUEST]: getScheduledMessagesRequest,
  [Types.GET_SCHEDULED_MESSAGES_SUCCESS]: getScheduledMessagesSuccess,
  [Types.GET_SCHEDULED_MESSAGES_FAILURE]: getScheduledMessagesFailure,

  [Types.CREATE_SCHEDULED_MESSAGE_REQUEST]: createScheduledMessageRequest,
  [Types.CREATE_SCHEDULED_MESSAGE_SUCCESS]: createScheduledMessageSuccess,
  [Types.CREATE_SCHEDULED_MESSAGE_FAILURE]: createScheduledMessageFailure,

  [Types.RESET_SCHEDULED_MESSAGES]: resetScheduledMessages,
};

export default createReducer(initialState, actionHandlers);
