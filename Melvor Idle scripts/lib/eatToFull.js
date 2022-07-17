// * eat to full hp
window.autoEatToFull_repeat = function (sec = 1) {
  let hp = {
    current: 0,
    max: 1,
    food: 0,
  }
  let hpSelector = {
    current: '#combat-player-hitpoints-current',
    max: '#combat-player-hitpoints-max',
  }
  var activeFoodSelector = '#combat-food-container .text-combat-smoke'

  function autoEatToFull(params) {
    var hpSelectorArr = Object.entries(hpSelector)
    for (let i = 0; i < hpSelectorArr.length; i++) {
      let str = $(hpSelectorArr[i][1])[0].textContent
      hp[hpSelectorArr[i][0]] = getInt(str)
      // console.log(str)
    }

    var foodSrc = $(activeFoodSelector)[0].childNodes[1]['src']
    var foodName = foodSrc.match(/\w+\.\w+$/g)[0] // match return array
    hp['food'] = getInt($(activeFoodSelector)[0].childNodes[2].textContent)
    // console.log(foodName)

    var hpLoss = hp['max'] - hp['current']
    var eatFoodAmount = Math.floor(hpLoss / hp['food'])
    if (hpLoss > 0) {
      for (let i = 0; i < eatFoodAmount; i++) {
        $('#combat-footer-minibar-eat-btn').click()
      }
      console.log('hp loss:', hpLoss, ', ate *', eatFoodAmount, foodName)
    } else {
      console.log('hp full')
    }
  }

  function getInt(str) {
    var numb = Number(str.replace(/\D+/g, ''))
    return numb
  }

  function repeat(fn = autoEatToFull, count = 60 * 24, sec = 10) {
    let i = 0
    function recur() {
      fn()
      i += 1
      console.log('auto eat', i, 'times, next check in', sec, 'sec')
      setTimeout(function () {
        if (i < count) {
          recur()
        }
      }, 1000 * sec)
    }
    recur()
  }
  repeat(autoEatToFull, (count = (3600 / sec) * 24 * 10), (sec = sec))
}

// autoEatToFull_repeat() // ! test
