const sendUserMessage = (adminNamespace, io) => ({ user, message }) => {
  console.log(`User: sending message ${message} from ${user.name} to ${user.designatedRoom}.`);
  if (user.designatedRoom === 99) {
    io.emit('send-user-message', { user:user, message: message });
    adminNamespace.emit('send-user-message', { user:user, message: message });
  } else {
    io.sockets.in(`room${user.designatedRoom}`).emit('send-user-message', { user:user, message: message });
    adminNamespace.emit('send-user-message', { user: user, message: message });
  }
};

module.exports = { sendUserMessage }