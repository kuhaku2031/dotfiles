#!/bin/sh

# systray battery icon
cbatticon -u 5 &

# systray volume
volumeicon &

# keymaps
setxkbmap es

# Set wallpaper

feh --bg-scale -g 1366x768 ~/Downloads/wallpapers/d.jpg

# Set Opacity Terminal

picom &
