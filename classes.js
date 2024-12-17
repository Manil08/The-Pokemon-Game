class Sprite {
    constructor({position, velocity, image, frames = {max:1}, sprites }){
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () => {
            this.width = this.image.width/this.frames.max
            this.height = this.image.height
            console.log(this.width)
            console.log(this.height)
        }
        this.moving = false
        this.sprites = sprites
    }

    draw(){
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width/this.frames.max,
            this.image.height,        
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max,
            this.image.height
        )

        if(!this.moving) return

        if(this.frames.max > 1) this.frames.elapsed++

        if(this.frames.elapsed===4){
            this.frames.val = (this.frames.val + 1) % this.frames.max
            this.frames.elapsed = 0
        }

    }
    
}

class Boundary {
    static width = 16
    static height = 16
    constructor({position}){
        this.position = position
        this.width = 16
        this.height = 16
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}