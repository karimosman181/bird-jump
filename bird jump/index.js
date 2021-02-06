document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const bird = document.createElement('div')
  let isGameOver = false
  let speed = 3
  let platformCount = 5
  let platforms = []
  let score = 0
  let birdLeftSpace = 50
  let startPoint = 150
  let birdBottomSpace = startPoint
  const gravity = 0.9
  let upTimerId
  let downTimerId
  let isJumping = true
  let isGoingLeft = false
  let isGoingRight = false
  let leftTimerId
  let rightTimerId

  class Platform {
    constructor(newPlatBottom) {
      this.left = Math.random() * 315
      this.bottom = newPlatBottom
      this.visual = document.createElement('div')

      const visual = this.visual
      visual.classList.add('platform')
      visual.style.left = this.left + 'px'
      visual.style.bottom = this.bottom + 'px'
      grid.appendChild(visual)
    }
  }


  function createPlatforms() {
    for(let i =0; i < platformCount; i++) {
      let platGap = 600 / platformCount
      let newPlatBottom = 100 + i * platGap
      let newPlatform = new Platform (newPlatBottom)
      platforms.push(newPlatform)
      console.log(platforms)
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
        platforms.forEach(platform => {
          platform.bottom -= 4
          let visual = platform.visual
          visual.style.bottom = platform.bottom + 'px'

          if(platform.bottom < 10) {
            let firstPlatform = platforms[0].visual
            firstPlatform.classList.remove('platform')
            platforms.shift()
            console.log(platforms)
            score++
            var newPlatform = new Platform(600)
            platforms.push(newPlatform)
          }
      })
    }

  }

  function createbird() {
    grid.appendChild(bird)
    bird.classList.add('bird')
    birdLeftSpace = platforms[0].left
    bird.style.left = birdLeftSpace + 'px'
    bird.style.bottom = birdBottomSpace + 'px'
  }

function fall() {
  isJumping = false
    clearInterval(upTimerId)
    downTimerId = setInterval(function () {
      birdBottomSpace -= 5
      bird.style.bottom = birdBottomSpace + 'px'
      if (birdBottomSpace <= 0) {
        gameOver()
      }
      platforms.forEach(platform => {
        if (
          (birdBottomSpace >= platform.bottom) &&
          (birdBottomSpace <= (platform.bottom + 15)) &&
          ((birdLeftSpace + 60) >= platform.left) &&
          (birdLeftSpace <= (platform.left + 85)) &&
          !isJumping
          ) {
            console.log('tick')
            startPoint = birdBottomSpace
            jump()
            console.log('start', startPoint)
            isJumping = true
          }
      })

    },20)
}

  function jump() {
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(function () {
      console.log(startPoint)
      console.log('1', birdBottomSpace)
      birdBottomSpace += 20
      bird.style.bottom = birdBottomSpace + 'px'
      console.log('2',birdBottomSpace)
      console.log('s',startPoint)
      if (birdBottomSpace > (startPoint + 200)) {
        fall()
        isJumping = false
      }
    },30)
  }

  function moveLeft() {
    if (isGoingRight) {
        clearInterval(rightTimerId)
        isGoingRight = false
    }
    isGoingLeft = true
    leftTimerId = setInterval(function () {
        if (birdLeftSpace >= 0) {
          console.log('going left')
          birdLeftSpace -=5
           bird.style.left = birdLeftSpace + 'px'
        } else moveRight()
    },20)
  }

  function moveRight() {
    if (isGoingLeft) {
        clearInterval(leftTimerId)
        isGoingLeft = false
    }
    isGoingRight = true
    rightTimerId = setInterval(function () {
      //changed to 313 to fit doodle image
      if (birdLeftSpace <= 313) {
        console.log('going right')
        birdLeftSpace +=5
        bird.style.left = birdLeftSpace + 'px'
      } else moveLeft()
    },20)
  }

  function moveStraight() {
    isGoingLeft = false
    isGoingRight = false
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }

  //assign functions to keyCodes
  function control(e) {
    bird.style.bottom = birdBottomSpace + 'px'
    if(e.key === 'ArrowLeft') {
      moveLeft()
    } else if (e.key === 'ArrowRight') {
      moveRight()
    } else if (e.key === 'ArrowUp') {
      moveStraight()
    }
  }

  function gameOver() {
    isGameOver = true
    while (grid.firstChild) {
      console.log('remove')
      grid.removeChild(grid.firstChild)
    }
    grid.innerHTML = score
    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }


  function start() {
    if (!isGameOver) {
      createPlatforms()
      createbird()
      setInterval(movePlatforms,30)
      jump(startPoint)
      document.addEventListener('keyup', control)
    }
  }
  start()
})
