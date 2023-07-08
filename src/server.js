const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const pty = require("node-pty");

app.use(express.static(__dirname));

io.on("connection", function (socket) {
  console.log("a user connected");

  const shell = pty.spawn(
    process.platform === "win32" ? "cmd.exe" : "bash",
    [],
    {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    }
  );

  shell.onData((data) => {
    socket.emit("output", data);
  });

  socket.on("input", (data) => {
    shell.write(data);
  });

  socket.on("resize", (size) => {
    shell.resize(size.cols, size.rows);
  });

  socket.on("disconnect", () => {
    shell.kill();
    console.log("user disconnected");
  });
});

server.listen(3000, function () {
  console.log("listening on *:3000");
});
