import { findByName, findByProps } from "@vendetta/metro";
import { i18n, constants } from "@vendetta/metro/common";
import { after, before} from "@vendetta/patcher";
import { Forms } from "@vendetta/ui/components";
import { React } from "@vendetta/metro/common";
import { getAssetIDByName as getAssetId } from "@vendetta/ui/assets"

let patches = [];


const ActionSheet = findByProps("openLazy", "hideActionSheet");
const { FormRow } = Forms;
const Icon = findByName("Icon");
const {getCurrentUser} = findByProps("getCurrentUser")
const {suppressEmbeds} = findByProps("suppressEmbeds");
const Permissions = findByProps("getChannelPermissions", "can");
const {getChannel} = findByProps("getChannel");

function onLoad() {
    patches.push(before("openLazy", ActionSheet, (ctx) => {
        const [component, args, actionMessage] = ctx;
        if (args != "MessageLongPressActionSheet") return;
        component.then(instance => {
            const unpatch = after("default", instance, (_, component) => {
                React.useEffect(() => () => { unpatch() }, []) // omg!!!!!!!!!!!!!
                const [msgProps, buttons] = component.props?.children?.props?.children?.props?.children
    
                const message = msgProps?.props?.message ?? actionMessage?.message
    
                if (!buttons || !message) return

                const channel = getChannel(message.channel_id)
                if (message.embeds.length == 0 || (getCurrentUser().id !== message.author.id && !Permissions.can(constants.Permissions.MANAGE_MESSAGES, channel))) {
                    //unpatch()
                    return
                }

                const label = i18n?.Messages?.WEBHOOK_DELETE_TITLE?.intlMessage?.format({name:"Embed"})

                buttons.push(
                <FormRow
                    label={label || "Delete Embed"}
                    leading={<Icon source={getAssetId("ic_close_16px")} />}
                    onPress={() => {
                        suppressEmbeds(message.channel_id, message.id)
                        ActionSheet.hideActionSheet()
                    }}
                />)
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
