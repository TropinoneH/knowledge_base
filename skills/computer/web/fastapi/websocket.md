# WebSocket

## installation

```bash
pip install websocket
```

## usage

### simple usage

receive text, and send back text. but web socket must receive text before send, because web socket needs to know whether the connection is still connected.

```python
import websocket

@app.socket("/sockets")
async def socket():
    await websocket.accept() # wait the connection request
    while True:
        text = await websocket.receive_text()
        if text == "Exit": # or anything else
            websocket.close()
            break
        await websocket.send_text(f"Hi, {text}")
```

### send with binary code

```python
@app.socket("/bin_socket")
async def bin_socket():
    await websocket.accept()
    while True:
        bin = await websocket.receive_bytes()
        if bin == b"":
            websocket.close()
            break
        do_something_with(bin)
        websocket.send_text("Receive!")
```

# Frontend

just use `ahooks` as example

```tsx
import {useWebSocket} from "ahooks"

export default () => {
    // useWebSocket will auto connect to the socket. socket url should start by `ws://` or `wss://`
    const {sendMessage, connect, disconnect, readyState} = useWebSocket(`ws://${baseURL}/sockets`, {
        onError: (err) => {
            console.error(err)
        },
        onMessage: (event) => {
            console.log(event.data)
            sendMessage("continue")
        }
    })

    useEffect(() => {
        if (readyState === WebSocket.OPEN) sendMessage("TropinoneH")
    }, [readyState, sendMessage])

    useEffect(() => {
        return () => {
            disconnect() // disconnect websocket when the component unmount
        }
    })
}
```
