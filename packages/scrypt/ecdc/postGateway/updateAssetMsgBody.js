"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeUpdateAssetMsgBody = exports.encodeUpdateAssetRoleAccessMsgBody = void 0;
var viem_1 = require("viem");
//////////////////////////////////////////////////
// ENCODING
//////////////////////////////////////////////////
function encodeUpdateAssetRoleAccessMsgBody(_a) {
    var assetCid = _a.assetCid, targetRids = _a.targetRids, roles = _a.roles;
    try {
        var msgBody = (0, viem_1.encodeAbiParameters)([
            {
                components: [
                    // assetCid
                    { internalType: 'string', name: 'assetCid', type: 'string' },
                    // channel struct
                    {
                        components: [
                            {
                                internalType: 'enum IPostGateway.ChannelDataTypes',
                                name: 'dataType',
                                type: 'uint8',
                            },
                            { internalType: 'bytes', name: 'contents', type: 'bytes' },
                        ],
                        internalType: 'struct IPostGateway.ChannelData',
                        name: 'data',
                        type: 'tuple',
                    },
                    {
                        components: [
                            {
                                internalType: 'enum IPostGateway.ChannelAccessTypes',
                                name: 'accessType',
                                type: 'uint8',
                            },
                            { internalType: 'bytes', name: 'contents', type: 'bytes' },
                        ],
                        internalType: 'struct IPostGateway.ChannelAccess',
                        name: 'access',
                        type: 'tuple',
                    },
                ],
                internalType: 'struct IPostGateway.Channel',
                name: 'channel',
                type: 'tuple',
            },
        ], [
            {
                assetCid: assetCid,
                data: {
                    dataType: 0,
                    contents: viem_1.zeroHash,
                },
                access: {
                    accessType: 1, // ROLEBASED
                    contents: (0, viem_1.encodeAbiParameters)([
                        { name: 'targetRids', type: 'uint256[]' },
                        { name: 'roles', type: 'uint256[]' },
                    ], [targetRids, roles]),
                },
            },
        ]);
        return {
            msgBody: msgBody,
        };
    }
    catch (error) {
        console.error('Failed to encode update asset Message body', error);
        return null;
    }
}
exports.encodeUpdateAssetRoleAccessMsgBody = encodeUpdateAssetRoleAccessMsgBody;
//////////////////////////////////////////////////
// DECODING
//////////////////////////////////////////////////
function decodeUpdateAssetMsgBody(_a) {
    var msgBody = _a.msgBody;
    try {
        var _b = (0, viem_1.decodeAbiParameters)([
            {
                components: [
                    // assetCid
                    { internalType: 'string', name: 'assetCid', type: 'string' },
                    // channel struct
                    {
                        components: [
                            {
                                internalType: 'enum IPostGateway.ChannelDataTypes',
                                name: 'dataType',
                                type: 'uint8',
                            },
                            { internalType: 'bytes', name: 'contents', type: 'bytes' },
                        ],
                        internalType: 'struct IPostGateway.ChannelData',
                        name: 'data',
                        type: 'tuple',
                    },
                    {
                        components: [
                            {
                                internalType: 'enum IPostGateway.ChannelAccessTypes',
                                name: 'accessType',
                                type: 'uint8',
                            },
                            { internalType: 'bytes', name: 'contents', type: 'bytes' },
                        ],
                        internalType: 'struct IPostGateway.ChannelAccess',
                        name: 'access',
                        type: 'tuple',
                    },
                ],
                internalType: 'struct IPostGateway.Channel',
                name: 'channel',
                type: 'tuple',
            },
        ], msgBody)[0], assetCid = _b.assetCid, data = _b.data, access = _b.access;
        return {
            assetCid: assetCid,
            data: data,
            access: access,
        };
    }
    catch (error) {
        console.error('Failed to decode update asset Message body', error);
        return null;
    }
}
exports.decodeUpdateAssetMsgBody = decodeUpdateAssetMsgBody;
