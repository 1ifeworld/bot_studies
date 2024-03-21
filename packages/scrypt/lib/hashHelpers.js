"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove0xPrefix = void 0;
function remove0xPrefix(_a) {
    var bytes32Hash = _a.bytes32Hash;
    return bytes32Hash.slice(2);
}
exports.remove0xPrefix = remove0xPrefix;
