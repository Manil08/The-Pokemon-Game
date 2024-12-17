const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const offset = {
    x: -256,
    y: -24
}

canvas.width = 768
canvas.height = 432

const boundaries = []

collisions.forEach((row, i) => {
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

const image = new Image()
image.src = './img/Route-33.png'

const foregroundImage = new Image()
foregroundImage.src = './img/Route-33-top.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const blackBG = new Image()
blackBG.src = './img/Black_BG.png'

let playerMidX = canvas.width/2 - 64/4
let playerMidY = canvas.height/2 - 32/2

const player = new Sprite({
    position : {
        x: 416,
        // x: playerMidX, // player image width / 4
        y: playerMidY // player image height / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
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
    image: image
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
    y: false,
    x: true,
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

// let fr=0

function animate() {

    window.requestAnimationFrame(animate)

    while(keyStack.length!=0){
        if(keyStack[keyStack.length-1] === 'w' && !keys.w.pressed) keyStack.pop()
        else if (keyStack[keyStack.length-1] === 'd' && !keys.d.pressed) keyStack.pop()
        else if (keyStack[keyStack.length-1] === 'a' && !keys.a.pressed) keyStack.pop()
        else if (keyStack[keyStack.length-1] === 's' && !keys.s.pressed) keyStack.pop()
        else break
    }

    blackBackground.draw()
    background.draw()
    // boundaries.forEach(boundary => {
    //     boundary.draw()
    //     if(rectangularCollision({rectangle1: player, rectangle2: boundary})){
    //         console.log('Collisionnnnnnnnnnn')
    //     }
    // })
    player.draw()
    // console.log(player.frames.val)
    foreground.draw()


    if(!invert.x && (background.position.x === canvas.width - background.width || background.position.x === 0)) invert.x = true
    else if(invert.x && player.position.x === playerMidX) invert.x = false

    if(!invert.y && (background.position.y === canvas.height - background.height || background.position.y === 0)) invert.y = true
    else if(invert.y && player.position.y === playerMidY) invert.y = false

    // if(fr>10){
    //     console.log('frames passed')
    //     fr=0
    // }
    // else fr++

    player.moving = false

    if(keyStack.length != 0){

        player.moving = true

        if(keyStack[keyStack.length-1] === 'w'){

            player.image = player.sprites.up

            for(let i=0; i<boundaries.length; i++){
                const boundary = boundaries[i]
                if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 2
                }}})){
                    // console.log('Collisionnnnnnnnnnn')
                    player.moving = false
                    break
                }
            }
            if(player.moving){
                if(!invert.y) movables.forEach(movable => {movable.position.y += 2})
                else nonmovables.forEach(nonmovable => {nonmovable.position.y -= 2})
            }
        }
        else if (keyStack[keyStack.length-1] === 'd') {

            player.image = player.sprites.right

            for(let i=0; i<boundaries.length; i++){
                const boundary = boundaries[i]
                if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {
                    x: boundary.position.x - 2,
                    y: boundary.position.y
                }}})){
                    // console.log('Collisionnnnnnnnnnn')
                    player.moving = false
                    break
                }
            }
            if(player.moving){
                if(!invert.x) movables.forEach(movable => {movable.position.x -= 2})
                else nonmovables.forEach(nonmovables => {nonmovables.position.x += 2})
            }
        }
        else if (keyStack[keyStack.length-1] === 'a') {

            player.image = player.sprites.left

            for(let i=0; i<boundaries.length; i++){
                const boundary = boundaries[i]
                if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {
                    x: boundary.position.x + 2,
                    y: boundary.position.y
                }}})){
                    // console.log('Collisionnnnnnnnnnn')
                    player.moving = false
                    break
                }
            }
            if(player.moving){
                if(!invert.x) movables.forEach(movable => {movable.position.x += 2})
                else nonmovables.forEach(nonmovables => {nonmovables.position.x -= 2})
            }
        }
        else if (keyStack[keyStack.length-1] === 's') {

            player.image = player.sprites.down

            for(let i=0; i<boundaries.length; i++){
                const boundary = boundaries[i]
                if(rectangularCollision({rectangle1: player, rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 2
                }}})){
                    // console.log('Collisionnnnnnnnnnn')
                    player.moving = false
                    break
                }
            }
            if(player.moving){
                if(!invert.y) movables.forEach(movable => {movable.position.y -= 2})
                else nonmovables.forEach(nonmovables => {nonmovables.position.y += 2})
            }
        }
    }
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
    }
})