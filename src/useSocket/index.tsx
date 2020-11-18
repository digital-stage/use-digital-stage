import * as React from 'react';
import { useCallback, useState } from 'react';
import { TeckosClient, TeckosClientWithJWT } from 'teckos-client';
import debug from 'debug';
import { Device } from '../types';
import useSocketToDispatch from '../redux/useSocketToDispatch';

const d = debug('useSocket');

export interface TSocketContext {
  error?: Error;

  connect(token: string, initialDevice: Partial<Device>): Promise<TeckosClient>;

  disconnect(): Promise<any>;

  connected: boolean;
}

const SocketContext = React.createContext<TSocketContext>({
  connect: () => Promise.reject(new Error('Not ready')),
  disconnect: () => Promise.reject(new Error('Not ready')),
  connected: false,
});

export type SocketHandlerHook = (socket: TeckosClient) => any;

const useSocket = (): TSocketContext =>
  React.useContext<TSocketContext>(SocketContext);

const SocketProvider = (props: {
  children: React.ReactNode;
  apiUrl: string;
  autoReconnect?: boolean;
}) => {
  const { children, apiUrl, autoReconnect } = props;
  const [socket, setSocket] = useState<TeckosClient>();
  const [connected, setConnected] = useState<boolean>(false);
  const handler = useSocketToDispatch();

  const connect = useCallback(
    (token: string, initialDevice: Partial<Device>): Promise<TeckosClient> => {
      if (!socket) {
        d('Connecting');
        return new Promise<TeckosClient>((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error('Timeout'));
          }, 5000);
          const nSocket = new TeckosClientWithJWT(
            apiUrl,
            {
              reconnection: autoReconnect,
            },
            token,
            {
              device: JSON.stringify(initialDevice),
            }
          );
          if (handler) {
            d('Attaching handler to socket');
            handler(nSocket);
          }
          nSocket.connect();
          nSocket.once('connect', () => {
            clearTimeout(timer);
            d('Connected');
            setSocket(nSocket);
            setConnected(true);
            resolve(nSocket);
          });
          return nSocket;
        });
      }
      throw new Error('Already connected');
    },
    [apiUrl, socket, autoReconnect, handler]
  );

  const disconnect = useCallback(() => {
    if (socket) {
      d('Disconnecting');
      return new Promise<TeckosClient>((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('Timeout'));
        }, 5000);
        socket.once('disconnect', () => {
          clearTimeout(timer);
          resolve();
        });
        socket.close();
      });
    }
    throw new Error('Not connected');
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        connect,
        disconnect,
        connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
SocketProvider.defaultProps = {
  autoReconnect: false,
};
export { SocketProvider };

export default useSocket;
