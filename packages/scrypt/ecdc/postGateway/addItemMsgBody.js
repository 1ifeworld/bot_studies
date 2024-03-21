"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAddItemMsgBody = exports.encodeAddItemMsgBody = void 0;
var viem_1 = require("viem");
var abi_1 = require("../../abi");
//////////////////////////////////////////////////
// ENCODING
//////////////////////////////////////////////////
function encodeAddItemMsgBody(_a) {
    var itemCid = _a.itemCid, channelCid = _a.channelCid;
    try {
        var msgBody = (0, viem_1.encodeAbiParameters)(abi_1.postGatewayABI[3].outputs, [
            { itemCid: itemCid, channelCid: channelCid },
        ]);
        return {
            msgBody: msgBody,
        };
    }
    catch (error) {
        console.error('Failed to encode add item Message body', error);
        return null;
    }
}
exports.encodeAddItemMsgBody = encodeAddItemMsgBody;
//////////////////////////////////////////////////
// DECODING
//////////////////////////////////////////////////
function decodeAddItemMsgBody(_a) {
    var msgBody = _a.msgBody;
    try {
        var _b = (0, viem_1.decodeAbiParameters)(abi_1.postGatewayABI[3].outputs, msgBody)[0], itemCid = _b.itemCid, channelCid = _b.channelCid;
        return {
            itemCid: itemCid,
            channelCid: channelCid,
        };
    }
    catch (error) {
        console.error('Failed to decode add item Message body', error);
        return null;
    }
}
exports.decodeAddItemMsgBody = decodeAddItemMsgBody;
