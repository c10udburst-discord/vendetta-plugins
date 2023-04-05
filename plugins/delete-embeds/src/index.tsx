import { findByName, findByProps } from "@vendetta/metro";
import { i18n, constants } from "@vendetta/metro/common";
import { after, before, instead} from "@vendetta/patcher";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName as getAssetId } from "@vendetta/ui/assets"

let patches = [];

const REST = findByProps("getAPIBaseURL", "patch");
const ActionSheet = findByProps("openLazy", "hideActionSheet");
const { FormRow } = Forms;
const { MessageFlags } = constants;
const Icon = findByName("Icon");
const Permissions = findByProps("getChannelPermissions", "can");
const {getChannel} = findByProps("getChannel");

function onLoad() {
    patches.push(before("openLazy", ActionSheet, (ctx) => {
        const [component, args, actionMessage] = ctx;
        if (args != "MessageLongPressActionSheet") return;
        component.then(instance => {
            const unpatch = after("default", instance, (_, component) => {
                const [msgProps, oldButtons] = component.props?.children?.props?.children?.props?.children
    
                const message = msgProps?.props?.message ?? actionMessage?.message
    
                if (!oldButtons || !message) return

                const channel = getChannel(message.channel_id)

                if (!Permissions.can(constants.Permissions.MANAGE_MESSAGES, channel)) return

                const label = i18n?.Messages?.WEBHOOK_DELETE_TITLE?.intlMessage?.format({name:"Embed"})

                component.props.children.props.children.props.children[1] = [...oldButtons,
                <FormRow
                    label={label || "Delete Embed"}
                    leading={<Icon source={getAssetId("ic_close_16px")} />}
                    onPress={() => {
                        REST.patch({
                            url: `/channels/${message.channel_id}/messages/${message.id}`,
                            body: {
                                flags: message.flags | MessageFlags.SUPPRESS_EMBEDS
                            }
                        })
                        ActionSheet.hideActionSheet()
                    }}
                />]
                unpatch()
            })
        })
    }));
}

export default {
    onLoad,
    onUnload: () => {
        for (const unpatch of patches) {
            unpatch();
        };
    }
}
