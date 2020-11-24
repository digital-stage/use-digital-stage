import {styled} from "styletron-react";
import React, {useCallback} from "react";
import useDigitalStage, {Group, useVideoConsumers} from "../../dist";
import VideoPlayer from "../components/ui/VideoPlayer";
import {LocalConsumer, StageMemberWithUserData, useCurrentStageId, useLocalDevice, useSelector} from "../..";
import {useGroupsByStage, useStageMembersByGroup} from "../../../webclient/lib/digitalstage/useStageSelector";

const Wrapper = styled("div", {
    position: 'fixed',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)'
});

const ToggleButton = styled("button", (props: { $active }) => ({
    borderRadius: "50%",
    border: '1px solid black',
    backgroundColor: props.$active ? '#50fa7b' : '#c2fad0',
    padding: '.2rem',
    color: '#000',
    marginLeft: '1rem',
    marginRight: '1rem',
    fontFamily: "'Fira Code', monospace",
    ':hover': {
        backgroundColor: '#40cd64',
    },
    ':disabled': {
        cursor: 'default',
        backgroundColor: '#cd40aa',
    },
}));

const StageMemberView = (props: {
    stageMember: StageMemberWithUserData
}) => {
    const {stageMember} = props;
    const videoConsumers = useSelector<LocalConsumer[]>(state => state.videoConsumers.byStageMember[stageMember._id]
        ? state.videoConsumers.byStageMember[stageMember._id].map(id => state.videoConsumers.byId[id])
        : []
    )

    return (
        <div>
            <h4>{stageMember.name || stageMember._id}</h4>
            <p>{videoConsumers.length} VIDEO CONSUMERS</p>
            <VideoPlayer consumers={videoConsumers}/>
        </div>
    )
}

const GroupView = (props: {
    group: Group
}) => {
    const {group} = props;

    const stageMembers = useStageMembersByGroup(group._id);

    return (
        <div>
            <h3>{group.name}</h3>
            {stageMembers.map(stageMember => <StageMemberView key={stageMember._id} stageMember={stageMember}/>)}
        </div>
    )
}


const Chat = () => {
    const {actions} = useDigitalStage();
    const localDevice = useLocalDevice();

    const consumers = useVideoConsumers();

    // Get current stage id
    const stageId = useCurrentStageId();

    // Get all groups according to the stage
    const groups = useGroupsByStage(stageId);

    const toggleWebcam = useCallback(() => {
        if (actions) {
            actions.updateDevice(localDevice._id, {
                sendVideo: !localDevice.sendVideo
            })
        }
    }, [actions, localDevice]);

    const toggleMic = useCallback(() => {
        if (actions) {
            actions.updateDevice(localDevice._id, {
                sendAudio: !localDevice.sendAudio
            })
        }
    }, [actions, localDevice]);


    if (stageId) {

        return (
            <>
                <p>{consumers.allIds.length} VIDEO CONSUMERS</p>
                {groups.map(group => <GroupView key={group._id} group={group}/>)}

                {localDevice ? (
                    <Wrapper>
                        <ToggleButton
                            $active={localDevice.sendVideo}
                            onClick={toggleWebcam}
                        >
                            <img
                                src={localDevice.sendVideo ? "static/videocam-18dp.svg" : "static/videocam_off-18dp.svg"}
                            />
                        </ToggleButton>
                        <ToggleButton
                            $active={localDevice.sendAudio}
                            onClick={toggleMic}
                        >
                            <img
                                src={localDevice.sendAudio ? "static/mic-18dp.svg" : "static/mic_off-18dp.svg"}
                            />
                        </ToggleButton>
                    </Wrapper>
                ) : null}
            </>
        )
    }
    return (
        <div>Not inside a stage</div>
    )
};
export default Chat;