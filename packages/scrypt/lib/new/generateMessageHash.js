"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMessageHash = void 0;
var viem_1 = require("viem");
function generateMessageHash(_a) {
    var rid = _a.rid, timestamp = _a.timestamp, msgType = _a.msgType, msgBody = _a.msgBody;
    return (0, viem_1.hashMessage)((0, viem_1.encodeAbiParameters)([
        {
            name: 'message',
            internalType: 'struct IPostGateway2.Message',
            type: 'tuple',
            components: [
                { name: 'rid', internalType: 'uint256', type: 'uint256' },
                { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
                {
                    name: 'msgType',
                    internalType: 'enum IPostGateway2.MessageTypes',
                    type: 'uint8',
                },
                { name: 'msgBody', internalType: 'bytes', type: 'bytes' },
            ],
        },
    ], [
        {
            rid: rid,
            timestamp: timestamp,
            msgType: msgType,
            msgBody: msgBody,
        },
    ]));
}
exports.generateMessageHash = generateMessageHash;
