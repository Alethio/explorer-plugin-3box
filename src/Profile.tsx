import * as React from "react";
import styled from "@alethio/explorer-ui/lib/styled-components";
import { Tooltip } from "@alethio/ui/lib/overlay/tooltip/Tooltip";
import { ITranslation } from "plugin-api/ITranslation";
import { ThreeBoxTooltipContent } from "./ThreeBoxTooltipContent";
import { IThreeBoxData } from "./IThreeBoxData";

export interface IProfileProps {
    ipfsUrlMask: string;
    threeBoxData: IThreeBoxData | undefined;
    translation: ITranslation;
    fallback?: JSX.Element;
}

const IdenticonImg = styled("img")`
    width: ${props => props.theme.spacing.identiconSize}px;
    height: ${props => props.theme.spacing.identiconSize}px;
    border: 1px solid ${({theme}) => theme.colors.identiconBorder};
`;

export class Profile extends React.PureComponent<IProfileProps> {
    render() {
        let { threeBoxData, translation: tr } = this.props;

        let profileImgSrc = this.getProfileImageSrc();
        if (!profileImgSrc) {
            return this.props.fallback;
        }

        let img = <IdenticonImg src={profileImgSrc} />;

        if (threeBoxData && (threeBoxData.profile.name || threeBoxData.profile.website)) {
            let tooltipContent = <ThreeBoxTooltipContent translation={tr} data={threeBoxData} />;
            img = <Tooltip placement="bottom" content={tooltipContent}>{img}</Tooltip>;
        }

        return img;
    }

    private getProfileImageSrc() {
        let { threeBoxData } = this.props;
        if (threeBoxData && threeBoxData.profile.image && threeBoxData.profile.image.length) {
            let contentUrl = threeBoxData.profile.image[0].contentUrl["/"];
            return this.props.ipfsUrlMask.replace("%s", contentUrl);
        }
        return void 0;
    }
}
