// fetchItemFromSets(887) // ! test: crown
fetchItemFromSets(456) // ! test: rune cape

function fetchItemFromSets(itemID) {
  const notOwnedOrInBank =
    !doesPlayerOwnItem(itemID) || checkBankForItem(itemID)
  const equippedInSets = player.checkEquipmentSetsForItem(itemID)
  // const equippedInCurrentSet = player.equipment.checkForItemID(itemID)

  // fetch and unequip
  if (notOwnedOrInBank) {
    console.log('notOwnedOrInBank')
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

// ========================================================================== //
//

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
