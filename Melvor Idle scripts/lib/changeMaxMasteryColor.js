autoChangeMaxMasteryColor()

function autoChangeMaxMasteryColor(params) {
  var t = [
    'built-agility-obstacle .m-1.font-w600',
    'agility-obstacle-selection .font-w600.text-combat-smoke.ml-2 span',
  ]

  setInterval(() => {
    t.forEach((e) => changeMaxMasteryColor(e))
  }, 1000)

  // ========================================================================== //
  //

  function changeMaxMasteryColor(selector) {
    var str = document.querySelectorAll(selector)
    str.forEach((e) => {
      var color = ''
      color = e.textContent == 99 ? 'white' : 'red'
      e.style.color = color
      // if (e.textContent < 99) e.style.color = 'red'
    })
  }
}
