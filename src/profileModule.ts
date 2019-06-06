import { IModuleDef } from "plugin-api/IModuleDef";
import { IProfileProps, Profile } from "./Profile";
import { IThreeBoxData } from "./IThreeBoxData";

interface IAccountContext {
    accountHash: string;
}

export const profileModule: (ipfsUrlMask: string) => IModuleDef<IProfileProps, IAccountContext, "fallback"> =
(ipfsUrlMask) => ({
    contextType: {
        accountHash: "string"
    },
    slotNames: ["fallback"],

    dataAdapters: [{
        alias: "profile",
        def: {
            contextType: {
                accountHash: "string"
            },
            async load(context, cancelToken) {
                let ThreeBox = (await import("3box")).default;
                cancelToken.throwIfCancelled();
                let profile = await ThreeBox.getProfile("0x" + context.accountHash);
                cancelToken.throwIfCancelled();
                let accounts: import("3box").IThreeBoxAccounts | undefined;
                if (profile) {
                    accounts = await ThreeBox.getVerifiedAccounts(profile);
                }
                let threeBoxData: IThreeBoxData = {
                    profile,
                    accounts
                };
                return threeBoxData;
            }
        }
    }],

    getContentComponent: async () => Profile,
    getContentProps(data) {
        let { translation, slots, asyncData } = data;

        let threeBoxData = asyncData.get("profile")!.data as IThreeBoxData;

        let props: IProfileProps = {
            threeBoxData,
            ipfsUrlMask,
            translation,
            fallback: slots && slots.fallback[0]
        };
        return props;
    }
});
