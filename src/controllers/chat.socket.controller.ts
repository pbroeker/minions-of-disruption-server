const sendUserMessage = (adminNamespace, io) => ({ user, message, channel }) => {
  console.log(`User: sending message ${message} from ${user.name} to ${channel}.`);
  if (channel === 99) {
    console.log('CHANELL 99: user has channel', user, channel);
    io.emit('send-user-message', { user:user, message: message, channel: channel });
    adminNamespace.emit('send-user-message', { user:user, message: message, channel: channel });
  } else {
    console.log('CHANELL USER: user has channel', user, channel);
    io.to(`room${user.designatedRoom}`).emit('send-user-message', { user: user, message: message, channel: channel });
    adminNamespace.emit('send-user-message', { user: user, message: message, channel: channel });
  }
};

export { sendUserMessage };
