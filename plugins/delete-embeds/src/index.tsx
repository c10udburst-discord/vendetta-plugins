import { findByProps } from "@vendetta/metro";
import { i18n, constants } from "@vendetta/metro/common";
import { after, before} from "@vendetta/patcher";
import { Forms } from "@vendetta/ui/components";
import { React } from "@vendetta/metro/common";
import { getAssetIDByName as getAssetId } from "@vendetta/ui/assets"
import { findInReactTree } from "@vendetta/utils"

let patches = [];


const LazyActionSheet = findByProps("openLazy", "hideActionSheet");
const { FormRow, FormIcon } = Forms;
const {getCurrentUser} = findByProps("getCurrentUser")
const {suppressEmbeds} = findByProps("suppressEmbeds");
const Permissions = findByProps("getChannelPermissions", "can");
const {getChannel} = findByProps("getChannel");

function onLoad() {
    patches.push(before("openLazy", LazyActionSheet, ([component, key, msg]) => {
        const message = msg?.message;
        if (key != "MessageLongPressActionSheet" || !message) return;
        component.then(instance => {
            const unpatch = after("default", instance, (_, component) => {
                React.useEffect(() => () => { unpatch() }, [])
                const buttons = findInReactTree(component, x => x?.[0]?.type?.name === "ButtonRow")
                if (!buttons) return

                const channel = getChannel(message.channel_id)
                if (message.embeds.length == 0 || (getCurrentUser().id !== message.author.id && !Permissions.can(constants.Permissions.MANAGE_MESSAGES, channel))) {
                    //unpatch()
                    return
                }

                const label = i18n?.Messages?.WEBHOOK_DELETE_TITLE?.intlMessage?.format({name:"Embed"})

                buttons.push(
                <FormRow
                    label={label || "Delete Embed"}
                    leading={<FormIcon style={{ opacity: 1 }} source={getAssetId("ic_close_16px")} />}
                    onPress={() => {
                        suppressEmbeds(message.channel_id, message.id)
                        LazyActionSheet.hideActionSheet()
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
