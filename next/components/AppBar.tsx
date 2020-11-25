import Link from 'next/link';
import {styled} from 'styletron-react';
import React from 'react';
import useDigitalStage from '../..';
import useAuth from "../lib/useAuth";

const Container = styled('div', {
  width: '100%',
  color: 'white',
  backgroundColor: 'black',
  marginBottom: '1rem',
});
const List = styled('div', {
  display: 'flex',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  flexWrap: 'wrap'
});
const ListItem = styled('div', {
  padding: '1rem',
});

const AppBar = () => {
  const auth = useAuth();
  const { ready } = useDigitalStage();

  if (ready && auth.user) {
    return (
      <Container>
        <List>
          <ListItem>
            <Link href="/">Home</Link>
          </ListItem>
          <ListItem>
            <Link href="/user">User</Link>
          </ListItem>
          <ListItem>
            <Link href="/devices">Devices</Link>
          </ListItem>
          <ListItem>
            <Link href="/stagemanagement">Stage management</Link>
          </ListItem>
          <ListItem>
            <Link href="/stages">Stages</Link>
          </ListItem>
          <ListItem>
            <Link href="/groups">Groups</Link>
          </ListItem>
          <ListItem>
            <Link href="/customgroups">Custom Groups</Link>
          </ListItem>
          <ListItem>
            <Link href="/stagemembers">Stage members</Link>
          </ListItem>
          <ListItem>
            <Link href="/customstagemembers">Custom stage members</Link>
          </ListItem>
          <ListItem>
            <Link href="/chat">Chat</Link>
          </ListItem>
          <ListItem>
            <Link href="/state">Full state</Link>
          </ListItem>
        </List>
      </Container>
    );
  }

  return <div>Loading app bar...</div>;
};
export default AppBar;
