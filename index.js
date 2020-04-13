const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const roomMembers = {};
io.on("connection", function (socket) {
  console.log("a user connected");
  socket.on("join", (m) => {
    console.log(`${m.id} join to ${m.room}`);
    socket.join(m.room);
    if (!roomMembers[m.room] || m.createNew) {
      roomMembers[m.room] = 0;
    }
    roomMembers[m.room]++;
    socket.emit("joined", { numOfPeople: roomMembers[m.room] });
    socket.to(m.room).on("signal", (m) => {
      io.to(m.room).emit("signal", {
        id: m.id,
        room: m.room,
        signalData: m.signalData,
      });
    });
  });
});

const port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log(`listening on *:${port}`);
});
