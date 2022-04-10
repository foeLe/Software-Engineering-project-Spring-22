import asyncio
import websockets
import random
import time

def main():
    print('this program will generate some test traffic for 2 players on the red ')
    print('team as well as 2 players on the green team')
    print('')

    red1 = input('Enter id of red player 1 ==> ')
    red2 = input('Enter id of red player 2 ==> ')
    green1 = input('Enter id of green player 1 ==> ')
    green2 = input('Enter id of green player 2 ==> ')

    print('')
    counter = input('How many events do you want ==> ')

    i = 1
    while i < int(counter):
        if random.randint(1,2) == 1:
            redplayer = red1
        else:
            redplayer = red2

        if random.randint(1,2) == 1:
            greenplayer = green1
        else: 
            greenplayer = green2	

        if random.randint(1,2) == 1:
            message = redplayer + ":" + greenplayer
        else:
            message = greenplayer + ":" + redplayer

        print(message)
        i+=1
        asyncio.run(send(message))
        time.sleep(random.randint(1,3))


async def send(data):
    async with websockets.connect("wss://team-11-app.herokuapp.com") as websocket:
        await websocket.send(data)
        await websocket.recv()

if(__name__=="__main__"):main()