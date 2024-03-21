"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelRoleTypes = exports.MessageTypes = exports.ItemAccessTypes = exports.ItemDataTypes = exports.ChannelAccessTypes = exports.ChannelDataTypes = void 0;
var ChannelDataTypes;
(function (ChannelDataTypes) {
    ChannelDataTypes[ChannelDataTypes["NONE"] = 0] = "NONE";
    ChannelDataTypes[ChannelDataTypes["NAME_AND_DESC"] = 1] = "NAME_AND_DESC";
})(ChannelDataTypes || (exports.ChannelDataTypes = ChannelDataTypes = {}));
var ChannelAccessTypes;
(function (ChannelAccessTypes) {
    ChannelAccessTypes[ChannelAccessTypes["NONE"] = 0] = "NONE";
    ChannelAccessTypes[ChannelAccessTypes["ROLES"] = 1] = "ROLES";
})(ChannelAccessTypes || (exports.ChannelAccessTypes = ChannelAccessTypes = {}));
var ItemDataTypes;
(function (ItemDataTypes) {
    ItemDataTypes[ItemDataTypes["NONE"] = 0] = "NONE";
    ItemDataTypes[ItemDataTypes["STRING_URI"] = 1] = "STRING_URI";
})(ItemDataTypes || (exports.ItemDataTypes = ItemDataTypes = {}));
var ItemAccessTypes;
(function (ItemAccessTypes) {
    ItemAccessTypes[ItemAccessTypes["NONE"] = 0] = "NONE";
    ItemAccessTypes[ItemAccessTypes["ROLES"] = 1] = "ROLES";
})(ItemAccessTypes || (exports.ItemAccessTypes = ItemAccessTypes = {}));
var MessageTypes;
(function (MessageTypes) {
    MessageTypes[MessageTypes["NONE"] = 0] = "NONE";
    MessageTypes[MessageTypes["CREATE_ITEM"] = 1] = "CREATE_ITEM";
    MessageTypes[MessageTypes["UPDATE_ITEM"] = 2] = "UPDATE_ITEM";
    MessageTypes[MessageTypes["CREATE_CHANNEL"] = 3] = "CREATE_CHANNEL";
    MessageTypes[MessageTypes["UPDATE_CHANNEL"] = 4] = "UPDATE_CHANNEL";
    MessageTypes[MessageTypes["ADD_ITEM_TO_CHANNEL"] = 5] = "ADD_ITEM_TO_CHANNEL";
    MessageTypes[MessageTypes["REMOVE_ITEM_FROM_CHANNEL"] = 6] = "REMOVE_ITEM_FROM_CHANNEL";
})(MessageTypes || (exports.MessageTypes = MessageTypes = {}));
var ChannelRoleTypes;
(function (ChannelRoleTypes) {
    ChannelRoleTypes[ChannelRoleTypes["NONE"] = 0] = "NONE";
    ChannelRoleTypes[ChannelRoleTypes["MEMBER"] = 1] = "MEMBER";
    ChannelRoleTypes[ChannelRoleTypes["ADMIN"] = 2] = "ADMIN";
})(ChannelRoleTypes || (exports.ChannelRoleTypes = ChannelRoleTypes = {}));
