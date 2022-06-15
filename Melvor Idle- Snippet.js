// ==UserScript==
// @name         Melvor Idle - Snippet
// @namespace    http://tampermonkey.net/
// @version      0.1
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
    // * upgrade.js
    // ========================================================================== //

    snippet.name = 'upgrade.js'
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

    snippet.end()
  }

  // ========================================================================== //
  // * footer start
  // ========================================================================== //

  function loadScript() {
    if (typeof isLoaded !== typeof undefined && isLoaded) {
      // Only load script after game has opened
      clearInterval(scriptLoader)
      startSnippets()
    }
  }

  const scriptLoader = setInterval(loadScript, 200)
})
