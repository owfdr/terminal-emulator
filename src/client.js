const socket = io.connect();

const term = new Terminal();
term.open(document.getElementById("terminal"));

const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
fitAddon.fit();

term.onData((data) => socket.emit("input", data));

socket.on("output", (data) => term.write(data));

function resizeTerminal() {
  fitAddon.fit();
  socket.emit("resize", { cols: term.cols, rows: term.rows });
}

window.addEventListener("resize", resizeTerminal);

resizeTerminal();
