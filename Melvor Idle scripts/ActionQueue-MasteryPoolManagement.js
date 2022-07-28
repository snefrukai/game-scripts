// * copy to to in-game Action Queue "Import Action List"

// custom priority behaviour is:
// * 1. level all masteries to 60 base (close to optimal strategy due to benefits of total mastery level in formula).
// * 2. level up each mastery in the array in order up to the base level set.
// * 3. level up all masteries not in priority array evenly up to 99.
// * 4. level up remaining masteries in priority array evenly to 99.

// ========================================================================== //
//

// * Cooking
// getSkillMasteryIDs(
//   'Cooking',
//   (filter = [
//     'Beef', //
//     'Chicken',
//     'Beef Pie',
//     'Meat Pizza Slice',
//   ])
// )
// [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,22,23,24,25,26,27,28,29,30]

// * Fishing
getSkillMasteryIDs(
  'Fishing',
  (filter = [
    'Raw Whale',
    'Raw Manta',
    'Raw Cave',
    'Raw Shark',
    'Raw Swordfish',
    'Raw Lobster',
    'Raw Salmon',
    'Raw Magic Fish',
  ])
)
// [0, 1, 2, 3, 7, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22]

// ========================================================================== //
//

// getSkillMasteryIDs('Cooking', (filter = [])) // ! test

function getSkillMasteryIDs(skillName, filter) {
  const obj = masteryIDs[skillName]
  const names = Object.keys(obj)
  var result = []

  names.forEach((name) => {
    const id = obj[name]
    // todo how to include keywords?
    const hit = filter.includes(name)
    if (!hit && id != -1) {
      // -1 means not in current game (?)
      result.push(id)
    }
    console.log(name, id, hit)
  })
  console.log(skillName, 'MasteryIDs filtered:', result)
}
