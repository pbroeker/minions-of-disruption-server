import { Namespace, Server } from 'socket.io';

const sendUserMessage = ({
  adminNamespace,
  playerNamespace,
}: {
  adminNamespace: Namespace;
  playerNamespace: Namespace;
}) => ({
  user,
  message,
  channel,
}: {
  user: { name: string; designatedRoom: number };
  message: string;
  channel: number;
}): void => {
  console.log(`User: sending message ${message} from ${user.name} to ${channel}.`);
  if (channel === 99) {
    console.log('CHANELL 99: user has channel', user, channel);
    playerNamespace.emit('send-user-message', { user: user, message: message, channel: channel });
    adminNamespace.emit('send-user-message', { user: user, message: message, channel: channel });
  } else {
    console.log('CHANELL USER: user has channel', user, channel);
    playerNamespace
      .to(`room${user.designatedRoom}`)
      .emit('send-user-message', { user: user, message: message, channel: channel });
    adminNamespace.emit('send-user-message', { user: user, message: message, channel: channel });
  }
};

export { sendUserMessage };
