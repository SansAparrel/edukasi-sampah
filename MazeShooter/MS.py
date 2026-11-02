import pygame
import random
import sys

pygame.init()

#Screen
width = 800
height = 600
tile = 40
screen = pygame.display.set_mode((width, height))

#FPS
clock = pygame.time.Clock()

#font
font = pygame.font.Font(None, 35)
big_font = pygame.font.Font(None, 75)

#warna
black = (15, 15, 25)
white = (225, 225, 225)
blue = (40, 150, 225)
red = (225, 65, 65)
green = (40, 220, 100)
gray = (75, 75, 90)
yellow = (225, 220. 50)
purple = (180, 70, 225)



