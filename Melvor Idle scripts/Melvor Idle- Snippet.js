// ==UserScript==
// @name         Melvor Idle - Snippet
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       snefrukai
// @match                 *://melvoridle.com/*
// @match                 *://www.melvoridle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// @grant        none
// ==/UserScript==

;((main) => {
  const script = document.createElement('script')
  script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`
  document.body.appendChild(script).parentNode.removeChild(script)
})(() => {
  function startSnippets() {
    window.snippet = {
      name: '',
      log: (...args) => console.log('Snippets:', ...args),
      start: () => snippet.log(`Loading ${snippet.name}.`),
      end: () => snippet.log(`Loaded ${snippet.name}.`),
    }

    // * header end

    // ========================================================================== //
    // * upgradeItem_repeat.js
    // ========================================================================== //

    snippet.name = 'upgradeItem_repeat.js'
    snippet.start()
    // * start of copy code

    // auto upgrade selected item by item ID at set interval

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

      repeat(itemID)
    }

    upgradeItem_repeat([
      768, // air shard
      769, // water ...
      770, // earth ...
      771, // fire ...
      // 890, // mys stone
      // 886, // mys stone charge
    ])

    // * end of copy code
    snippet.end()

    // ========================================================================== //
    // * noGathering.js
    // ========================================================================== //

    snippet.name = 'noGathering.js'
    snippet.start()
    // * start of copy code

    // hide no gathering account's skills

    function checkNoGathering() {
      if (username && username.includes('NG')) {
        console.log('Detected No Gathering.')
        hideNoGathering()
        console.log('No Gathering skills hidden.')
      }

      function hideNoGathering() {
        // $('#nav-skill-tooltip-1').classList.toggle('d-none')
        // $('#nav-skill-tooltip-0').remove()
        var noGathering = [
          '#nav-skill-tooltip-0', // woodcutting
          '#nav-skill-tooltip-1', // mining
          '#nav-skill-tooltip-2', // firemaking
          '#nav-skill-tooltip-4', // fishing
          '#nav-skill-tooltip-10', // thiving
          '#nav-skill-tooltip-20', // agility
          '#nav-skill-tooltip-22', // astrology
        ]
        for (var i = 0; i < noGathering.length; i++) {
          $(noGathering[i]).remove()
        }
      }
    }

    checkNoGathering()

    // * end of copy code
    snippet.end()

    // ========================================================================== //
    // * autoEatToFull_repeat.js
    // ========================================================================== //

    snippet.name = 'autoEatToFull_repeat.js'
    snippet.start()
    // * start of copy code

    // auto eat to full hp

    window.autoEatToFull_repeat = function (params) {
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
      repeat()
    }

    autoEatToFull_repeat()

    // * end of copy code
    snippet.end()

    // ========================================================================== //
    // * footer start
    // ========================================================================== //
  }

  function loadScript() {
    if (typeof isLoaded !== typeof undefined && isLoaded) {
      // Only load script after game has opened
      clearInterval(scriptLoader)
      startSnippets()
    }
  }

  const scriptLoader = setInterval(loadScript, 200)
})
