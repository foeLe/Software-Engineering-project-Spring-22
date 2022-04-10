import asyncio
import websockets

async def hello():
    async with websockets.connect("ws://team-11-app.herokuapp.com:52611") as websocket:
        await websocket.send("Hello world!")
        await websocket.recv()

asyncio.run(hello())