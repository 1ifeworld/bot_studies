"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpiration = void 0;
function getExpiration() {
    return BigInt(Math.floor(Date.now() / 1000) + 120); // 2 min buffer
}
exports.getExpiration = getExpiration;
