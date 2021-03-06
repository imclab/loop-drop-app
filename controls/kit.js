var h = require('hyperscript')
var ever = require('ever')

var EventEmitter = require('events').EventEmitter

module.exports = function(noteStream, changeStream){

  var elements = []
  var selectedElement = null

  for (var i=0;i<64;i++){
    var element = h('div', {'data-id': i, 'draggable': true})
    elements.push(element)
  }

  var kit = h('div.Kit', elements)

  kit.events = new EventEmitter()
  kit.on = function(event, cb){
    return kit.events.on(event, cb)
  }

  noteStream.on('data', function(event){
    var element = elements[event.data[1]]
    if (element){
      if (event.data[2]){
        element.classList.add('-active')
      } else {
        element.classList.remove('-active')
      }
    }
  })

  changeStream.on('data', function(sound){
    var element = elements[sound.id]
    if (sound.source){
      element.classList.add('-present')
    } else {
      element.classList.remove('-present')
    }
  })

  kit.select = function(id){
    if (selectedElement){
      selectedElement.classList.remove('-selected')
    }
    selectedElement = elements[id]
    selectedElement.classList.add('-selected')
    kit.events.emit('select', id)
  }

  kit.deselect = function(){
    if (selectedElement){
      selectedElement.classList.remove('-selected')
      selectedElement = null
    }
  }

  ever(kit).on('mousedown', function(e){
    if (e.srcElement.getAttribute('data-id') != null){
      kit.select(e.srcElement.getAttribute('data-id'))
    }
  })

  return kit
}