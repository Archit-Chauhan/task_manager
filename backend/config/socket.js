export let io;

export const initSocket = (server) => {
  const { Server } = await import("socket.io");
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", socket => {
    socket.on("join", userId => socket.join(userId));
  });
};
