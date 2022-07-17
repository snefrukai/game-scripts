// ==UserScript==
// @name         Melvor Idle - Snippet
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       snefrukai
// @match                 *://melvoridle.com/*
// @match                 *://www.melvoridle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// // @require      https://raw.githubusercontent.com/snefrukai/game-scripts/main/Melvor%20Idle%20scripts/src/equipmentSwap.js
// @grant        none
// ==/UserScript==

// * change equipment according to combat triangle

// * upgrade selected item by item ID at set interval
window.upgradeItem_repeat = function (itemID, fn, count, minute) {
  function upgradedItemID(itemID) {
    return items[itemID].trimmedItemID
  }

  // function upgrade(itemID, qty) {
  //   confirmUpgradeItem(itemID, upgradedItemID(itemID), qty)
  // }

  // ! func name 'upgradeItemAll' could cause freeze in tampermonkley
  function upgradeAll(itemID) {
    for (let k = 0; k < itemID.length; k++) {
      confirmUpgradeItemAll(itemID[k], upgradedItemID(itemID[k]))
      console.log('upgrading item ID', itemID[k])
    }
  }

  function repeat(itemID, fn = upgradeAll, count = 10000, minute = 5) {
    let i = 0
    function recur() {
      fn(itemID)
      i += 1
      console.log('upgraded', i, 'times')
      setTimeout(function () {
        if (i < count) {
          recur()
        }
      }, 1000 * 60 * minute)
    }
    recur()
  }

  repeat(
    (itemID = [
      768, // air shard
      769, // water ...
      770, // earth ...
      771, // fire ...
      // 890, // mys stone
      // 886, // mys stone charge
    ])
  )
}

// * hide no gathering account's skills
window.checkNoGathering = function () {
  var noGatheringSkills = [
    0, // woodcutting
    1, // mining
    2, // firemaking
    4, // fishing
    10, // thiving
    20, // agility
    22, // astrology
  ]

  if (username && username.includes('NG')) {
    console.log('Detected "No Gathering".')

    noGatheringSkills.forEach((skill) => {
      $('#nav-skill-tooltip-' + skill.toString()).remove()

      // in-game func
      if (skillsUnlocked[skill] != false) {
        skillsUnlocked[skill] = false
        forceStopSkill(skill)
        if (
          PAGES[currentPage].skillID !== undefined &&
          PAGES[currentPage].skillID === skill
        )
          changePage(Pages.Bank)
        if (defaultPageOnLoad === skill)
          changeSetting(2, Pages.Bank, false, false)
        updateSkillWindow(skill) // update ui
        updateSkillLevelCap()
      }
    })

    console.log('"No Gathering" skills locked and hidden.')
  }
}

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

// * add mastery pool xp to skill after overnight

window.addPoolXPForCount = function (skillID, count, sec = 30) {
  var i = 0
  var checkPool = setInterval(() => {
    checkPoint = parseFloat(
      document.querySelector('.mastery-pool-xp-progress-15').textContent
    )
    // if (checkPoint < 95.5) {
    addMasteryXPToPool(skillID, 4046897, false, true)
    i = i + 1
    console.log('add pool xp:', Skills[skillID], i, 'times')
    if (i == count) {
      clearInterval(checkPool)
      console.log('add pool xp: finished')
    }
    // }
  }, 1000 * sec)
}
;(function () {
  // * footer
  function loadScript() {
    // Load script after the actual Melvor game has loaded
    if (typeof isLoaded !== typeof undefined && isLoaded) {
      clearInterval(scriptLoader)

      // autoEquipmentSwap()
      checkNoGathering()
      addPoolXPForCount()

      const scriptElem = document.createElement('script')
      scriptElem.textContent = `try {(${startSnippets})();} catch (e) {console.log(e);}`
      document.body.appendChild(scriptElem).parentNode.removeChild(scriptElem)
    }
  }

  const scriptLoader = setInterval(loadScript, 250)
})()
