import { stylesheet, constants, moment } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { semanticColors } from '@vendetta/ui';

const {View, Text} = findByProps("Button", "Text", "View");

const snowflakeUtils = findByProps("extractTimestamp");

const MessageStyles = stylesheet.createThemedStyleSheet({
    'container': {
        'flex': 1,
        'alignItems': 'center',
        'justifyContent': 'center',
    },
    'title': {
        'fontFamily': constants.Fonts.PRIMARY_SEMIBOLD,
        'fontSize': 24,
        'textAlign': 'left',
        'color': semanticColors.HEADER_PRIMARY,
        'paddingVertical': 25
    },
    'text': {
        'fontSize': 16,
        'textAlign': 'justify',
        'color': semanticColors.HEADER_PRIMARY,
    }
})

export default function HiddenChannel({channel}) {
    return <View style={MessageStyles.container}>
        <Text style={MessageStyles.title}>This channel is hidden.</Text>
        <Text style={MessageStyles.text}>
            Topic: {channel.topic || "No topic."}
            {"\n\n"}
            Creation date: {moment(new Date(snowflakeUtils.extractTimestamp(channel.id))).fromNow()}
            {"\n\n"}
            Last message: {channel.lastMessageId ? moment(new Date(snowflakeUtils.extractTimestamp(channel.lastMessageId))).fromNow() : "No messages."}
            {"\n\n"}
            Last pin: {channel.lastPinTimestamp ? moment(new Date(channel.lastPinTimestamp)).fromNow() : "No pins."}
        </Text>
    </View>
}
