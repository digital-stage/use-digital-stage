import { ServerStageEvents } from '../../global/SocketEvents';
import { Stage, User } from '../../types';
import { Group } from '../../types/Group';
import { StageMember } from '../../types/StageMember';
import { CustomStageMember } from '../../types/CustomStageMember';
import { CustomGroup } from '../../types/CustomGroup';
import { StageMemberVideoProducer } from '../../types/StageMemberVideoProducer';
import { CustomStageMemberAudioProducer } from '../../types/CustomStageMemberAudioProducer';
import { StageMemberAudioProducer } from '../../types/StageMemberAudioProducer';
import { StageMemberOvTrack } from '../../types/StageMemberOvTrack';
import { CustomStageMemberOvTrack } from '../../types/CustomStageMemberOvTrack';
import { VideoConsumer } from '../../types/VideoConsumer';
import AdditionalReducerTypes from './AdditionalReducerTypes';
import { AudioConsumer } from '../../types/AudioConsumer';

export interface StagePackage {
  users: User[];

  stage?: Stage;
  groups?: Group[];
  stageMembers: StageMember[];
  customGroups: CustomGroup[];
  customStageMembers: CustomStageMember[];
  videoProducers: StageMemberVideoProducer[];
  audioProducers: StageMemberAudioProducer[];
  customAudioProducers: CustomStageMemberAudioProducer[];
  ovTracks: StageMemberOvTrack[];
  customOvTracks: CustomStageMemberOvTrack[];
}

export interface InitialStagePackage extends StagePackage {
  stageId: string;
  groupId: string;
}

const addUser = (user: User) => {
  return {
    type: ServerStageEvents.USER_ADDED,
    payload: user,
  };
};
const changeUser = (user: Partial<User>) => {
  return {
    type: ServerStageEvents.USER_CHANGED,
    payload: user,
  };
};
const removeUser = (userId: string) => {
  return {
    type: ServerStageEvents.USER_REMOVED,
    payload: userId,
  };
};
const addStage = (stage: Stage) => {
  return {
    type: ServerStageEvents.STAGE_ADDED,
    payload: stage,
  };
};
const changeStage = (stage: Partial<Stage>) => {
  return {
    type: ServerStageEvents.STAGE_CHANGED,
    payload: stage,
  };
};
const removeStage = (stageId: string) => {
  return {
    type: ServerStageEvents.STAGE_REMOVED,
    payload: stageId,
  };
};

const addGroup = (group: Group) => {
  return {
    type: ServerStageEvents.GROUP_ADDED,
    payload: group,
  };
};
const changeGroup = (group: Partial<Group>) => {
  return {
    type: ServerStageEvents.GROUP_CHANGED,
    payload: group,
  };
};
const removeGroup = (groupId: string) => {
  return {
    type: ServerStageEvents.GROUP_REMOVED,
    payload: groupId,
  };
};

const addCustomGroup = (group: CustomGroup) => {
  return {
    type: ServerStageEvents.CUSTOM_GROUP_ADDED,
    payload: group,
  };
};
const changeCustomGroup = (group: Partial<CustomGroup>) => {
  return {
    type: ServerStageEvents.CUSTOM_GROUP_CHANGED,
    payload: group,
  };
};
const removeCustomGroup = (groupId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_GROUP_REMOVED,
    payload: groupId,
  };
};

const addStageMember = (stageMember: StageMember) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_ADDED,
    payload: stageMember,
  };
};
const changeStageMember = (stageMember: Partial<StageMember>) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_CHANGED,
    payload: stageMember,
  };
};
const removeStageMember = (stageMemberId: string) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_REMOVED,
    payload: stageMemberId,
  };
};

const addCustomStageMember = (stageMember: CustomStageMember) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED,
    payload: stageMember,
  };
};
const changeCustomStageMember = (stageMember: Partial<CustomStageMember>) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED,
    payload: stageMember,
  };
};
const removeCustomStageMember = (customStageMemberId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED,
    payload: customStageMemberId,
  };
};

const addVideoProducer = (videoProducer: StageMemberVideoProducer) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED,
    payload: videoProducer,
  };
};
const changeVideoProducer = (
  videoProducer: Partial<StageMemberVideoProducer>
) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED,
    payload: videoProducer,
  };
};
const removeVideoProducer = (videoProducerId: string) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED,
    payload: videoProducerId,
  };
};

const addAudioProducer = (audioProducer: StageMemberAudioProducer) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED,
    payload: audioProducer,
  };
};
const changeAudioProducer = (
  audioProducer: Partial<StageMemberAudioProducer>
) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED,
    payload: audioProducer,
  };
};
const removeAudioProducer = (audioProducerId: string) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED,
    payload: audioProducerId,
  };
};

const addCustomAudioProducer = (
  customAudioProducer: CustomStageMemberAudioProducer
) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED,
    payload: customAudioProducer,
  };
};
const changeCustomAudioProducer = (
  customAudioProducer: Partial<CustomStageMemberAudioProducer>
) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED,
    payload: customAudioProducer,
  };
};
const removeCustomAudioProducer = (customAudioProducerId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED,
    payload: customAudioProducerId,
  };
};

const addOvTrack = (track: StageMemberOvTrack) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_OV_ADDED,
    payload: track,
  };
};
const changeOvTrack = (track: Partial<StageMemberOvTrack>) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_OV_CHANGED,
    payload: track,
  };
};
const removeOvTrack = (trackId: string) => {
  return {
    type: ServerStageEvents.STAGE_MEMBER_OV_REMOVED,
    payload: trackId,
  };
};

const addCustomOvTrack = (customOvTrack: CustomStageMemberOvTrack) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_ADDED,
    payload: customOvTrack,
  };
};
const changeCustomOvTrack = (
  customOvTrack: Partial<CustomStageMemberOvTrack>
) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_CHANGED,
    payload: customOvTrack,
  };
};
const removeCustomOvTrack = (customOvTrackId: string) => {
  return {
    type: ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_REMOVED,
    payload: customOvTrackId,
  };
};

const addVideoConsumer = (videoConsumer: VideoConsumer) => {
  return {
    type: AdditionalReducerTypes.ADD_VIDEO_CONSUMER,
    payload: videoConsumer,
  };
};
const removeVideoConsumer = (videoConsumerId: string) => {
  return {
    type: AdditionalReducerTypes.REMOVE_VIDEO_CONSUMER,
    payload: videoConsumerId,
  };
};

const addAudioConsumer = (audioConsumer: AudioConsumer) => {
  return {
    type: AdditionalReducerTypes.ADD_AUDIO_CONSUMER,
    payload: audioConsumer,
  };
};
const removeAudioConsumer = (audioConsumerId: string) => {
  return {
    type: AdditionalReducerTypes.REMOVE_AUDIO_CONSUMER,
    payload: audioConsumerId,
  };
};

const server = {
  addUser,
  changeUser,
  removeUser,
  addStage,
  changeStage,
  removeStage,
  addGroup,
  changeGroup,
  removeGroup,
  addCustomGroup,
  changeCustomGroup,
  removeCustomGroup,
  addStageMember,
  changeStageMember,
  removeStageMember,
  addCustomStageMember,
  changeCustomStageMember,
  removeCustomStageMember,
  addVideoProducer,
  changeVideoProducer,
  removeVideoProducer,
  addAudioProducer,
  changeAudioProducer,
  removeAudioProducer,
  addCustomAudioProducer,
  changeCustomAudioProducer,
  removeCustomAudioProducer,
  addOvTrack,
  changeOvTrack,
  removeOvTrack,
  addCustomOvTrack,
  changeCustomOvTrack,
  removeCustomOvTrack,
};
const client = {
  addVideoConsumer,
  removeVideoConsumer,
  addAudioConsumer,
  removeAudioConsumer,
};
const stageActions = {
  server,
  client,
};
export default stageActions;
