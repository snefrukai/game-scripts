// * change equipment and buff according to action

window.buffSetting = [
  // * non-combat
  {
    name: 'non-combat universal',
    equipment: [
      'Crown_of_Rhaelyx',
      'Clue_Chasers_Insignia',
      'Aorpheats_Signet_Ring',
      'Ring_Of_Wealth',
      'Max_Skillcape',
    ],
  },
  {
    name: 'Woodcutting',
    equipment: [
      'Lumberjacks_Top',
      'Summoning_Familiar_Ent',
      // 'Summoning_Familiar_Monkey',
      { passive: 'Ancient_Ring_Of_Mastery' },
    ],
  },
  {
    name: 'Thieving',
    equipment: [
      'Chapeau_Noir',
      'Boots_Of_Stealth',
      'Fine_Coinpurse',
      'Gloves_of_Silence',
      'Summoning_Familiar_Devil',
      'Summoning_Familiar_Leprechaun',
      { passive: 'Ancient_Ring_Of_Mastery' },
    ],
  },
  {
    name: 'Runecrafting',
    equipment: [
      'Summoning_Familiar_Crow',
      'Summoning_Familiar_Bear',
      { passive: 'Ancient_Ring_Of_Mastery' },
    ],
  },
  {
    name: 'Agility',
    equipment: [
      // 'Clue_Chasers_Insignia',
      { passive: 'Ancient_Ring_Of_Mastery' },
      //
    ],
  },
  {
    name: 'Item Alchemy',
    equipment: [
      'Boots_Of_Stealth', // gp
      'Fire_Imbued_Wand', // fire rune
      'Fine_Coinpurse', // gp
      'Jeweled_Necklace', // gp
      // 'Clue_Chasers_Insignia',
    ],
  },

  // * combat
  // deep sea ship
  {
    name: 'Pirate',
    prayer: [],
    CO: { prayer: [] },
  },
  {
    name: 'Pirate Captain',
    CO: { prayer: ['Incredible_Reflexes'] },
  },
  {
    name: 'The Kraken',
    CO: { prayer: ['Chivalry'] },
  },

  // spider
  {
    name: 'Spider',
    prayer: [],
    CO: { prayer: [] },
  },
  {
    name: 'Evil Spider',
    CO: { prayer: ['Incredible_Reflexes'] },
  },
  {
    name: 'Spider King',
    CO: { prayer: ['Chivalry'] },
  },

  // Frozen Cove
  {
    name: 'Ice Monster',
    prayer: [],
    CO: { prayer: [] },
  },
  {
    name: 'Ice Troll',
    CO: { prayer: ['Incredible_Reflexes'] },
  },
  {
    name: 'Protector of Ice',
    CO: { prayer: ['Chivalry'] },
  },

  // Miolite Caves
  {
    name: 'Miolite Sprig',
    prayer: [],
    CO: { prayer: [] },
  },
  {
    name: 'Miolite Warden',
    // prayer: ['Incredible_Reflexes'],
    CO: { prayer: ['Chivalry'] },
  },
  {
    name: 'Miolite Monarch',
    CO: { prayer: ['Chivalry'] },
  },

  // peaks
  {
    name: 'Greater Skeletal Dragon',
    prayer: ['Battleheart', 'Protect_from_Melee'],
    // prayer: [prayers.Battleheart, prayers.Protect_from_Melee],
    equipment: [],
  },

  // Dragons Den
  {
    name: 'Green Dragon',
    areaType: 'Dungeon',
    prayer: [],
    potion: 'Diamond_Luck_Potion_IV',
    equipment: [
      // std
      'Chapeau_Noir',
      'Ancient_Wizard_Robes',
      'Ancient_Wizard_Bottoms',
      'Sand_Treaders',
      'Mystic_Water_Staff',
      'Amulet_of_Magic',
      'Ring_Of_Wealth',
      'Elementalist_Gloves',
      'Wizards_Scroll',
      'Skull_Cape',
      'Summoning_Familiar_Witch',
      'Summoning_Familiar_Dragon',
    ],
  },

  // Air God Dungeon
  {
    name: 'Air Guard',
    prayer: [],
    equipment: [
      // std
      'Ancient_Helmet_T_G',
      'Ancient_Platebody_T_G',
      'Ancient_Platelegs_T_G',
      'Dragon_Boots_T_G',
      'Sunset_Rapier',
      'Scaled_Shield',
      'Elite_Amulet_of_Strength',
      'Ring_Of_Blade_Echoes',
      'Paladin_Gloves',
      'Infernal_Cape',
      'Summoning_Familiar_Minotaur',
      'Summoning_Familiar_Dragon',
    ],
  },
]

window.autoChangeBuff = function () {
  window.autoChangeBuff = true
  // window.useMaxLvlPrayer = false
  // window.useMaxLvlCurseAndAurora = false
  // const equipmentSetNonCombat = 4 - 1
  var activeSkillTemp = ''

  addCheckbox(
    'auto change buffs',
    (varStr = Object.keys({ autoChangeBuff })[0]), // change var to str
    (pos = '#header-theme')
  )
  console.log('autoChangeBuff:', autoChangeBuff)
  setInterval(() => {
    if (window.autoChangeBuff) {
      changeBuff()
    }
  }, 1000 * 1)

  // ========================================================================== //
  //

  function addCheckbox(name, varStr, pos, type = 'checkbox') {
    // 感觉调用起来时参数会很复杂？
    // label
    var label = document.createElement('label')
    label.appendChild(document.createTextNode(name))
    document.querySelector(pos).prepend(label)
    // check box
    var checkbox = document.createElement('input')
    checkbox.type = type
    checkbox.id = varStr
    label.prepend(checkbox)
    // event
    var checkboxTarget = document.querySelector('#' + varStr) // ? class and ID?
    checkboxTarget.addEventListener('change', (event) => {
      window[varStr] = event.currentTarget.checked
      console.log(varStr, ':', window[varStr])
    })
    checkboxTarget.checked = window[varStr] // set checked default
  }

  // todo: potion
  function changeBuff() {
    const inCombat = game.activeSkill == 1
    const notIdle = game.activeSkill != 0
    var activeSkillNew = ''
    var setting = ''
    var log = 'settings: '

    // get target
    if (inCombat) {
      activeSkillNew = combatManager.enemy.data.name
    } else {
      const s = ActiveSkills[game.activeSkill].toLowerCase()
      activeSkillNew = s[0].toUpperCase() + s.slice(1)
    }

    // change buff if target change, or stop then begin (idle then active)
    if (activeSkillTemp != activeSkillNew) {
      activeSkillTemp = activeSkillNew

      // alt magic
      var activeSkillNewTemp =
        activeSkillNew == 'Magic'
          ? game.altMagic.selectedSpell.name
          : activeSkillNew
      // e.g. 'Item Alchemy III' includes 'Item Alchemy'
      setting = buffSetting.find((e) => activeSkillNewTemp.includes(e.name))

      // check account type
      if (setting != undefined && username && username.includes('CO')) {
        setting = 'CO' in setting ? setting['CO'] : undefined
        log = 'CO ' + log
      }

      // change according to eq settings
      let eqSetting = []
      if (setting != undefined && inCombat) {
        // ? check areaType. e.g. black dragon (dragon den)
        // swapEquipmentSet() // ?
        changePrayer(setting['prayer'])
        // ? change equipment
        // add universal
      } else if (!inCombat && notIdle) {
        // add skill cape
        // ! None_Skillcape
        const currentSkillCape = activeSkillNew + '_Skillcape'
        eqSetting.push(currentSkillCape)

        // add universal
        const universal = buffSetting.find(
          (e) => e.name == 'non-combat universal'
        )
        eqSetting = eqSetting.concat(universal.equipment)

        swapEquipmentSet()
      }
      // add setting
      if (setting != undefined) eqSetting = eqSetting.concat(setting.equipment)
      // console.log(setting, eqSetting)
      changeEquipment(eqSetting)

      log += setting != undefined ? 'loaded' : typeof setting
      console.log('new skill target:', activeSkillNewTemp, ',', log)
    }
  }

  // changeEquipment(['Chapeau Noir'])
  // changeEquipment(['Chapeau_Noir'])
  function changeEquipment(eqSetting) {
    const hasPassive = dungeonCompleteCount[15] >= 1
    var countFamiliar = 0
    var summonSlotEmp = 'Summon1'

    if (eqSetting == []) return false

    for (let item of eqSetting) {
      const isPassive =
        typeof item == 'object' && Object.keys(item)[0] == 'passive'
      if (isPassive) item = item.passive
      const itemID = Items[item.replace(/\s/gm, '_')] // change space to '_'
      const bankID = getBankId(itemID)
      const isFamiliar =
        items[itemID].type != undefined && items[itemID].type == 'Familiar'
      const ownedAndNotInCurrentSet =
        doesPlayerOwnItem(itemID) && !player.equipment.checkForItemID(itemID)
      // console.log('target item:', item)

      // * if familiar is equiped
      if (isFamiliar) {
        const summonSlotUsed = player.equipment.getSlotOfItemID(itemID)
        const otherSlot = (slot) => (slot === 'Summon1' ? 'Summon2' : 'Summon1')
        if (summonSlotUsed !== 'None') {
          summonSlotEmp = otherSlot(summonSlotUsed)
          console.log(Items[itemID], 'is at', summonSlotUsed)
        }
        countFamiliar += 1
        console.log('countFamiliar', countFamiliar)
        // ?如果synergy顺序不对,会二次装备。是否有必要继续优化？
        // ? no need to equip max?
      }

      // * equip
      if (ownedAndNotInCurrentSet) {
        fetchItemFromSets(itemID)
        // console.log('feteched:', itemID)
        // afterwhile target item is in bank
        if (isFamiliar) {
          player.equipItem(
            itemID,
            player.selectedEquipmentSet,
            summonSlotEmp,
            bank[bankID].qty / 2
          )

          console.log('equip', Items[itemID], 'at', summonSlotEmp)
          summonSlotEmp = 'Summon2'
        } else if (isPassive && hasPassive) {
          player.equipItem(itemID, player.selectedEquipmentSet, 'Passive')
          console.log('equip passive', Items[itemID])
        } else {
          player.equipItem(itemID, player.selectedEquipmentSet)
          console.log('equip:', Items[itemID])
          // player.equipCallback(itemID) // ! could equip in different set
          // ! 怎样避免max cape和skill cape循环地equip？ 1. target 改变前只执行1次
        }
      }
    }

    // * clear summon slot, to avoid unwanted synergy
    // ! if in combat, could clear when not wanting to clear
    if (countFamiliar == 1) {
      // if only has 1 familiar in setting, clear 2nd summon slot
      unequipItem(player.selectedEquipmentSet, 13)
    }
    // if (countFamiliar < 1) unequipItem(player.selectedEquipmentSet, 12)

    // ! 放在外面会出bug
    // const slotsToClear = [12, 13]
    // for (i of slotsToClear)
    //   player.unequipItem(player.selectedEquipmentSet, EquipmentSlots[i])

    // ! undefined and null, idk why
    // const itemID = player.equipment.slots.Summon2.item.id
    // for (const i in player.equipment.slots) {
    //   if (player.equipment.slots[i].item.id == itemID) {
    //     player.unequipCallback(i)()
    // ! why 'unequipCallback' have to use format to work?
    //     console.log('unequip', Items[itemID])
    //   }
    // }

    // player.unequipItem(player.selectedEquipmentSet, EquipmentSlots[12])
    // console.log('unequip', player.equipment.slotArray[12].item.id)
  }

  function fetchItemFromSets(itemID) {
    const notOwnedOrInBank =
      !doesPlayerOwnItem(itemID) || checkBankForItem(itemID)
    const equippedInSets = player.checkEquipmentSetsForItem(itemID)
    // const equippedInCurrentSet = player.equipment.checkForItemID(itemID)

    // fetch and unequip
    if (notOwnedOrInBank) {
      // console.log('notOwnedOrInBank:', Items[itemID])
      return false
    } else if (equippedInSets) {
      // including current set)
      const setTarget = [0, 1, 2, 3]
      // const setTarget = [0, 1, 2, 3].filter((set) => set != setCurrent) // except current
      var foo = getSetAndSlot(setTarget)
      unequipItem((set = foo[0]), (slot = foo[1]))
    }

    // ========================================================================== //
    //

    function getSetAndSlot(setTarget) {
      var slot = -1
      // loop each set
      const setIndex = setTarget.findIndex((setTemp) => {
        // loop each slot
        const slotTemp = player.equipmentSets[setTemp].slotArray.findIndex(
          (e) => e.item.id == itemID
        )
        slot = slotTemp
        return slotTemp != -1
      })
      // console.log(setTarget, 'setIndex', setIndex)

      if (setIndex == -1) {
        return [-1, -1]
      } else {
        return [setTarget[setIndex], slot]
      }

      // function getSlot(set) {
      //   const slot = player.equipmentSets[set].slotArray.findIndex(
      //     (e) => e.item.id == itemID
      //   )
      //   // 搞了变天是既没有把{}去掉，也没用return
      //   return slot
      // }
    }
  }

  function unequipItem(set, slot) {
    var foo = Items[player.equipmentSets[set].slotArray[slot].item.id]
    foo = 'unequip: ' + foo + ', set ' + set + ', slot ' + slot + ', '

    // additional check point
    if (set == -1 || slot == -1) {
      foo += 'invalid'
      console.log(foo)
      return false
    } else if (player.equipmentSets[set].slotArray[slot].item.id == -1) {
      foo += 'empty'
      console.log(foo)
      return false
    }

    let setCurrent = player.selectedEquipmentSet
    if (player.selectedEquipmentSet != set) {
      player.changeEquipmentSet(set)
      player.unequipItem(set, EquipmentSlots[slot])
      player.changeEquipmentSet(setCurrent)
    } else {
      player.unequipItem(set, EquipmentSlots[slot])
    }
    foo += 'done'
    console.log(foo)
  }

  function swapEquipmentSet() {
    const equipmentSetNonCombat = 4 - 1
    const playerAttackTypes = getPlayerAttackTypes(equipmentSetNonCombat)
    var setTarget = null

    if (game.activeSkill != 1) setTarget = equipmentSetNonCombat
    // non-combat
    else if (game.activeSkill == 1) {
      // combat
      const setSameType = getSetByEnemy((setDefault = true))
      setTarget = getSetByEnemy()

      if (setTarget == -1) {
        // dont have same attack type set w the enemy
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

    // getPlayerAttackTypes(equipmentSetNonCombat) // ! test
    function getPlayerAttackTypes(equipmentSetNonCombat) {
      var arr = []
      for (let i = 0; i < player.equipmentSets.length; i++) {
        if (i == equipmentSetNonCombat) continue
        // skip non-combat set
        arr.push(player.equipmentSets[i].slots.Weapon.item.attackType)
      }
      return arr
    }
  }

  window.changePrayer = function (activatePrayer = []) {
    var arrTemp = []
    for (const i of activatePrayer) {
      if (typeof i == 'string') arrTemp.push(Prayers[i])
    }
    activatePrayer = arrTemp
    // console.log(arrTemp)

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

autoChangeBuff() // ! test

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
// 0: "Thick_Skin"
// 1: "Burst_of_Strength"
// 2: "Clarity_of_Thought"
// 3: "Sharp_Eye"
// 4: "Mystic_Will"
// 5: "Rock_Skin"
// 6: "Superhuman_Strength"
// 7: "Improved_Reflexes"
// 8: "Rapid_Heal"
// 9: "Protect_Item"
// 10: "Hawk_Eye"
// 11: "Mystic_Lore"
// 12: "Steel_Skin"
// 13: "Ultimate_Strength"
// 14: "Incredible_Reflexes"
// 15: "Protect_from_Magic"
// 16: "Protect_from_Ranged"
// 17: "Protect_from_Melee"
// 18: "Eagle_Eye"
// 19: "Mystic_Might"
// 20: "Redemption"
// 21: "Chivalry"
// 22: "Piety"
// 23: "Rigour"
// 24: "Augury"
// 25: "Stone_Skin"
// 26: "Safeguard"
// 27: "Rejuvenation"
// 28: "Sharp_Vision"
// 29: "Mystic_Mastery"
// 30: "Battleheart"
