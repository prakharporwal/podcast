// const ws = new WebSocket("ws://192.168.0.102:8080/ws");

function connectToWS(roomId: string) {
  const ws = new WebSocket("ws://localhost:8080/ws/" + roomId);
  ws.addEventListener("open", () => {
    console.log("open the channel!");
  });

  ws.addEventListener("close", () => {
    console.log("close the channel!");
  });

  ws.addEventListener("error", () => {
    console.log("close the channel!");
  });

  return ws;
}

export { connectToWS };
