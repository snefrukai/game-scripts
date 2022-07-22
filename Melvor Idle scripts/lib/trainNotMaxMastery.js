// autoTrainNotMaxMastery('Smithing', 'Adaman')
// autoTrainNotMaxMastery('Mining')
autoTrainNotMaxMastery('Woodcutting')

function autoTrainNotMaxMastery(skill, subtype) {
  var notMaxMastery = getNotMaxMastery(skill, subType)
  console.log('notMaxMastery', skill, notMaxMastery)

  var hasTwoSkillItems = ['Woodcutting'].includes(skill)
  // wood: log1, log2
  // cook: active/passive, recipe

  var start = undefined
  const skillItem = Object.keys(notMaxMastery)
  var log = skillItem[0]

  if (hasTwoSkillItems) {
    start = setSkillAction(skill, skillItem[0], skillItem[1])
    log += ', ' + skillItem[1]
  } else {
    start = setSkillAction(skill, skillItem[0])
  }
  console.log('autoTrainNotMaxMastery:', log)
  return start()

  // ========================================================================== //
  //

  function getNotMaxMastery(skill, subtype) {
    var masteryNames = Object.keys(masteryIDs[skill])
    var notMaxMastery = {}

    if (subtype != undefined) {
      masteryNames = masteryNames.filter((k) => k.includes(subType))
    }

    masteryNames.forEach((e) => {
      const masteryLevel = getMasteryLevel(Skills[skill], masteryIDs[skill][e])
      if (masteryLevel != 99) notMaxMastery[e] = masteryLevel
    })

    return notMaxMastery
  }
}
