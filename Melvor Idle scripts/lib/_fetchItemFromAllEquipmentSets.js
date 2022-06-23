fetchUnequippedItemFromSets(887) // ! test

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
        // var slot= player.equipment.getSlotOfItemID(itemID)
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

// ========================================================================== //

// function doesPlayerOwnItem(itemID) {
//   return checkBankForItem(itemID) || player.checkEquipmentSetsForItem(itemID)
// }

// test
// player.unequipItem(1, EquipmentSlots[0])
// player.unequipItem(player.equipmentSets[1], EquipmentSlots[0])
// player.unequipItem(2, EquipmentSlots[0])

// // not working
// player.unequipItem(set, EquipmentSlots[slot]) // ! in-game bug?
// player.equipmentSets[0].removeQuantityFromSlot(EquipmentSlots[0], 1) // ! 会让装备消失，游戏里没搜到这个func
// player.equipmentSets[0].unequipItem(EquipmentSlots[0]) // ! 会让装备消失，游戏里没搜到这个func
// player.unequipItem(0, 0)
// player.unequipCallback(0)()
// player.unequipCallback(0)()
// player.unequipCallback(0)

// ========================================================================== //
//
