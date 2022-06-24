// * change equipment and buff according to action
window.autoChangeEquipmentAndBuff = function () {
  window.equipmentAndBuff = [
    {
      ID: 15,
      activeID: 11,
      name: 'Runecrafting',
      equipment: [
        // 'Runecrafting_Skillcape',
        'Summoning_Familiar_Crow',
        'Summoning_Familiar_Bear',
        // universal
        'Crown_of_Rhaelyx',
        'Clue_Chasers_Insignia',
        'Aorpheats_Signet_Ring',
        // 'Max_Skillcape',
        // { passive: 'Ring_Of_Wealth' }, // ! only if have passive slot
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
        case 1: // is in combat
          if ((combatManager.enemy.data.id = obj.monsterID)) {
            // let activatePrayer = []
            // for (const str of obj.prayer.values()) activatePrayer.push(Prayers[str]) // change str to ID number
            swapEquipmentSet()
            changePrayer(obj.prayer)
            // !equipment
          }
          break // ! no break means SERIOUS bug
        case obj.activeID: // is in non-combat
          var summonSlotEmp = 'Summon1'
          swapEquipmentSet()
          // * loop equipments' setting and changde
          for (const val of obj.equipment.values()) {
            const isPassive =
              typeof val == 'object' && Object.keys(val)[0] == 'passive'
            const itemID = isPassive ? Items[val.passive] : Items[val]
            const bankID = getBankId(itemID)

            if (
              // owned && not equipped in current set
              doesPlayerOwnItem(itemID) &&
              !player.equipment.checkForItemID(itemID)
            ) {
              fetchItemFromAllSets(itemID)
              // afterwhile target item is in bank
              if (items[itemID].type == 'Familiar') {
                // ! 如果synergy顺序不对,会重装。是否有必要继续优化？
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
                  player.equipItem(
                    itemID,
                    // player.selectedEquipmentSet,
                    equipmentSetNonCombat,
                    summonSlotEmp,
                    bank[bankID].qty
                  )
                  summonSlotEmp = 'Summon2'
                }
              } else if (isPassive) {
                console.log('equip passive', Items[itemID])
                player.equipItem(itemID, player.selectedEquipmentSet, 'Passive')
                // player.equipItem(itemID, equipmentSetNonCombat, 'Passive')
                // player.equipCallback(itemID, 'Passive')
              } else {
                console.log('equip', Items[itemID])
                player.equipItem(itemID, player.selectedEquipmentSet)
                // player.equipCallback(itemID) // ! buggy: could equip in differentset
                // ! 怎样避免max cape和skill cape循环地equip
              }
            }
          }
          break
        default:
        // equip BiSs for each activity
      }
    }
  }

  function fetchItemFromAllSets(itemID) {
    if (!doesPlayerOwnItem(itemID)) return false // is not owned
    // else if (player.equipment.checkForItemID(itemID)) // is equipped
    else if (checkBankForItem(itemID)) return false // is in bank
    else if (player.checkEquipmentSetsForItem(itemID)) {
      // * owned && equipped in sets:
      // fetch and unequip(including current set)
      const setTarget = [0, 1, 2, 3]
      // const setTarget = [0, 1, 2, 3].filter((set) => set != setCurrent)
      var set = -1
      var slot = -1
      var foo = getSet(setTarget)
      set = foo[0]
      slot = foo[1]
      if (set != -1 && slot != -1) {
        unequipItemFrom(set, slot)
        return true
      }

      // ========================================================================== //
      //

      function getSet(setTarget) {
        const setIndex = setTarget.findIndex((setTemp) => {
          const slotTemp = getSlot(setTemp)
          slot = slotTemp
          return slotTemp != -1
        })
        // console.log(setTarget, 'setIndex', setIndex)
        if (setIndex == -1) return [-1, -1]
        else return [setTarget[setIndex], slot]

        function getSlot(set) {
          const slot = player.equipmentSets[set].slotArray.findIndex(
            (element) => element.item.id == itemID // 搞了变天是既没有把{}去掉，也没用return
          )
          // var slot= player.equipment.getSlotOfItemID(itemID)
          return slot
        }
      }

      function unequipItemFrom(set, slot) {
        // additional check point
        if (set == -1 || slot == -1)
          return console.log('invalid set or slot:', set, slot)

        let setCurrent = player.selectedEquipmentSet
        if (player.selectedEquipmentSet != set) {
          player.changeEquipmentSet(set)
          player.unequipItem(set, EquipmentSlots[slot])
          player.changeEquipmentSet(setCurrent)
          console.log(
            'changed set',
            set,
            ' and unequipped',
            Items[itemID],
            'slot',
            slot
          )
        } else {
          player.unequipItem(set, EquipmentSlots[slot])
          console.log('unequipped', Items[itemID], 'current set', 'slot', slot)
        }
      }
    }
    return false
  }

  function swapEquipmentSet() {
    const playerAttackTypes = getPlayerAttackTypes(equipmentSetNonCombat)
    var setTarget = null

    if (game.activeSkill != 1) {
      setTarget = equipmentSetNonCombat
    } else {
      // combat
      const setSameType = getSetByEnemy((setDefault = true))
      setTarget = getSetByEnemy()

      if (setTarget == -1) {
        // dont even have same attack type set w the enemy
        if (setSameType == -1) return console.log('!go get a weapon man!')
        setTarget = setSameType
      }
      // console.log(setTarget, playerAttackTypes)
    }

    if (setTarget != player.selectedEquipmentSet) {
      player.changeEquipmentSet(setTarget)
      console.log('swap to set', setTarget)
      return true
    }
    return false

    // ========================================================================== //
    //

    // getSetTarget()
    function getSetByEnemy(setDefault) {
      if (setDefault == true) {
        // if enemy is melee, but dont have magic set > use the first melee set
        setTarget = combatManager.enemy.attackType
      } else {
        switch (combatManager.enemy.attackType) {
          case 'melee':
            setTarget = 'magic'
          case 'ranged':
            setTarget = 'melee'
          case 'magic':
            setTarget = 'melee'
        }
      }
      // console.log('enemy type is', combatManager.enemy.attackType)
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
      if (typeof i == 'string') arrTemp.push(Prayers[i])
      // console.log(i)
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
    for (const i of activatePrayer) player.togglePrayer(i) // in-game func
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
