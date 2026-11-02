from pygame import *
'''Required classes'''


#fonts and captions
# FONTS AND CAPTIONS
font.init()

font1 = font.Font(None, 36)
font2 = font.Font(None, 70)

#parent class for sprites
class GameSprite(sprite.Sprite):
  #class constructor
  def __init__(self, player_image, player_x, player_y, player_speed):
      super().__init__()
      #every sprite must store the image property
      self.image = transform.scale(image.load(player_image), (65, 65))
      self.speed = player_speed
      #every sprite must have the rect property – the rectangle it is fitted in
      self.rect = self.image.get_rect()
      self.rect.x = player_x
      self.rect.y = player_y




  def reset(self):
      window.blit(self.image, (self.rect.x, self.rect.y))


class Player(GameSprite):
  def update(self):
      keys = key.get_pressed()
      if keys[K_LEFT] and self.rect.x > 5:
          self.rect.x -= self.speed
      if keys[K_RIGHT] and self.rect.x < win_width - 80:
          self.rect.x += self.speed
      if keys[K_UP] and self.rect.y > 5:
          self.rect.y -= self.speed
      if keys[K_DOWN] and self.rect.y < win_height - 80:
          self.rect.y += self.speed


class Enemy(GameSprite):
  def update(self):
      if self.rect.x <= 470:
         self.direction = "right"
      if self.rect.x >= win_width - 85:
         self.direction = "left"


      if self.direction == "left":
         self.rect.x -= self.speed
      else:
         self.rect.x += self.speed


#class for obstacle sprites
class Wall(sprite.Sprite):
  def __init__(self, color_1, color_2, color_3, wall_x, wall_y, wall_width, wall_height):
      super().__init__()
      self.color_1 = color_1
      self.color_2 = color_2
      self.color_3 = color_3
      self.width = wall_width #lebar dinding
      self.height = wall_height #oanjang dinding
      # picture of the wall — a rectangle of the desired size and color
      self.image = Surface((self.width, self.height))
      self.image.fill((color_1, color_2, color_3))
      # each sprite must store a rect property
      self.rect = self.image.get_rect()
      self.rect.x = wall_x #posisi dinding
      self.rect.y = wall_y
  def draw_wall(self):
      window.blit(self.image, (self.rect.x, self.rect.y))




#Game scene:
win_width = 700
win_height = 500
window = display.set_mode((win_width, win_height))
display.set_caption("Maze")
background = transform.scale(image.load("background.jpg"), (win_width, win_height))




#Game characters:
#ganti packman/player ke kelas Player
packman = Player('hero.png', 5, win_height - 80, 4)
monster = Enemy('cyborg.png', win_width - 80, 280, 2)
final = GameSprite('treasure.png', win_width - 120, win_height - 80, 0)




game = True
#membuat variabel finish
finish = False
clock = time.Clock()
FPS = 60




#music
mixer.init()
mixer.music.load('jungles.ogg')
mixer.music.play()
get = mixer.Sound('money.ogg')
getn = mixer.Sound('kick.ogg')

#labirin/wall

w1 = Wall(0, 102, 51, 100, 100, 10, 250)
w2 = Wall(0, 102, 51, 100, 350, 200, 10)

w3 = Wall(0, 102, 51, 250, 100, 10, 150)
w4 = Wall(0, 102, 51, 350, 250, 200, 10)

w5 = Wall(0, 102, 51, 450, 100, 10, 150)
w6 = Wall(0, 102, 51, 550, 350, 10, 100)

w7 = Wall(0, 102, 51, 650, 150, 10, 200)
w8 = Wall(0, 102, 51, 250, 450, 300, 10)



while game:
    for e in event.get():
        if e.type == QUIT:
            game = False
            result = ""        

    if finish == False:
        window.blit(background, (0, 0))

        # Update pemain dan monster
        packman.update()
        monster.update()

        # Tampilkan treasure
        window.blit(final.image, final.rect)

        # Tampilkan pemain dan monster
        packman.reset()
        monster.reset()

        # Tampilkan dinding
        w1.draw_wall()
        w2.draw_wall()
        w3.draw_wall()
        w4.draw_wall()
        w5.draw_wall()
        w6.draw_wall()
        w7.draw_wall()
        w8.draw_wall()

        # CEK MENANG
        if sprite.collide_rect(packman, final):
            finish = True
            get.play()
            result = "YOU WIN!"

        # CEK KALAH
        elif sprite.collide_rect(packman, monster):
            finish = True
            getn.play()
            result = "YOU LOSE!"

    else:
        window.blit(background, (0, 0))

        if result == "YOU WIN!":
            text_result = font.Font(None, 70).render(
                result, True, (0, 255, 0)
            )
        else:
            text_result = font.Font(None, 70).render(
                result, True, (255, 0, 0)
            )

        window.blit(text_result, (220, 200))

    display.update()
    clock.tick(FPS)
   #perbaiki atau tambahkan bagian ini
    if finish != True:
        window.blit(background,(0, 0))
        packman.update()
        monster.update()
        window.blit(final.image, final.rect)



        packman.reset()
        monster.reset()
        w1.draw_wall()
        w2.draw_wall()
        w3.draw_wall()
        w4.draw_wall()
        w5.draw_wall()
        w6.draw_wall()
        w7.draw_wall()
        w8.draw_wall()


    
    display.update()
    clock.tick(FPS)



