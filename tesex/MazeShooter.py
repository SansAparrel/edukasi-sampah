
import pygame
import random
import math

pygame.init()

# =========================
# PENGATURAN GAME
# =========================

WIDTH = 800
HEIGHT = 600
TILE = 40

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("LABYRINTH BATTLE")

clock = pygame.time.Clock()

font = pygame.font.Font(None, 35)
big_font = pygame.font.Font(None, 75)

# WARNA
BLACK = (15, 15, 25)
WHITE = (255, 255, 255)
BLUE = (40, 150, 255)
RED = (255, 65, 65)
GREEN = (40, 220, 100)
GRAY = (75, 75, 90)
YELLOW = (255, 220, 50)
PURPLE = (180, 70, 255)

# =========================
# PETA LABIRIN
# =========================

maze = [
    "####################",
    "#P.....#...........#",
    "###.##.#.#####.###.#",
    "#...##.#.....#.....#",
    "#.####.#####.#####.#",
    "#......#.....#.....#",
    "#.######.##..#.###.#",
    "#........##....#...#",
    "####.##########.#.##",
    "#....#..........#..#",
    "#.####.##########..#",
    "#.................E#",
    "####################"
]

ROWS = len(maze)
COLS = len(maze[0])

# =========================
# POSISI PEMAIN DAN EXIT
# =========================

player = pygame.Rect(0, 0, 25, 25)
exit_rect = pygame.Rect(0, 0, 30, 30)

for y, row in enumerate(maze):
    for x, tile in enumerate(row):

        if tile == "P":
            player.center = (
                x * TILE + TILE // 2,
                y * TILE + TILE // 2
            )

        if tile == "E":
            exit_rect.center = (
                x * TILE + TILE // 2,
                y * TILE + TILE // 2
            )

# =========================
# MUSUH
# =========================

enemies = [
    pygame.Rect(450, 140, 28, 28),
    pygame.Rect(270, 300, 28, 28),
    pygame.Rect(570, 460, 28, 28)
]

enemy_directions = [1, -1, 1]

# =========================
# PROYEKTIL ENERGI
# =========================

bullets = []

# =========================
# STATUS GAME
# =========================

health = 3
game_over = False
game_win = False

shoot_timer = 0

# =========================
# FUNGSI DINDING
# =========================

def get_walls():

    walls = []

    for y, row in enumerate(maze):
        for x, tile in enumerate(row):

            if tile == "#":
                walls.append(
                    pygame.Rect(
                        x * TILE,
                        y * TILE,
                        TILE,
                        TILE
                    )
                )

    return walls


walls = get_walls()

# =========================
# GERAK PEMAIN
# =========================

def move_player(dx, dy):

    player.x += dx

    for wall in walls:
        if player.colliderect(wall):

            if dx > 0:
                player.right = wall.left

            if dx < 0:
                player.left = wall.right

    player.y += dy

    for wall in walls:
        if player.colliderect(wall):

            if dy > 0:
                player.bottom = wall.top

            if dy < 0:
                player.top = wall.bottom


# =========================
# TEMBAKAN MUSUH
# =========================

def enemy_shoot(enemy):

    dx = player.centerx - enemy.centerx
    dy = player.centery - enemy.centery

    distance = math.hypot(dx, dy)

    if distance == 0:
        return

    speed = 4

    vx = dx / distance * speed
    vy = dy / distance * speed

    bullets.append({
        "x": float(enemy.centerx),
        "y": float(enemy.centery),
        "vx": vx,
        "vy": vy
    })


# =========================
# RESET GAME
# =========================

def reset_game():

    global health, game_over, game_win
    global bullets, shoot_timer

    player.center = (60, 60)

    enemies.clear()

    enemies.extend([
        pygame.Rect(450, 140, 28, 28),
        pygame.Rect(270, 300, 28, 28),
        pygame.Rect(570, 460, 28, 28)
    ])

    bullets = []

    health = 3
    game_over = False
    game_win = False
    shoot_timer = 0


# =========================
# GAME LOOP
# =========================

running = True

while running:

    clock.tick(60)

    # EVENT
    for event in pygame.event.get():

        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.KEYDOWN:

            if event.key == pygame.K_r:
                if game_over or game_win:
                    reset_game()

    keys = pygame.key.get_pressed()

    # =====================
    # UPDATE GAME
    # =====================

    if not game_over and not game_win:

        dx = 0
        dy = 0

        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            dx = -4

        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            dx = 4

        if keys[pygame.K_UP] or keys[pygame.K_w]:
            dy = -4

        if keys[pygame.K_DOWN] or keys[pygame.K_s]:
            dy = 4

        move_player(dx, dy)

        # CEK KEMENANGAN

        if player.colliderect(exit_rect):
            game_win = True

        # GERAK MUSUH

        for i, enemy in enumerate(enemies):

            enemy.x += enemy_directions[i] * 2

            if enemy.x < 220 or enemy.x > 650:
                enemy_directions[i] *= -1

        # MUSUH MENEMBAK

        shoot_timer += 1

        if shoot_timer >= 65:

            for enemy in enemies:
                enemy_shoot(enemy)

            shoot_timer = 0

        # GERAK PROYEKTIL

        for bullet in bullets:

            bullet["x"] += bullet["vx"]
            bullet["y"] += bullet["vy"]

        # CEK TABRAKAN PROYEKTIL

        for bullet in bullets[:]:

            bullet_rect = pygame.Rect(
                int(bullet["x"] - 6),
                int(bullet["y"] - 6),
                12,
                12
            )

            if player.colliderect(bullet_rect):

                health -= 1
                bullets.remove(bullet)

                if health <= 0:
                    game_over = True

                continue

            # Proyektil hilang jika mengenai dinding

            if any(bullet_rect.colliderect(wall) for wall in walls):
                bullets.remove(bullet)

            elif (
                bullet["x"] < 0 or bullet["x"] > WIDTH
                or bullet["y"] < 0 or bullet["y"] > HEIGHT
            ):
                bullets.remove(bullet)

        # CEK TABRAKAN DENGAN MUSUH

        for enemy in enemies:

            if player.colliderect(enemy):
                game_over = True

    # =========================
    # GAMBAR BACKGROUND
    # =========================

    screen.fill(BLACK)

    # GAMBAR LABIRIN

    for y, row in enumerate(maze):

        for x, tile in enumerate(row):

            rect = pygame.Rect(
                x * TILE,
                y * TILE,
                TILE,
                TILE
            )

            if tile == "#":
                pygame.draw.rect(screen, GRAY, rect)
                pygame.draw.rect(screen, BLACK, rect, 2)

            else:
                pygame.draw.rect(
                    screen,
                    (25, 30, 45),
                    rect
                )

    # PINTU KELUAR

    pygame.draw.rect(
        screen,
        GREEN,
        exit_rect,
        border_radius=6
    )

    # PEMAIN

    pygame.draw.rect(
        screen,
        BLUE,
        player,
        border_radius=7
    )

    # MUSUH

    for enemy in enemies:

        pygame.draw.rect(
            screen,
            RED,
            enemy,
            border_radius=7
        )

    # PROYEKTIL ENERGI

    for bullet in bullets:

        pygame.draw.circle(
            screen,
            PURPLE,
            (int(bullet["x"]), int(bullet["y"])),
            7
        )

    # =========================
    # TAMPILAN INFORMASI
    # =========================

    health_text = font.render(
        "NYAWA: " + str(health),
        True,
        WHITE
    )

    screen.blit(health_text, (15, 540))

    info = font.render(
        "WASD / ARROW = MOVE",
        True,
        YELLOW
    )

    screen.blit(info, (280, 540))

    # =========================
    # SISTEM KALAH
    # =========================

    if game_over:

        overlay = pygame.Surface((WIDTH, HEIGHT))
        overlay.set_alpha(190)
        overlay.fill(BLACK)

        screen.blit(overlay, (0, 0))

        text = big_font.render(
            "GAME OVER!",
            True,
            RED
        )

        restart = font.render(
            "Tekan R untuk bermain lagi",
            True,
            WHITE
        )

        screen.blit(
            text,
            text.get_rect(center=(WIDTH // 2, 250))
        )

        screen.blit(
            restart,
            restart.get_rect(center=(WIDTH // 2, 330))
        )

    # =========================
    # SISTEM MENANG
    # =========================

    if game_win:

        overlay = pygame.Surface((WIDTH, HEIGHT))
        overlay.set_alpha(190)
        overlay.fill(BLACK)

        screen.blit(overlay, (0, 0))

        text = big_font.render(
            "YOU WIN!",
            True,
            GREEN
        )

        restart = font.render(
            "Tekan R untuk bermain lagi",
            True,
            WHITE
        )

        screen.blit(
            text,
            text.get_rect(center=(WIDTH // 2, 250))
        )

        screen.blit(
            restart,
            restart.get_rect(center=(WIDTH // 2, 330))
        )

    pygame.display.update()


pygame.quit()
