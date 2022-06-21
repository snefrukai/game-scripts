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
window.autoEquipmentSwap = function () {
  // change equipment according to combat triangle
  window.enableAutoEquipmentSwap = true
  window.useMaxLvlPrayer = false
  window.useMaxLvlCurseAndAurora = false

  var delaySec = 1
  const equipmentSetMelee = 0
  const equipmentSetRanged = 1
  const equipmentSetMagic = 2
  const enemyTypeMelee = 'melee'
  const enemyTypeRanged = 'ranged'
  const enemyTypeMagic = 'magic'

  // ========================================================================== //
  //

  function addCheckbox(name, varStr, pos, type = 'checkbox') {
    // 感觉调用起来时参数会很复杂？
    var checkbox = document.createElement('input')
    checkbox.type = type
    checkbox.id = varStr

    var label = document.createElement('label')
    label.appendChild(document.createTextNode(name))

    document.querySelector(pos).prepend(label)
    label.prepend(checkbox)

    var checkboxTarget = document.querySelector('#' + varStr) // ? class and ID?
    checkboxTarget.onclick = function () {
      if (checkboxTarget.checked) window[varStr] = true
      else window[varStr] = false
    }
  }

  addCheckbox(
    'auto swap equiment',
    (varStr = Object.keys({ enableAutoEquipmentSwap })[0]),
    (pos = '#header-theme')
  )
  if (window.enableAutoEquipmentSwap) console.log('autoEquipmentSwap enabled')
  setInterval(swapEquimentSet, 1000 * delaySec)

  function swapEquimentSet() {
    if (window.enableAutoEquipmentSwap && combatManager['fightInProgress']) {
      // console.log(enableAutoEquipmentSwap, window.enableAutoEquipmentSwap)
      const playerSet = player.selectedEquipmentSet // in-game func
      const enemyType = combatManager.enemy.attackType // in-game func

      if (enemyType === enemyTypeMelee && playerSet != equipmentSetMagic) {
        player.changeEquipmentSet(equipmentSetMagic)
        if (useMaxLvlPrayer) changePrayers([30, 24]) // 24: "Augury"
        if (useMaxLvlCurseAndAurora) {
          player.toggleCurse(12)
          player.toggleAurora(5)
          // * Curses
          // 4: "BlindingII"
          // 5: "SoulSplitII"
          // 6: "WeakeningII"
          // 8: "AnguishII"
          // 9: "BlindingIII"
          // 10: "SoulSplitIII"
          // 11: "WeakeningIII"
          // 12: "AnguishIII"
          // 13: "Decay"
          // * Auroras
          //         5: "FuryII"
          // 6: "FervorII"
          // 7: "SurgeIII"
          // 8: "ChargedII"
          // 9: "FuryIII"
          // 10: "FervorIII"
          // 11: "ChargedIII"
        }
      } else if (
        enemyType === enemyTypeRanged &&
        playerSet != equipmentSetMelee
      ) {
        player.changeEquipmentSet(equipmentSetMelee)
        if (useMaxLvlPrayer) changePrayers([30, 22]) // 22: "Piety"
      } else if (
        enemyType === enemyTypeMagic &&
        playerSet != equipmentSetRanged
      ) {
        player.changeEquipmentSet(equipmentSetRanged)
        if (useMaxLvlPrayer) changePrayers([30, 23]) // 23: "Rigour"
      }
    }
    // * prayers
    // 30: "Battleheart"
  }

  function changePrayers(activatePrayer = []) {
    for (const i of player.activePrayers.entries()) {
      activatePrayer.includes(i[0]) // if target prayer is active, leave it unchangde
        ? activatePrayer.splice(
            activatePrayer.findIndex((a) => a == i[0]),
            1
          )
        : activatePrayer.unshift(i[0]) // adds to the beginning of array
    }
    for (const i of activatePrayer) player.togglePrayer(i) // in-game func
  }
}

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
function checkNoGathering() {
  if (username && username.includes('NG')) {
    console.log('Detected No Gathering.')
    hideNoGathering()
    console.log('No Gathering skills hidden.')
  }

  function hideNoGathering() {
    // $('#nav-skill-tooltip-1').classList.toggle('d-none')
    // $('#nav-skill-tooltip-0').remove()

    var noGatheringSkills = [
      '#nav-skill-tooltip-0', // woodcutting
      '#nav-skill-tooltip-1', // mining
      '#nav-skill-tooltip-2', // firemaking
      '#nav-skill-tooltip-4', // fishing
      '#nav-skill-tooltip-10', // thiving
      '#nav-skill-tooltip-20', // agility
      '#nav-skill-tooltip-22', // astrology
    ]

    for (var i = 0; i < noGatheringSkills.length; i++) {
      $(noGatheringSkills[i]).remove()
    }
  }
}

// * eat to full hp
window.autoEatToFull_repeat = function (minute = 0.2) {
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

  function repeat(fn = autoEatToFull, count = 60 * 24, minute = 1) {
    let i = 0
    function recur() {
      fn()
      i += 1
      console.log('auto eat', i, 'times, next check in', minute, 'minute')
      setTimeout(function () {
        if (i < count) {
          recur()
        }
      }, 1000 * 60 * minute)
    }
    recur()
  }
  repeat(autoEatToFull, (count = (60 / minute) * 24), (minute = minute))
}
;(function () {
  // * footer
  function loadScript() {
    // Load script after the actual Melvor game has loaded
    if (typeof isLoaded !== typeof undefined && isLoaded) {
      clearInterval(scriptLoader)

      autoEquipmentSwap()
      checkNoGathering()

      const scriptElem = document.createElement('script')
      scriptElem.textContent = `try {(${startSnippets})();} catch (e) {console.log(e);}`
      document.body.appendChild(scriptElem).parentNode.removeChild(scriptElem)
    }
  }

  const scriptLoader = setInterval(loadScript, 250)
})()
