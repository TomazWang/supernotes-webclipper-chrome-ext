// src/common/messageTypes.ts

import { CREATE_CARD_RESPONSE, TOGGLE_POPUP } from './actions';

export type UnknownMessage = {
    action: string;
    [key: string]: unknown;
};

export type TogglePopupMessage = {
    action: typeof TOGGLE_POPUP;
};

export type CreateCardResponseMessage = {
    action: typeof CREATE_CARD_RESPONSE;
    result: {
        success: boolean;
        message: string;
    };
};

export type Message = TogglePopupMessage | CreateCardResponseMessage | UnknownMessage;

export type Response = {
    success: string;
} | void;
