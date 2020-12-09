const sendUserMessage = (adminNamespace, io) => ({ user, message, channel }) => {
  console.log(`User: sending message ${message} from ${user.name} to ${channel}.`);
  if (channel = 99) {
    io.emit('send-user-message', { user:user, message: message, channel: channel });
    adminNamespace.emit('send-user-message', { user:user, message: message, channel: channel });
  } else {
    io.sockets.in(`room${user.designatedRoom}`).emit('send-user-message', { user:user, message: message, channel: channel });
    adminNamespace.emit('send-user-message', { user: user, message: message, channel: channel });
  }
};

module.exports = { sendUserMessage }