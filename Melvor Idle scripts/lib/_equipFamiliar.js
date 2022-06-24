var itemID = 987 // crow
// var itemID = 995 // bear
// ========================================================================== //
//

const summonSlotUsed = player.equipment.getSlotOfItemID(itemID)
const otherSlot = (slot) => (slot === 'Summon1' ? 'Summon2' : 'Summon1')
const summonSlotEmp = otherSlot(summonSlotUsed)
console.log(summonSlotEmp)

// ========================================================================== //
//

var slotsFamiliar = [`Summon1`, `Summon2`]
var slotUsed = ''
var equippedIndex = Object.values(player.equipment.slots).findIndex((e) => {
  slotUsed = e.type
  return e.item.id == itemID
})
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

// ========================================================================== //
//

// function quickEquipSynergy(synergy) {
//   const mark1 = Summoning.marks[synergy.summons[0]]
//   const mark2 = Summoning.marks[synergy.summons[1]]
//   const summon1Slot = this.equipment.getSlotOfItemID(mark1.itemID)
//   const summon2Slot = this.equipment.getSlotOfItemID(mark2.itemID)
//   const otherSlot = (slot) => {
//     return slot === 'Summon1' ? 'Summon2' : 'Summon1'
//   }
//   const equipArgs = []
//   if (summon1Slot === 'None' && summon2Slot !== 'None') {
//     equipArgs.push([
//       mark1.itemID,
//       player.selectedEquipmentSet,
//       otherSlot(summon2Slot),
//       69696969,
//     ])
//   }
// }
