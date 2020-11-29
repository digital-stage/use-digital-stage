import React, {useEffect, useRef, useState} from 'react';
import {
    IAnalyserNode,
    IAudioContext,
    IAudioNode,
    IGainNode
} from 'standardized-audio-context';

import {IMediaStreamAudioSourceNode} from 'standardized-audio-context/src/interfaces/media-stream-audio-source-node';
import useAudioContext from './../useAudioContext';
import {
    useAudioConsumers,
    useAudioProducers,
    useCurrentStageId,
    useCustomAudioProducers,
    useCustomGroups,
    useCustomStageMembers,
    useGroups,
    useStageMembersRaw
} from "../../../dist";
import TreeDimensionPannerNode from "./TreeDimensionPannerNode";

export interface StageWebAudioNodes {
    [id: string]: {
        sourceNode: IAudioNode<IAudioContext>;
        gainNode: IGainNode<IAudioContext>;
        analyserNode: IAnalyserNode<IAudioContext>;
        pannerNode: TreeDimensionPannerNode;
    };
}

export interface StageWebAudioConsumerNodes {
    [id: string]: {
        sourceNode?: IMediaStreamAudioSourceNode<IAudioContext>;
        element?: HTMLAudioElement;
        gainNode: IGainNode<IAudioContext>;
        analyserNode: IAnalyserNode<IAudioContext>;
        pannerNode: TreeDimensionPannerNode;
    };
}

export interface StageWebAudioProps {
    byGroup: StageWebAudioNodes;
    byStageMember: StageWebAudioNodes;
    byAudioProducer: StageWebAudioConsumerNodes;
}


const StageWebAudioContext = React.createContext<StageWebAudioProps>(undefined);

const useStageWebAudio = () => React.useContext(StageWebAudioContext);

const StageWebAudioProvider = (props: { children: React.ReactNode }) => {
    const {children} = props;
    const {audioContext} = useAudioContext();
    const audioPlayerRef = useRef<HTMLAudioElement>();
    const [, setRootGainNode] = useState<IGainNode<IAudioContext>>();
    const [rootNode, setRootNode] = useState<IAudioNode<IAudioContext>>();
    const [groupNodes, setGroupNodes] = useState<StageWebAudioNodes>({});
    const [stageMemberNodes, setStageMemberNodes] = useState<StageWebAudioNodes>({});
    const [audioProducerNodes, setAudioProducerNodes] = useState<StageWebAudioConsumerNodes>({});

    // Incoming states from stage
    const stageId = useCurrentStageId();
    const groups = useGroups();
    const customGroups = useCustomGroups();
    const stageMembers = useStageMembersRaw();
    const customStageMembers = useCustomStageMembers();
    const audioProducers = useAudioProducers();
    const customAudioProducers = useCustomAudioProducers();
    const audioConsumers = useAudioConsumers();

    useEffect(() => {
        if (audioContext && audioPlayerRef && !rootNode) {
            // Create root node

            const splitter = audioContext.createChannelSplitter(2);
            const merger = audioContext.createChannelMerger(2);

            merger.connect(audioContext.destination);

            splitter.connect(merger, 0, 0);
            splitter.connect(merger, 0, 1);

            const createdRootGainNode = audioContext.createGain();
            createdRootGainNode.gain.value = 1;
            //createdRootGainNode.connect(audioContext.destination);

            createdRootGainNode.connect(splitter, 0);

            const createdRootNode = audioContext.createChannelMerger();
            createdRootNode.connect(createdRootGainNode);

            setRootGainNode(createdRootGainNode);
            setRootNode(createdRootNode);

            // const dest = audioContext.createMediaStreamDestination();
            // rootNode.connect(dest);
            // audioPlayerRef.current.srcObject = dest.stream;
        }
    }, [audioContext, audioPlayerRef]);

    useEffect(() => {
        if (audioContext && rootNode) {
            if (stageId && groups.byStage[stageId]) {
                setGroupNodes((prev) => {
                    Object.keys(prev).forEach((id) => {
                        if (!groups.byId[id]) {
                            prev[id].sourceNode.disconnect();
                            prev[id].gainNode.disconnect();
                            prev[id].analyserNode.disconnect();
                            prev[id].pannerNode.disconnect();
                        }
                    });

                    return groups.byStage[stageId].reduce((items, id) => {
                        const item = groups.byId[id];
                        const customItem = customGroups.byGroup[item._id]
                            ? customGroups.byId[customGroups.byGroup[item._id]]
                            : undefined;
                        if (!prev[id]) {
                            // Create nodes
                            const sourceNode = audioContext.createChannelMerger();
                            const gainNode = audioContext.createGain();
                            if (customItem) {
                                gainNode.gain.value = customItem.volume;
                            } else {
                                gainNode.gain.value = item.volume;
                            }
                            const analyserNode = audioContext.createAnalyser();
                            const pannerNode = new TreeDimensionPannerNode(audioContext);
                            sourceNode.connect(gainNode);
                            gainNode.connect(analyserNode);
                            gainNode.connect(pannerNode.getNode());
                            pannerNode.connect(rootNode)
                            return {
                                ...items,
                                [item._id]: {
                                    sourceNode,
                                    gainNode,
                                    analyserNode,
                                },
                            };
                        }
                        if (customItem) {
                            if (customItem.muted) {
                                if (prev[item._id].gainNode.gain.value !== 0) {
                                    prev[item._id].gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                                }
                            } else if (prev[item._id].gainNode.gain.value !== customItem.volume) {
                                prev[item._id].gainNode.gain.setValueAtTime(
                                    customItem.volume,
                                    audioContext.currentTime
                                );
                            }
                            prev[item._id].pannerNode.setPosition(customItem.x, customItem.y, customItem.z);
                            prev[item._id].pannerNode.setOrientation(customItem.rX, customItem.rY, customItem.rZ);
                        } else {
                            if (item.muted) {
                                if (prev[item._id].gainNode.gain.value !== 0) {
                                    prev[item._id].gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                                }
                            } else if (prev[item._id].gainNode.gain.value !== item.volume) {
                                prev[item._id].gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                            }
                            prev[item._id].pannerNode.setPosition(item.x, item.y, item.z);
                            prev[item._id].pannerNode.setOrientation(item.rX, item.rY, item.rZ);
                        }

                        return {
                            ...items,
                            [item._id]: prev[item._id],
                        };
                    }, {});
                });
            } else {
                setGroupNodes((prev) => {
                    Object.keys(prev).forEach((id) => {
                        prev[id].sourceNode.disconnect();
                        prev[id].gainNode.disconnect();
                        prev[id].analyserNode.disconnect();
                        prev[id].pannerNode.disconnect();
                    });
                    return {};
                });
            }
        }
    }, [audioContext, rootNode, stageId, groups, customGroups]);

    useEffect(() => {
        if (audioContext) {
            if (stageId && stageMembers.byStage[stageId]) {
                // Create for each group node an audio player
                setStageMemberNodes((prev) => {
                    // Clean up old nodes
                    Object.keys(prev).forEach((id) => {
                        if (!stageMembers.byId[id]) {
                            prev[id].sourceNode.disconnect();
                            prev[id].gainNode.disconnect();
                            prev[id].analyserNode.disconnect();
                            prev[id].pannerNode.disconnect();
                        }
                    });

                    return stageMembers.byStage[stageId].reduce((items, id) => {
                        const item = stageMembers.byId[id];
                        const customItem = customStageMembers.byStageMember[item._id]
                            ? customStageMembers.byId[customStageMembers.byStageMember[item._id]]
                            : undefined;
                        if (groupNodes[item.groupId]) {
                            if (!prev[item._id]) {
                                // Create nodes
                                const sourceNode = audioContext.createChannelMerger();
                                const gainNode = audioContext.createGain();
                                if (customItem) {
                                    gainNode.gain.value = customItem.volume;
                                } else {
                                    gainNode.gain.value = item.volume;
                                }
                                const analyserNode = audioContext.createAnalyser();
                                const pannerNode = new TreeDimensionPannerNode(audioContext);
                                sourceNode.connect(gainNode);
                                gainNode.connect(analyserNode);
                                gainNode.connect(pannerNode.getNode());
                                pannerNode.connect(groupNodes[item.groupId].sourceNode);
                                return {
                                    ...items,
                                    [item._id]: {
                                        sourceNode,
                                        gainNode,
                                        analyserNode,
                                    },
                                };
                            }
                            if (customItem) {
                                if (customItem.muted) {
                                    if (prev[item._id].gainNode.gain.value !== 0) {
                                        prev[item._id].gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                                    }
                                } else if (prev[item._id].gainNode.gain.value !== customItem.volume) {
                                    prev[item._id].gainNode.gain.setValueAtTime(
                                        customItem.volume,
                                        audioContext.currentTime
                                    );
                                }
                                prev[item._id].pannerNode.setPosition(customItem.x, customItem.y, customItem.z);
                                prev[item._id].pannerNode.setOrientation(customItem.rX, customItem.rY, customItem.rZ);
                            } else {
                                if (item.muted) {
                                    if (prev[item._id].gainNode.gain.value !== 0) {
                                        prev[item._id].gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                                    }
                                } else if (prev[item._id].gainNode.gain.value !== item.volume) {
                                    prev[item._id].gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                                }
                                prev[item._id].pannerNode.setPosition(item.x, item.y, item.z);
                                prev[item._id].pannerNode.setOrientation(item.rX, item.rY, item.rZ);
                            }
                            return {
                                ...items,
                                [item._id]: prev[item._id],
                            };
                        }
                        return items;
                    }, {});
                });
            } else {
                setStageMemberNodes((prev) => {
                    Object.keys(prev).forEach((id) => {
                        prev[id].sourceNode.disconnect();
                        prev[id].gainNode.disconnect();
                        prev[id].analyserNode.disconnect();
                        prev[id].pannerNode.disconnect();
                    });
                    return {};
                });
            }
        }
    }, [audioContext, stageId, groupNodes, stageMembers, customStageMembers]);

    useEffect(() => {
        if (audioContext) {
            if (stageId && audioProducers.byStage[stageId]) {
                // Create for each group node an audio player
                setAudioProducerNodes((prev) => {
                    // Clean up old nodes
                    Object.keys(prev).forEach((id) => {
                        if (!audioProducers.byId[id]) {
                            if (prev[id].sourceNode) prev[id].sourceNode.disconnect();
                            prev[id].gainNode.disconnect();
                            prev[id].analyserNode.disconnect();
                        }
                    });
                    return audioProducers.byStage[stageId].reduce((items, id) => {
                        const item = audioProducers.byId[id];
                        const customItem = customAudioProducers.byAudioProducer[item._id]
                            ? customAudioProducers.byId[customAudioProducers.byAudioProducer[item._id]]
                            : undefined;
                        if (stageMemberNodes[item.stageMemberId]) {
                            let gainNode;
                            let analyserNode;
                            let sourceNode;
                            let pannerNode;
                            let element;
                            if (!prev[item._id]) {
                                gainNode = audioContext.createGain();
                                gainNode.gain.value = 1;
                                // gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                                analyserNode = audioContext.createAnalyser();
                                gainNode.connect(analyserNode);
                                pannerNode = new TreeDimensionPannerNode(audioContext);
                                gainNode.connect(pannerNode.getNode());
                                pannerNode.connect(stageMemberNodes[item.stageMemberId].sourceNode);
                            } else {
                                gainNode = prev[item._id].gainNode;
                                analyserNode = prev[item._id].analyserNode;
                                if (customItem) {
                                    if (customItem.muted) {
                                        if (gainNode.gain.value !== 0) {
                                            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                                        }
                                    } else if (gainNode.gain.value !== customItem.volume) {
                                        gainNode.gain.setValueAtTime(customItem.volume, audioContext.currentTime);
                                    }
                                    prev[item._id].pannerNode.setPosition(customItem.x, customItem.y, customItem.z);
                                    prev[item._id].pannerNode.setOrientation(customItem.rX, customItem.rY, customItem.rZ);
                                } else {
                                    if (item.muted) {
                                        if (gainNode.gain.value !== 0) {
                                            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                                        }
                                    } else if (gainNode.gain.value !== item.volume) {
                                        gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                                    }
                                    prev[item._id].pannerNode.setPosition(item.x, item.y, item.z);
                                    prev[item._id].pannerNode.setOrientation(item.rX, item.rY, item.rZ);
                                }
                            }
                            if (
                                (!prev[item._id] || !prev[item._id].sourceNode) &&
                                audioConsumers.byProducer[item._id]
                            ) {
                                // See, if there is a consumer
                                const audioConsumer = audioConsumers.byId[audioConsumers.byProducer[item._id]];
                                const stream = new MediaStream([audioConsumer.consumer.track]);

                                element = new Audio();
                                element.srcObject = stream;
                                element.autoplay = true;
                                element.muted = true;
                                element.play();

                                // sourceNode = audioContext.createMediaElementSource(element);
                                // sourceNode.connect(gainNode);

                                sourceNode = audioContext.createMediaStreamSource(stream);
                                sourceNode.connect(gainNode);
                            }
                            return {
                                ...items,
                                [item._id]: {
                                    gainNode,
                                    analyserNode,
                                    sourceNode,
                                    pannerNode,
                                    element,
                                },
                            };
                        }
                        return items;
                    }, {});
                });
            } else {
                setAudioProducerNodes((prev) => {
                    Object.keys(prev).forEach((id) => {
                        if (prev[id].sourceNode) prev[id].sourceNode.disconnect();
                        prev[id].gainNode.disconnect();
                        prev[id].analyserNode.disconnect();
                        prev[id].pannerNode.disconnect();
                    });
                    return {};
                });
            }
        }
    }, [
        audioContext,
        stageMemberNodes,
        audioProducers,
        audioConsumers.byProducer,
        customAudioProducers,
    ]);

    return (
        <StageWebAudioContext.Provider
            value={{
                byGroup: groupNodes,
                byStageMember: stageMemberNodes,
                byAudioProducer: audioProducerNodes,
            }}
        >
            {children}
        </StageWebAudioContext.Provider>
    );
};

export {
    StageWebAudioProvider
}

export default useStageWebAudio;
