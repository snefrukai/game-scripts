// * change equipment and buff according to action
window.autoChangeEquipmentAndBuff = function () {
  window.equipmentAndBuff = [
    {
      ID: 15,
      activeID: 11,
      name: 'Runecrafting',
      equipment: [
        'Runecrafting_Skillcape',
        'Summoning_Familiar_Crow',
        'Summoning_Familiar_Bear',
        // universal
        'Crown_of_Rhaelyx',
        'Clue_Chasers_Insignia',
        'Aorpheats_Signet_Ring',
        'Max_Skillcape',
        { passive: 'Ring_Of_Wealth' },
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
  window.autoChangeEquipmentAndBuff = false
  window.useMaxLvlPrayer = false
  window.useMaxLvlCurseAndAurora = false

  const equipmentSetNonCombat = 3

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
      switch (game.activeSkill) {
        case 1: // in combat
          if (combatManager.fightInProgress) {
            swapEquipmentSet()
          }
          if ((combatManager.enemy.data.id = obj.monsterID)) {
            let activatePrayer = []
            for (const str of obj.prayer.values()) {
              activatePrayer.push(Prayers[str]) // change str to ID number
            }
            changePrayer(activatePrayer)
            // ?equipment
          }
        case obj.activeID: // in non-combat
          var summonSlotEmp = 'Summon1'
          if (player.selectedEquipmentSet != equipmentSetNonCombat)
            player.changeEquipmentSet(equipmentSetNonCombat)
          for (const val of obj.equipment.values()) {
            // get setting val
            const isPassive =
              typeof val == 'object' && Object.keys(val)[0] == 'passive'
            const itemID = isPassive ? Items[val.passive] : Items[val]
            const bankID = getBankId(itemID)

            if (
              doesPlayerOwnItem(itemID) &&
              !player.equipment.checkForItemID(itemID)
            ) {
              // on other equipment sets: ... && not in bank
              if (!checkBankForItem(itemID)) fetchUnequippedItemFromSets(itemID)
              // afterwhile item is in bank
              if (items[itemID].type == 'Familiar') {
                // ! 如果synergy顺序不对会重装。是否有必要继续优化？
                const summonSlotUsed = player.equipment.getSlotOfItemID(itemID)
                const otherSlot = (slot) =>
                  slot === 'Summon1' ? 'Summon2' : 'Summon1'
                if (summonSlotUsed !== 'None') {
                  // is equipped
                  summonSlotEmp = otherSlot(summonSlotUsed)
                  console.log(items[itemID], summonSlotUsed, summonSlotEmp)
                  // ? no need to equip max?
                } else {
                  console.log('equip', items[itemID], summonSlotEmp) // 如果顺序不对会被顶掉
                  equipFamiliar(itemID, summonSlotEmp)
                  summonSlotEmp = 'Summon2'
                }
              } else if (isPassive) {
                console.log('equip passive', Items[itemID])
                player.equipCallback(itemID, 'Passive')
              } else {
                console.log('equip', Items[itemID])
                player.equipCallback(itemID)
              }
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
        var iSet = setTarget.findIndex((setTemp) => {
          var slotTemp = getSlot(setTemp)
          slot = slotTemp
          return slotTemp != -1
        })
        // console.log(setTarget, 'setIndex', setIndex)
        if (iSet == -1) return [-1, -1]
        else return [setTarget[iSet], slot]

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
    const equipmentSetNonCombat = 3
    var playerAttackTypes = getPlayerAttackTypes(equipmentSetNonCombat)
    var setTarget = getSetTarget()
    var setSameType = getSetTarget((setDefault = true))

    if (setTarget == -1) {
      // dont even have same attack type set w the enemy
      if (setSameType == -1) return console.log('!go get a weapon man!')
      setTarget = setSameType
    }
    player.changeEquipmentSet(setTarget)
    // console.log(setTarget, playerAttackTypes)
    console.log('switched to set', setTarget)

    // getSetTarget()
    function getSetTarget(setDefault) {
      var setTarget = ''
      switch (combatManager.enemy.attackType) {
        case 'melee':
          setTarget = 'magic'
        case 'ranged':
          setTarget = 'melee'
        case 'magic':
          setTarget = 'melee'
        default:
          setTarget = combatManager.enemy.attackType
      }
      // if enemy is melee, but dont have magic set > use the first melee set
      if (setDefault) setTarget = combatManager.enemy.attackType
      return playerAttackTypes.findIndex((e) => e == setTarget)
    }

    // getPlayerAttackTypes() // ! test
    function getPlayerAttackTypes(equipmentSetNonCombat = 3) {
      var arr = []
      for (let i = 0; i < player.equipmentSets.length; i++) {
        if (i == equipmentSetNonCombat) continue
        // skip non-combat set
        arr.push(player.equipmentSets[i].slots.Weapon.item.attackType)
      }
      return arr

      // var i = 0
      // player.equipmentSets.forEach((e) => {
      //   if (i == equipmentSetNonCombat) return true
      //   arr.push(e.slots.Weapon.item.attackType)
      //   i++
      // })
    }
  }

  window.changePrayer = function (activatePrayer = []) {
    var arrTemp = []
    for (const i of activatePrayer) {
      if (typeof i == 'string') {
        console.log(i)
        arrTemp.push(Prayers[i])
      }
    }
    // console.log(arrTemp)
    activatePrayer = arrTemp

    // ! from Action Queue
    for (const i of player.activePrayers.entries()) {
      // if target prayer is active, leave it unchangde
      activatePrayer.includes(i[0])
        ? activatePrayer.splice(
            activatePrayer.findIndex((a) => a == i[0]),
            1
          )
        : activatePrayer.unshift(i[0]) // adds to the beginning of array
    }
    for (const i of activatePrayer) {
      player.togglePrayer(i) // in-game func
    }
  }
}

autoChangeEquipmentAndBuff()

// ========================================================================== //

// * equipment slot order
// [helm,body,leg,boot,weapon,shield,amulet, ring, glove, quiver, cape,passive ,s1,s2]
//

// function getKeyByVal(obj, val) {
//   var key = Object.keys(obj).find((key) => obj[key] === val)
//   return parseInt(key)
// }

// if (useMaxLvlPrayer) changePrayer([30, 24]) // 24: "Augury"
// if (useMaxLvlCurseAndAurora) {
//   player.toggleCurse(12)
//   player.toggleAurora(5)
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
// }
// * prayers
// if (useMaxLvlPrayer) changePrayer([30, 22]) // 22: "Piety"
// 30: "Battleheart"
// if (useMaxLvlPrayer) changePrayer([30, 23])
