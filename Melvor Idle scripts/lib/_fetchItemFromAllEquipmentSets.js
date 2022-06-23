// fetchUnequippedItemFromSets(887) // ! test

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
