function fetchItemFromEquipmentSets(itemID) {
  if (doesPlayerOwnItem(itemID) == false) {
    // console.log('does not own', Items[itemID])
    return false
  } else if (player.equipment.checkForItemID(itemID) == true) {
    // console.log('already equipped', Items[itemID])
    return false
  } else if (player.checkEquipmentSetsForItem(itemID) == true) {
    // unequip from other equipment sets
    var setCurrent = player.selectedEquipmentSet
    var setTarget = [0, 1, 2, 3].filter((set) => set != setCurrent)

    var set = -1
    var slot = -1
    var foo = getSet(setTarget)
    set = foo[0]
    slot = foo[1]
    // console.log(Items[itemID], ': set', set, 'slot', slot)
    unequipItemFrom(set, slot)

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

      if (player.selectedEquipmentSet != set) {
        player.changeEquipmentSet(set)
        player.unequipItem(set, EquipmentSlots[slot])
      }
      player.changeEquipmentSet(setCurrent)
      console.log('unequipped', Items[itemID], ': set', set, 'slot', slot)
    }
  }

  return true // item is in bank
}

// fetchItemFromEquipmentSets(887) // ! test

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
