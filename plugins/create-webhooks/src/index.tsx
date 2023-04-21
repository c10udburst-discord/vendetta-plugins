import { findByName, findByProps } from "@vendetta/metro";
import { stylesheet, React, ReactNative, i18n } from "@vendetta/metro/common";
import { instead} from "@vendetta/patcher";

let patches = [];

const {View} = ReactNative;

const ConnectedWebhooksOverview = findByName("ConnectedWebhooksOverview", false);
const Button = findByName("Button", false).default;
const { create: createWebhook } = findByProps("update", "create", "fetchForChannel");
const {getChannel} = findByProps("getChannel");

const Styles = stylesheet.createThemedStyleSheet({
    'container': {
        'flex': 1,
        'paddingBottom': 32
    },
    'button': {
        'maxHeight': 32,
        'margin': 16
    }
})

function onLoad() {   
    patches.push(instead("default", ConnectedWebhooksOverview, (args, orig) => {
        const channel = getChannel(args[0]?.channelId)
        return (<View style={Styles.container}>
            {orig?.(...args)}
            <Button color="brand" style={Styles.button}
                text={i18n?.Messages?.WEBHOOK_CREATE || "Create Webhook"}
                onPress={() => {
                    createWebhook?.(channel?.guild_id, channel?.id)
                }}
            />
        </View>)
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
