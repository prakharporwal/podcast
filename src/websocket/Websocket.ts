const ws = new WebSocket("ws://localhost:8000/ws")

ws.addEventListener('open',()=>{
    console.log("open the channel!")
})

ws.addEventListener('close',()=>{
    console.log("close the channel!")
})

ws.addEventListener('error',()=>{
    console.log("close the channel!")
})

export { ws }

