export function registerSocketHandlers(io) {
  io.on("connection", socket => {
    socket.on("join:customer", userId => {
      if (userId) socket.join(`customer:${userId}`);
    });
    socket.on("join:admin", () => socket.join("admin"));
  });
}