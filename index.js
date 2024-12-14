const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 768
canvas.height = 432

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = './img/Route-33.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

class Sprite {
    constructor({position, velocity, image}){
        this.position = position
        this.image = image
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const background = new Sprite({
    position:{
        x: -304,
        y: -32
    },
    image: image
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

function animate() {

    window.requestAnimationFrame(animate)

    while(keyStack.length!=0){
        if(keyStack[keyStack.length-1] === 'w' && !keys.w.pressed) keyStack.pop()
        else if (keyStack[keyStack.length-1] === 'd' && !keys.d.pressed) keyStack.pop()
        else if (keyStack[keyStack.length-1] === 'a' && !keys.a.pressed) keyStack.pop()
        else if (keyStack[keyStack.length-1] === 's' && !keys.s.pressed) keyStack.pop()
        else break
    }

    background.draw()
    c.drawImage(
        playerImage,
        0,
        0,
        playerImage.width/4,
        playerImage.height,        
        canvas.width/2-playerImage.width/4, // Check
        canvas.height/2-playerImage.height/2,
        playerImage.width/4,
        playerImage.height
    )

    if(keyStack.length != 0){
        if(keyStack[keyStack.length-1] === 'w') background.position.y += 2
        else if (keyStack[keyStack.length-1] === 'd') background.position.x -= 2
        else if (keyStack[keyStack.length-1] === 'a') background.position.x += 2
        else if (keyStack[keyStack.length-1] === 's') background.position.y -= 2   
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
    console.log(keys)
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
    console.log(keys)
})