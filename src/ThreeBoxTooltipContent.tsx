import * as React from "react";
import { Label } from "@alethio/ui/lib/data/Label";
import { ValueBox } from "@alethio/ui/lib/layout/content/box/ValueBox";
import styled from "@alethio/ui/lib/styled-components";
import { ExternalLink } from "@alethio/ui/lib/control/ExternalLink";
import { IThreeBoxData } from "./IThreeBoxData";
import { ITranslation } from "plugin-api/ITranslation";

export interface IThreeBoxTooltipContentProps {
    data: IThreeBoxData;
    translation: ITranslation;
}

const ContentRoot = styled.div`
    min-width: 250px;
`;

const DataRow = styled.div`
    display: flex;
    align-content: center;
`;

const LayoutItem = styled.div`
    display: flex;
    align-items: center;
    align-content: center;
    height: 36px;
    padding: 0 8px;
    justify-content: flex-end;
`;

const LabelWrapper = styled(LayoutItem)`
    width: 100px;
`;

const DataLabel: React.StatelessComponent = ({children}) => (
    <LabelWrapper><Label>{children}</Label></LabelWrapper>
);

const DataValue: React.StatelessComponent = ({children}) => (
    <LayoutItem><ValueBox variant="small">{children}</ValueBox></LayoutItem>
);

const Divider = styled.div`
    border-top: 1px solid ${props => props.theme.colors.overlayBorder};
`;

const Disclaimer = styled.div`
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    text-align: center;
    color: ${props => props.theme.colors.base.secondary.color};
`;

export class ThreeBoxTooltipContent extends React.Component<IThreeBoxTooltipContentProps> {
    render() {
        let { translation: tr, data } = this.props;

        let [, disclaimerPre, disclaimerLink, disclaimerPost] =
            tr.get("accountView.threeBox.disclaimer.label").match(/(.*){link}(.*){\/link}(.*)/)!;

        let websiteUrl = this.getWebsiteUrl();

        return <ContentRoot>
            { data.profile.name ?
            <DataRow>
                <DataLabel>{tr.get("accountView.threeBox.name.label")}</DataLabel>
                <DataValue>{data.profile.name}</DataValue>
            </DataRow>
            : null }
            {data.accounts && data.accounts.github && data.accounts.github.username ?
            <DataRow>
                <DataLabel>{tr.get("accountView.threeBox.github.label")}</DataLabel>
                <DataValue>
                    <ExternalLink href={`https://github.com/${data.accounts.github.username}`}>
                        {data.accounts.github.username}
                    </ExternalLink>
                </DataValue>
            </DataRow>
            : null }
            {data.accounts && data.accounts.twitter && data.accounts.twitter.username ?
            <DataRow>
                <DataLabel>{tr.get("accountView.threeBox.twitter.label")}</DataLabel>
                <DataValue>
                    <ExternalLink href={`https://twitter.com/${data.accounts.twitter.username}`}>
                        @{data.accounts.twitter.username}
                    </ExternalLink>
                </DataValue>
            </DataRow>
            : null }
            {websiteUrl ?
            <DataRow>
                <DataLabel>{tr.get("accountView.threeBox.website.label")}</DataLabel>
                <DataValue>
                    <ExternalLink href={websiteUrl}>
                        {websiteUrl}
                    </ExternalLink>
                </DataValue>
            </DataRow>
            : null }
            <Divider />
            <Disclaimer>
                {disclaimerPre}
                <ExternalLink href={"https://" + disclaimerLink}>{disclaimerLink}</ExternalLink>
                {disclaimerPost}
            </Disclaimer>
        </ContentRoot>;
    }

    private getWebsiteUrl() {
        let { website: websiteUrl } = this.props.data.profile;
        if (!websiteUrl) {
            return void 0;
        }

        if (!websiteUrl.match(/^https?:\/\//)) {
            websiteUrl = "http://" + websiteUrl;
        }

        return websiteUrl;
    }
}
