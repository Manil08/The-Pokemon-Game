const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let selectedMap = Route33
let selectedPlayer = Player1

const offset = {
    x: selectedMap.mapOffset.x,
    y: selectedMap.mapOffset.y
}

canvas.width = 768
canvas.height = 432

const boundaries = []

selectedMap.collisions.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1){
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const backgroundImage = selectedMap.backgroundImage
const foregroundImage = selectedMap.foregroundImage

const blackBG = new Image()
blackBG.src = './img/Black_BG.png'

let playerMidX = canvas.width/2 - 64/4
let playerMidY = canvas.height/2 - 32/2

let playerX = selectedMap.playerOffset.x
let playerY = selectedMap.playerOffset.y
if(playerX == -1000) playerX = playerMidX
if(playerY == -1000) playerY = playerMidY

const player = new Sprite({
    position : {
        x: playerX,
        y: playerY
    },
    image: selectedPlayer.image.down,
    frames: {
        max: 4
    },
    sprites: {
        up: selectedPlayer.image.up,
        down: selectedPlayer.image.down,
        left: selectedPlayer.image.left,
        right: selectedPlayer.image.right
    } 
})

const blackBackground = new Sprite({
    position:{
        x:0,
        y:0
    },
    image: blackBG
})

const background = new Sprite({
    position:{
        x: offset.x,
        y: offset.y
    },
    image: backgroundImage
})

const foreground = new Sprite({
    position:{
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

let keyStack = []

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let invert = {
    x: selectedMap.inversions.x,
    y: selectedMap.inversions.y,
}

const movables = [background, ...boundaries, foreground]
const nonmovables = [player]

function rectangularCollision({rectangle1, rectangle2}){
    return (
        rectangle1.position.x + rectangle1.width > rectangle2.position.x && 
        rectangle1.position.x < rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height - 16 < rectangle2.position.y + rectangle2.height && // check
        rectangle1.position.y + rectangle1.height > rectangle2.position.y
    )
}

let frame = 0
let frameSpeed = selectedPlayer.playerFrameSpeed

let moves = {
    up: 0,
    down: 0,
    left: 0,
    right: 0
}

let face = {
    up: false,
    down: true,
    right: false,
    left: false
}

function animate() {

    window.requestAnimationFrame(animate)

    if(frame === 0){

        blackBackground.draw()
        background.draw()
        player.draw()
        foreground.draw()

        if(!invert.x && (background.position.x === canvas.width - background.width || background.position.x === 0)) invert.x = true
        else if(invert.x && player.position.x === playerMidX) invert.x = false

        if(!invert.y && (background.position.y === canvas.height - background.height || background.position.y === 0)) invert.y = true
        else if(invert.y && player.position.y === playerMidY) invert.y = false

        if(moves.up == 0 && moves.down == 0 && moves.right == 0 && moves.left == 0){

            while(keyStack.length!=0){
                if(keyStack[keyStack.length-1] === 'w' && !keys.w.pressed) keyStack.pop()
                else if (keyStack[keyStack.length-1] === 'd' && !keys.d.pressed) keyStack.pop()
                else if (keyStack[keyStack.length-1] === 'a' && !keys.a.pressed) keyStack.pop()
                else if (keyStack[keyStack.length-1] === 's' && !keys.s.pressed) keyStack.pop()
                else break
            }

            player.moving = false

            if(keyStack.length != 0){

                player.moving = true

                if(keyStack[keyStack.length-1] === 'w'){

                    player.image = player.sprites.up
                    
                    if(face.up){
                        for(let i=0; i<boundaries.length; i++){
                            const boundary = boundaries[i]
                            if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {
                                x: boundary.position.x,
                                y: boundary.position.y + 2
                            }}})){
                                player.moving = false
                                break
                            }
                        }
                        if(player.moving){
                            if(!invert.y) movables.forEach(movable => {movable.position.y += 2})
                            else nonmovables.forEach(nonmovable => {nonmovable.position.y -= 2})
                            moves.up += 2
                        }
                    }
                    else{
                        face = { up: false, down: false, right: false, left: false };
                        face.up = true
                    }

                }
                else if (keyStack[keyStack.length-1] === 'd') {

                    player.image = player.sprites.right

                    if(face.right){
                        for(let i=0; i<boundaries.length; i++){
                            const boundary = boundaries[i]
                            if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {
                                x: boundary.position.x - 2,
                                y: boundary.position.y
                            }}})){
                                player.moving = false
                                break
                            }
                        }
                        if(player.moving){
                            if(!invert.x) movables.forEach(movable => {movable.position.x -= 2})
                            else nonmovables.forEach(nonmovables => {nonmovables.position.x += 2})
                            moves.right += 2
                        }
                    }
                    else{
                        face = { up: false, down: false, right: false, left: false };
                        face.right = true
                    }
                    
                }
                else if (keyStack[keyStack.length-1] === 'a') {

                    player.image = player.sprites.left

                    if(face.left){
                        for(let i=0; i<boundaries.length; i++){
                            const boundary = boundaries[i]
                            if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {
                                x: boundary.position.x + 2,
                                y: boundary.position.y
                            }}})){
                                player.moving = false
                                break
                            }
                        }
                        if(player.moving){
                            if(!invert.x) movables.forEach(movable => {movable.position.x += 2})
                            else nonmovables.forEach(nonmovables => {nonmovables.position.x -= 2})
                            moves.left += 2
                        }
                    }
                    else{
                        face = { up: false, down: false, right: false, left: false };
                        face.left = true
                    }
                    
                }
                else if (keyStack[keyStack.length-1] === 's') {

                    player.image = player.sprites.down

                    if(face.down){
                        for(let i=0; i<boundaries.length; i++){
                            const boundary = boundaries[i]
                            if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {
                                x: boundary.position.x,
                                y: boundary.position.y - 2
                            }}})){
                                player.moving = false
                                break
                            }
                        }
                        if(player.moving){
                            if(!invert.y) movables.forEach(movable => {movable.position.y -= 2})
                            else nonmovables.forEach(nonmovables => {nonmovables.position.y += 2})
                            moves.down += 2
                        }
                    }
                    else{
                        face = { up: false, down: false, right: false, left: false };
                        face.down = true
                    }
                }
            }
        }
        else if(moves.up > 0){
            moves.up = (moves.up + 2) % 16
            if(!invert.y) movables.forEach(movable => {movable.position.y += 2})
            else nonmovables.forEach(nonmovable => {nonmovable.position.y -= 2})
        }
        else if(moves.down > 0){
            moves.down = (moves.down + 2) % 16
            if(!invert.y) movables.forEach(movable => {movable.position.y -= 2})
            else nonmovables.forEach(nonmovables => {nonmovables.position.y += 2})
        }
        else if(moves.right > 0){
            moves.right = (moves.right + 2) % 16
            if(!invert.x) movables.forEach(movable => {movable.position.x -= 2})
            else nonmovables.forEach(nonmovables => {nonmovables.position.x += 2})
        }
        else{
            moves.left = (moves.left + 2) % 16
            if(!invert.x) movables.forEach(movable => {movable.position.x += 2})
            else nonmovables.forEach(nonmovables => {nonmovables.position.x -= 2})
        }
        if(frameSpeed != 0) frame++
    }
    else if(frame === frameSpeed) frame = 0
    else frame++
}

animate()

window.addEventListener('keydown', (e) =>{
    switch (e.key){
        case 'w':
            keys.w.pressed = true
            if(keyStack.length != 0 || keyStack[keyStack.length-1] != 'w') keyStack.push('w');
            break
        case 'a':
            keys.a.pressed = true
            if(keyStack.length != 0 || keyStack[keyStack.length-1] != 'a') keyStack.push('a');
            break
        case 's':
            keys.s.pressed = true
            if(keyStack.length != 0 || keyStack[keyStack.length-1] != 's') keyStack.push('s');
            break
        case 'd':
            keys.d.pressed = true
            if(keyStack.length != 0 || keyStack[keyStack.length-1] != 'd') keyStack.push('d');
            break
        case 'z':
            frame = 0
            frameSpeed = 0
            break
    }
})

window.addEventListener('keyup', (e) =>{
    switch (e.key){
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
        case 'z':
            frame = 0
            frameSpeed = selectedPlayer.playerFrameSpeed
            break
    }
})