const backgroundImageRoute33 = new Image()
backgroundImageRoute33.src = './img/Route-33.png'

const foregroundImageRoute33 = new Image()
foregroundImageRoute33.src = './img/Route-33-top.png'

const Route33 = {
    mapOffset : {
        x: -256,
        y: -24
    },
    playerOffset : {
        x: 416,
        y: -1000
    },
    inversions : {
        x: true,
        y: false
    },
    collisions: Route33collisions,
    backgroundImage: backgroundImageRoute33,
    foregroundImage: foregroundImageRoute33
}