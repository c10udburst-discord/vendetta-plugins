import { logger } from "@vendetta";
import { findByDisplayName, findByProps } from "@vendetta/metro";
import { constants, channels, React } from "@vendetta/metro/common";
import { instead, after } from "@vendetta/patcher";
import HiddenChannel from "./HiddenChannel";

let patches = [];

const permissions = findByProps("getChannelPermissions", "can");
const router = findByProps("transitionToGuild");
const MessagesConnected = findByDisplayName("MessagesConnected", false)

function isHidden(channel: any | undefined) {
    if (channel == undefined) return false;
    if (typeof channel === 'string')
        channel = channels.getChannel(channel)
    // https://discord.com/developers/docs/resources/channel#channel-object-channel-types too lazy to find that in constants
    if (channel?.type === 1 || channel?.type === 3) return false;
    channel.realCheck = true;
    return permissions.can(constants.Permissions.VIEW_CHANNEL, channel);
}
function onLoad() {
    patches.push(after("can", permissions, ([permID, channel], res) => {
        if (!channel.realCheck && permID === constants.Permissions.VIEW_CHANNEL) return true;
        return res;
    }));

    patches.push(instead("transitionToGuild", router, (args, orig) => {
        const [_, channel] = args
        if (!isHidden(channel)) orig(args);
    }));

    patches.push(instead("default", MessagesConnected, (args, orig) => {
        const channel = args[0]?.props?.channel;
        if (!isHidden(channel)) return orig(args)
        else return React.createElement(HiddenChannel, {channel})
    }))
}

export default {
    onLoad,
    onUnload: () => {
        for (const unpatch of patches) {
            unpatch();
        };
    }
}