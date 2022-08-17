// * copy to to in-game Action Queue "Import Action List"

// - set array of mastery ids in the order that you will be leveling them up w/o pool
// - set base level for custom priority based on how many masteries you want to level entirely with pool (things that take a lot of resources) e.g. 87 if you don't want to skip any (gathering skills) and lower if you want to skip som

// custom priority behaviour is:
// * 1. level all masteries to 60 base (close to optimal strategy due to benefits of total mastery level in formula).
// * 2. level up each mastery in the array in order up to the base level set.
// skip levels with pool exp
// * 3. level up all masteries not in priority array evenly up to 99.
// max active skill for bonus?
// * 4. level up remaining masteries in priority array evenly to 99.
// max inactive skill

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

// 50% 
// 60
// [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,19,22,23,24,25,26,27,29,30]

// [Anglerfish: 12
// Apple Pie: 27
// Basic Soup: 22
// Beef: 17
// Beef Pie: 20
// Bread: 16
// Carp: 15
// Carrot Cake: 30
// Cave Fish: 9
// Cherry Cupcake: 25
// Chicken: 18
// Chicken Soup: 28
// Crab: 7
// Cream Corn Soup: 26
// Fanfish: 13
// Hearty Soup: 24
// Herring: 2
// Lemon Cake: -1
// Lobster: 5
// Manta Ray: 10
// Meat Pizza Slice: 21
// Plain Pizza Slice: 19
// Salmon: 4
// Sardine: 1
// Seahorse: 14
// Shark: 8
// Shrimp: 0
// Strawberry Cake: 29
// Strawberry Cupcake: 23
// Swordfish: 6
// Trout: 3
// Whale: 11]

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
    'Raw Skeleton Fish',
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
