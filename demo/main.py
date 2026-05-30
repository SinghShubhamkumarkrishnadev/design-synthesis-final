from pynput.keyboard import Controller, Key
import time
import random

keyboard = Controller()

keys = [
    Key.shift,
    Key.ctrl,
    Key.alt
]

while True:
    key = random.choice(keys)

    keyboard.press(key)
    keyboard.release(key)

    interval = random.randint(30, 120)

    print(f"Pressed {key}. Next action in {interval} seconds.")
    time.sleep(interval)