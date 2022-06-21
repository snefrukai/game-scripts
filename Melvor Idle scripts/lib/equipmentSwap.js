window.enableAutoEquipmentSwap = true
window.useMaxLvlPrayer = false
window.useMaxLvlCurseAndAurora = false

window.autoEquipmentSwap = function () {
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
  setInterval(swapEquimentSet(), 1000 * delaySec)

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

autoEquipmentSwap()
