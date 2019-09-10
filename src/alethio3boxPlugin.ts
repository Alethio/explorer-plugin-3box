import { IPlugin } from "plugin-api";
import { profileModule } from "./profileModule";

const alethio3boxPlugin: IPlugin = {
    init(config, api, logger, publicPath) {
        __webpack_public_path__ = publicPath;

        if (!config.ipfsUrlMask) {
            throw new Error(`Missing config "ipfsUrlMask"`);
        }
        api.addModuleDef("module://aleth.io/3box/profile", profileModule(config.ipfsUrlMask));
    },

    getAvailableLocales() {
        return ["en-US", "zh-CN"];
    },

    async loadTranslations(locale: string) {
        return await import("./translation/" + locale + ".json");
    }
};

// tslint:disable-next-line:no-default-export
export default alethio3boxPlugin;

export const manifest = __plugin_manifest__;
