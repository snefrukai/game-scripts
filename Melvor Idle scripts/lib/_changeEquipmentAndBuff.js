var equipmentSetNonCombat = 3
equipSkillCape() // ! test

function equipSkillCape() {
  if (game.activeSkill != 1) {
    // non-combat: max cape > skill cape
    const currentSkill = ActiveSkills[game.activeSkill]
    const firstLetter = currentSkill.slice(0, 1)
    const lowerLetter = currentSkill.slice(1).toLowerCase()
    const capeID = Items[firstLetter + lowerLetter + '_Skillcape']
    var capeTarget = [Items['Max_Skillcape'], capeID]

    // check if own cape
    var itemID = capeTarget.filter((e) => doesPlayerOwnItem(e))[0]
    if (itemID == '') return false //  have no cape

    if (
      // owned && not equipped in current set
      doesPlayerOwnItem(itemID) &&
      !player.equipment.checkForItemID(itemID)
    ) {
      fetchItemFromAllSets(itemID)
      player.equipItem(itemID, equipmentSetNonCombat)
      console.log('equip', Items[itemID])
      return true
    }
  } else {
  }
}

// function equipBiSs(params) {}

// ========================================================================== //
//

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
