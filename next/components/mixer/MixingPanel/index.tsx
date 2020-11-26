import {styled} from 'styletron-react';
import React from 'react';
import GroupChannel from './channels/GroupChannel';
import {useSelector} from "../../../../dist";

const Wrapper = styled('div', {
  width: '100%',
  height: '100%',
  minHeight: '400px',
  maxHeight: '600px',
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  flexWrap: 'nowrap',
  padding: '1rem',
});

/** *
 * The mixing panel shows all available volume controls for an active stage
 * @constructor
 */
const MixingPanelView = (): JSX.Element => {
  const groupIds = useSelector<string[]>(state =>
      state.global.stageId && state.groups.byStage[state.global.stageId]
          ? state.groups.byStage[state.global.stageId]
          : []
  );

  return (
    <Wrapper>
      {groupIds.map((id) => (
        <GroupChannel key={id} groupId={id} />
      ))}
    </Wrapper>
  );
};
export default MixingPanelView;
