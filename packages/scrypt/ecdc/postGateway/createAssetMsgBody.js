"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeCreateAssetMsgBody = exports.encodeCreateAssetMsgBody = void 0;
var viem_1 = require("viem");
var abi_1 = require("../../abi");
//////////////////////////////////////////////////
// ENCODING
//////////////////////////////////////////////////
function encodeCreateAssetMsgBody(_a) {
    var data = _a.data, access = _a.access;
    try {
        var msgBody = (0, viem_1.encodeAbiParameters)(abi_1.postGatewayABI[4].outputs, [
            { data: data, access: access },
        ]);
        return {
            msgBody: msgBody,
        };
    }
    catch (error) {
        console.error('Failed to encode create asset Message body', error);
        return null;
    }
}
exports.encodeCreateAssetMsgBody = encodeCreateAssetMsgBody;
//////////////////////////////////////////////////
// DECODING
//////////////////////////////////////////////////
function decodeCreateAssetMsgBody(_a) {
    var msgBody = _a.msgBody;
    try {
        var _b = (0, viem_1.decodeAbiParameters)(abi_1.postGatewayABI[4].outputs, msgBody)[0], data = _b.data, access = _b.access;
        return {
            data: data,
            access: access,
        };
    }
    catch (error) {
        console.error('Failed to decode create asset Message body', error);
        return null;
    }
}
exports.decodeCreateAssetMsgBody = decodeCreateAssetMsgBody;
