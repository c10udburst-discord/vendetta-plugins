import { ReactNative, stylesheet, constants } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";

const {View, Text} = ReactNative;

const snowflakeUtils = findByProps("extractTimestamp");

const MessageStyles = stylesheet.createThemedStyleSheet({
    'container': {
        'flex': 1,
        'alignItems': 'center',
        'justifyContent': 'center',
        'backgroundColor': constants.ThemeColorMap.BACKGROUND_PRIMARY,
    },
    'title': {
        'fontFamily': constants.Fonts.PRIMARY_SEMIBOLD,
        'fontSize': 24,
        'backgroundColor':constants.ThemeColorMap.BACKGROUND_PRIMARY,
        'textAlign': 'left',
        'color': constants.ThemeColorMap.HEADER_PRIMARY,
        'paddingVertical': 25
    },
    'text': {
        'fontSize': 16,
        'backgroundColor':constants.ThemeColorMap.BACKGROUND_PRIMARY,
        'textAlign': 'justify',
        'color': constants.ThemeColorMap.HEADER_PRIMARY,
    }
})

export default function HiddenChannel({channel}) {
    return <View style={MessageStyles.container}>
        <Text style={MessageStyles.title}>This channel is hidden.</Text>
        <Text style={MessageStyles.text}>
            Topic: {channel.topic || "No topic."}
            {"\n\n"}
            Last message: {channel.lastMessageId ? new Date(snowflakeUtils.extractTimestamp(channel.lastMessageId)).toLocaleString() : "No messages."}
            {"\n\n"}
            Last pin: {channel.lastPinTimestamp ? (new Date(channel.lastPinTimestamp)).toLocaleString() : "No pins."}
        </Text>
    </View>
}