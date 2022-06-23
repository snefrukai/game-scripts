// * change equipment and buff according to action
window.autoChangeEquipmentAndBuff = function () {
  window.autoChangeEquipmentAndBuff = false
  window.useMaxLvlPrayer = false
  window.useMaxLvlCurseAndAurora = false

  const equipmentSetMelee = 0
  const equipmentSetRanged = 1
  const equipmentSetMagic = 2
  const equipmentSetNonCombat = 3

  const equipmentAndBuff = [
    {
      activeID: 11,
      name: 'Runecrafting',
      ID: 15,
      equipment: [
        'Crown_of_Rhaelyx', //
        'Clue_Chasers_Insignia',
        { passive: 'Aorpheats_Signet_Ring' },
        'Summoning_Familiar_Crow',
        'Summoning_Familiar_Bear',
      ],
    },
    {
      monsterID: 132,
      name: 'Greater Skeletal Dragon',
      prayer: ['Battleheart', 'Protect_from_Melee'],
      // prayer: [prayers.Battleheart, prayers.Protect_from_Melee],
      equipment: ['Battleheart', 'Protect_from_Melee'],
    },
  ]

  addCheckbox(
    'auto change equiment and buff',
    (varStr = Object.keys({ autoChangeEquipmentAndBuff })[0]),
    (pos = '#header-theme')
  )
  console.log('autoChangeEquipmentAndBuff:', autoChangeEquipmentAndBuff)
  setInterval(() => {
    if (window.autoChangeEquipmentAndBuff) {
      changeEquipmentAndBuff()
    }
  }, 1000 * 1)

  // ========================================================================== //
  //

  function addCheckbox(name, varStr, pos, type = 'checkbox') {
    // 感觉调用起来时参数会很复杂？
    var label = document.createElement('label')
    label.appendChild(document.createTextNode(name))
    document.querySelector(pos).prepend(label)

    var checkbox = document.createElement('input')
    checkbox.type = type
    checkbox.id = varStr
    label.prepend(checkbox)

    var checkboxTarget = document.querySelector('#' + varStr) // ? class and ID?
    checkboxTarget.addEventListener('change', (event) => {
      window[varStr] = event.currentTarget.checked
      console.log(varStr, ':', window[varStr])
    })
    checkboxTarget.checked = window[varStr] // set checked default
  }

  function changeEquipmentAndBuff() {
    for (const obj of equipmentAndBuff.values()) {
      if (combatManager.fightInProgress) {
        // in combat
        swapEquipmentSet()
        if (obj.monsterID == combatManager.enemy.data.id) {
          let activatePrayer = []
          for (const str of obj.prayer.values()) {
            activatePrayer.push(Prayers[str]) // change str to ID number
          }
          changePrayer(activatePrayer)
          // ?equipment
        }
      } else if (obj.activeID == game.activeSkill) {
        // in non-combat
        var slotsFamiliar = [`Summon1`, `Summon2`]
        if (player.selectedEquipmentSet != equipmentSetNonCombat)
          player.changeEquipmentSet(equipmentSetNonCombat)
        for (const val of obj.equipment.values()) {
          // get setting val
          const isPassive =
            typeof val == 'object' && Object.keys(val)[0] == 'passive'
          const itemID = isPassive ? Items[val.passive] : Items[val]
          const bankID = getBankId(itemID)
          const ownedAndNotEquipped =
            doesPlayerOwnItem(itemID) &&
            !player.equipment.checkForItemID(itemID)

          if (ownedAndNotEquipped && !checkBankForItem(itemID))
            // on other equipment sets: ... && not in bank
            fetchUnequippedItemFromSets(itemID)
          // afterwhile item is in bank

          if (items[itemID].type == 'Familiar') {
            var slotUsed = ''
            var equippedIndex = Object.values(player.equipment.slots).findIndex(
              (e) => {
                slotUsed = e.type
                return e.item.id == itemID
              }
            )
            // console.log(slotUsed, equippedIndex, itemID) // works
            if (equippedIndex >= 0) {
              // is equipped > pop out summon slot
              slotsFamiliar = slotsFamiliar.filter((e) => e != slotUsed)
              // console.log(items[itemID], 'at', slotUsed, 'free', slotsFamiliar)
              // ? no need to equip max?
            } else {
              console.log('trying to equip', items[itemID], 'at', slotsFamiliar) // 如果顺序不对会被顶掉
              equipFamiliar(itemID, slotsFamiliar[0])
              slotsFamiliar.shift()
            }

            // } else if (player.equipment.slots['Summon1'].quantity == 0) {
            //   equipFamiliar(itemID, `Summon1`)
            // } else if (player.equipment.slots['Summon2'].quantity == 0) {
            //   equipFamiliar(itemID, `Summon2`)
          } else if (isPassive && ownedAndNotEquipped) {
            console.log('trying to equip passive', Items[itemID])
            player.equipCallback(itemID, 'Passive')
          } else if (ownedAndNotEquipped) {
            console.log('trying to equip', Items[itemID])
            player.equipCallback(itemID)
          }

          function equipFamiliar(itemID, slotStr) {
            player.equipItem(
              itemID,
              player.selectedEquipmentSet,
              slotStr,
              bank[bankID].qty
            )
          }
        }
      }
    }
  }

  // fetchUnequippedItemFromSets(887)
  function fetchUnequippedItemFromSets(itemID) {
    // if (doesPlayerOwnItem(itemID) == false) return // is not owned
    // else if (player.equipment.checkForItemID(itemID)) return false // is equipped
    // else if (checkBankForItem(itemID) == true) return true // is in bank
    if (doesPlayerOwnItem(itemID) && player.checkEquipmentSetsForItem(itemID)) {
      // item is equipped on other equipment sets > unequip
      var setCurrent = player.selectedEquipmentSet
      // var setTarget = [0, 1, 2, 3].filter((set) => set != setCurrent)
      var setTarget = [0, 1, 2, 3]

      var set = -1
      var slot = -1
      var foo = getSet(setTarget)
      set = foo[0]
      slot = foo[1]
      if (set != -1 && slot != -1) {
        unequipItemFrom(set, slot)
        return true
      }

      function getSet(setTarget) {
        // var slot = -1
        var setIndex = setTarget.findIndex((setTemp) => {
          var slotTemp = getSlot(setTemp)
          slot = slotTemp
          return slotTemp != -1
        })
        // console.log(setTarget, 'setIndex', setIndex)
        if (setIndex == -1) return [-1, -1]
        else return [setTarget[setIndex], slot]

        function getSlot(set) {
          var slot = player.equipmentSets[set].slotArray.findIndex(
            (element) => element.item.id == itemID // 搞了变天是既没有把{}去掉，也没用return
          )
          return slot
        }
      }

      function unequipItemFrom(set, slot) {
        // additional check point
        if (set == -1 || slot == -1)
          return console.log('invalid set or slot:', set, slot)

        let setCurrentTemp = player.selectedEquipmentSet
        if (player.selectedEquipmentSet != set) {
          player.changeEquipmentSet(set)
          player.unequipItem(set, EquipmentSlots[slot])
          player.changeEquipmentSet(setCurrentTemp)
        } else {
          player.unequipItem(set, EquipmentSlots[slot])
        }
        console.log('unequipped', Items[itemID], ': set', set, 'slot', slot)
      }
    }
    return false
  }

  function swapEquipmentSet() {
    const playerNotMelee = player.selectedEquipmentSet != equipmentSetMelee
    const playerNotRanged = player.selectedEquipmentSet != equipmentSetRanged
    const playerNotMagic = player.selectedEquipmentSet != equipmentSetMagic

    const enemyIsMelee = combatManager.enemy.attackType == 'melee'
    const enemyIsRanged = combatManager.enemy.attackType == 'ranged'
    const enemyIsMagic = combatManager.enemy.attackType == 'magic'

    function swap(set) {
      player.changeEquipmentSet(set)
      console.log('switched to set', set)
    }

    if (enemyIsMelee && playerNotMagic) swap(equipmentSetMagic)
    else if (enemyIsRanged && playerNotMelee) swap(equipmentSetMelee)
    else if (enemyIsMagic && playerNotRanged) swap(equipmentSetRanged)
  }

  window.changePrayer = function (activatePrayer = []) {
    // ! from Action Queue
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

autoChangeEquipmentAndBuff()

// ========================================================================== //

// function getCurrentEquipment() {
//   var arr = []
//   player.equipment.slotArray.forEach((element) => {
//     // array consists of objects
//     var bar = element.item.id
//     if (bar != -1) arr.push(bar)
//   })
//   return arr
// }

// function getKeyByVal(obj, val) {
//   var key = Object.keys(obj).find((key) => obj[key] === val)
//   return parseInt(key)
// }

// if (useMaxLvlPrayer) changePrayer([30, 24]) // 24: "Augury"
// if (useMaxLvlCurseAndAurora) {
//   player.toggleCurse(12)
//   player.toggleAurora(5)
//   // * Curses
//   // 4: "BlindingII"
//   // 5: "SoulSplitII"
//   // 6: "WeakeningII"
//   // 8: "AnguishII"
//   // 9: "BlindingIII"
//   // 10: "SoulSplitIII"
//   // 11: "WeakeningIII"
//   // 12: "AnguishIII"
//   // 13: "Decay"
//   // * Auroras
//   //         5: "FuryII"
//   // 6: "FervorII"
//   // 7: "SurgeIII"
//   // 8: "ChargedII"
//   // 9: "FuryIII"
//   // 10: "FervorIII"
//   // 11: "ChargedIII"
// }
// if (useMaxLvlPrayer) changePrayer([30, 22]) // 22: "Piety"
// * prayers
// 30: "Battleheart"
// if (useMaxLvlPrayer) changePrayer([30, 23])
