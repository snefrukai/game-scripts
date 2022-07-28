// var autoTrainNotMaxMastery = setInterval(() => {
//   var skillTarget = [
//     // *gathering
//     // 'Thieving',
//     'Fishing',
//     'Mining',
//     'Woodcutting',
//     // crafting
//     'Cooking',
//     'Smithing',
//     'Runecrafting',
//     'Herblore',
//     'Fletching',
//     'Crafting',
//   ]
//   const i = 0
//   trainNotMaxMastery(skillTarget[i])
//   // console.log('autoTrainNotMaxMastery: checking', skillTarget[i], 'in 60s')
// }, 1000 * 60)

// clearInterval(autoTrainNotMaxMastery)

// ========================================================================== //
//

// * non mat dependent skill无需自己写code，使用AQ用mastery lvl作为trigger即可
// trainNotMaxMastery('Thieving') // ! test
// trainNotMaxMastery('Fishing') // ! test

// * mat dependent skill
// trainNotMaxMastery('Cooking') // ! test
// todo mastery not max && has mat

// * Smithing
// priorities:
// > axe
// > shield
// > dagger
// trainNotMaxMastery('Smithing', 'Adaman') // ! test

// * Mining
// 用SEMI auto mine
// priorities:
// > dragon
// > runite

// trainNotMaxMastery('Mining') // ! test

// * Woodcutting
// 用自己写的loop取2 tree即可
// trainNotMaxMastery('Woodcutting') // ! test

function trainNotMaxMastery(skill, subtype = undefined) {
  const notMaxMastery = getNotMaxMastery(skill, subtype)
  const skillItems = Object.keys(notMaxMastery)
  const hasTwoSkillItems = ['Woodcutting'].includes(skill)
  // backward from highest lvl target
  var i = skillItems.length - 1
  // woodcutting: log1, log2
  // cooking: active/passive, item(recipe)
  var skillItem2 = hasTwoSkillItems ? skillItems[i - 1] : undefined
  // console.log('notMaxMastery:', skill, notMaxMastery)

  // *skip unmet skill item
  // var start = setSkillAction(skill, skillItems[i], skillItem2)
  if (setSkillAction(skill, skillItems[i], skillItem2)() == false) {
    i -= 1
    skillItem2 = hasTwoSkillItems ? skillItems[i - 1] : undefined
    setSkillAction(skill, skillItems[i], skillItem2)
  }
  console.log(
    `trainNotMaxMastery: ${skillItems[i]}, ${skillItem2}.`,
    notMaxMastery
  )
  // return start()

  // ========================================================================== //
  //

  function getNotMaxMastery(skill, subtype) {
    var masteryNames = Object.keys(masteryIDs[skill])
    var result = {}

    if (subtype != undefined) {
      masteryNames = masteryNames.filter((k) => k.includes(subtype))
    }

    masteryNames.forEach((e) => {
      const masteryLevel = getMasteryLevel(Skills[skill], masteryIDs[skill][e])
      if (masteryLevel != 99) {
        result[e] = masteryLevel
      }
    })

    return result
  }
}

// * Cooking
// setSkillAction('Cooking', 'Active', 'Sardine')

// ========================================================================== //
//

filterCookingRecipes('Cooking')

function filterCookingRecipes(skillName) {
  var recipe = Cooking.recipes
  var targetFood = 'Whale'
  var targetRatio = 0
  var matsQty = []
  var cookHealRatios = {}

  recipe.forEach((recipe) => {
    const food = items[recipe.itemID]
    const modifier = -(0.1 + 0) // chef hat
    const ratio = food.healsFor / (recipe.baseInterval / 1000 + modifier)

    if (food.name == targetFood) targetRatio = ratio
    cookHealRatios[food.name] = ratio

    // * get recipe's ingredient's bank qty
    var temp = []
    recipe.itemCosts.forEach((e) => {
      const itemID = e.id
      temp.push(Items[itemID], getBankQty(itemID))
    })
    matsQty.push(temp)
  })

  // * if target's heal/cookingInterval >= 1/2 whale's
  // * > it should be fished and cooked sequentially
  // (cooking, fishing's mastery:pool=2:1)

  var targetFish = []
  Object.keys(cookHealRatios).forEach((k) => {
    if (cookHealRatios[k] >= targetRatio / 2) {
      targetFish.push(k)
    }
  })

  console.log('matsQty:', matsQty)
  console.log('cookHealRatios:', cookHealRatios, targetRatio, targetFish)
}
