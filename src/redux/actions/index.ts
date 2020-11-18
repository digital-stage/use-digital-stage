import { AnyAction } from 'redux';
import stageActions from './stageActions';
import deviceActions from './deviceActions';
import {
  ServerDeviceEvents,
  ServerGlobalEvents,
  ServerStageEvents,
  ServerUserEvents,
} from '../../global/SocketEvents';
import { User } from '../../types';
import AdditionalReducerTypes from './AdditionalReducerTypes';

export interface ReducerAction extends AnyAction {
  type:
    | ServerGlobalEvents
    | ServerUserEvents
    | ServerDeviceEvents
    | ServerStageEvents
    | AdditionalReducerTypes;
  payload?: any;
}

const handleUserReady = (user: User) => {
  return {
    type: ServerUserEvents.USER_READY,
    payload: user,
  };
};
const setReady = () => {
  return {
    type: ServerGlobalEvents.READY,
  };
};

const reset = () => {
  return {
    type: AdditionalReducerTypes.RESET,
  };
};

const allActions = {
  server: {
    handleUserReady,
    setReady,
  },
  client: {
    reset,
  },
  stageActions,
  deviceActions,
};
export default allActions;
