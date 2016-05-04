'use strict'
const dom = require('dom-events')
const debounce = require('debounce')

//
// Loaded when the player starts and the DOM is ready...
//
module.exports = function visualizerPlugin() {
  
  let visualizerEnabled = false

  //
  // create some dom objects...
  //
  const overlay = document.createElement('div')
  const inner = document.createElement('canvas')

  //
  // create some style by hand. alternatively, if we had a lot of css
  // we could inject it directly into the document with a script tag...
  //
  overlay.style.position = 'absolute'
  overlay.style.top = '0px'
  overlay.style.bottom = '0px'
  overlay.style.left = '0px'
  overlay.style.right = '0px'
  overlay.style.opacity = 0
  overlay.style.transition = 'all .6s ease'
  overlay.style.zIndex = -1
  overlay.style.backgroundColor = 'black'

  overlay.appendChild(inner)
  document.body.appendChild(overlay)

  //
  // listen for "control+t" and show or hide the visualization
  //
  dom.on(window, 'keydown', (event) => {
    if (event.keyCode === 84 && event.ctrlKey) {
      const eventName

      if (visualizerEnabled) {
        overlay.style.zIndex = -1
        overlay.style.opacity = 0
        eventName = 'controls:visualizer:disable'
      } else {
        overlay.style.zIndex = '1000'
        overlay.style.opacity = 1
        eventName ='controls:visualizer:enable'
      }

      window.events.emit(eventName)
      visualizerEnabled = !visualizerEnabled
    }
  })

  //
  // normalize the time domain data
  //
  function normalize(source, c) {

    const coef = c || 1
    const result = []
    const ratio = Math.max.apply(Math, source)
    const l = source.length

    for (let i = 0; i < l; i++) {
      if (source[i] == 0) {
        result[i] = 0
      } else {
        result[i] = (source[i] / ratio) * coef
      }
    }
    return result
  }

  //
  // We could do d3 or svg etc, canvas is quick and easy...
  //
  const ctx = inner.getContext('2d')

  window.events.on('controls:visualizer:data', (data) => {

    const tdd = data.byteTimeDomainData

    const w = overlay.clientWidth
    const h = overlay.clientHeight

    inner.setAttribute('width', w)
    inner.setAttribute('height', h)

    ctx.fillStyle = '#ede1c5'
    ctx.clearRect(0, 0, w, h)

    for (let i = 0; i < tdd.length; i++ ){
      const value = tdd[i]
      ctx.fillRect(i, (h / 1.5) - value, 1, 1)
    }

  })
}

