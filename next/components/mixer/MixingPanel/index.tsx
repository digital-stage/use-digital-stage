import {styled} from 'styletron-react';
import React, {useEffect, useState} from 'react';
import {
    useIsStageAdmin,
} from "use-digital-stage";
import Select, {Option} from "../../ui/Select";
import Paragraph from "../../theme/Paragraph";
import CombinedMixingPanel from "../CombinedMixingPanel";
import TabControl from "../../theme/TabControl";
import {breakpoints} from "../../ui/Theme";

const Wrapper = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%'
});
const MixingPanelHeader = styled('div', {
    width: '100%',
    flexGrow: 0
});
const ScrollPaneWrapper = styled('div', {
    position: 'relative',
    whiteSpace: 'nowrap',
    flexGrow: 1,
    width: '100%',
    margin: 0,
    padding: 0
});
const ScrollPane = styled('div', {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflowX: 'scroll',
    overflowY: 'scroll',
    margin: 0,
    padding: 0
});
const MixingPanelWrapper = styled("div", {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
    height: '100%',
    minHeight: '400px',
    maxHeight: '600px',
    [breakpoints.TABLET]: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    }
})

const Options: Option[] = [
    {
        id: "monitor",
        label: "Monitor"
    },
    {
        id: "global",
        label: "Global"
    },
];


/** *
 * The mixing panel shows all available volume controls for an active stage
 * @constructor
 */
const MixingPanelView = (): JSX.Element => {
    const isStageAdmin = useIsStageAdmin();
    const [mode, setMode] = useState<Option>(Options[1]);

    useEffect(() => {
        setMode(isStageAdmin ? Options[0] : Options[1])
    }, [isStageAdmin])

    let text;
    if (mode.id === "global") {
        text = "These settings affects the global default volumes for all users including yourself, but maybe overwritten by the monitor mix of each user.";
    } else {
        text = "This settings overwrites the global default volumes only for yourself.";
    }

    return (
        <Wrapper>
            {isStageAdmin && (
                <MixingPanelHeader>
                    <TabControl
                        onChange={(value: string) => {
                            setMode(Options.find(o => o.label === value));
                        }}
                        options={Options.map(o => o.label)}
                        value={mode.label}
                    />
                    <Paragraph>
                        {text}
                    </Paragraph>
                </MixingPanelHeader>
            )}
            <ScrollPaneWrapper>
                <ScrollPane>
                    <MixingPanelWrapper>
                        <CombinedMixingPanel global={mode.id === "global"}/>
                    </MixingPanelWrapper>
                </ScrollPane>
            </ScrollPaneWrapper>
        </Wrapper>
    );
};
export default MixingPanelView;
