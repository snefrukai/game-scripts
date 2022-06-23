swapEquipmentSet() // ! test

function swapEquipmentSet() {
  const equipmentSetNonCombat = 3
  var playerAttackTypes = getPlayerAttackTypes(equipmentSetNonCombat)
  var setTarget = getSetTarget()
  var setSameType = getSetTarget((setDefault = true))

  if (setTarget == -1) {
    // dont even have same attack type set w the enemy
    if (setSameType == -1) return console.log('!go get a weapon man!')
    setTarget = setSameType
  }
  player.changeEquipmentSet(setTarget)
  // console.log(setTarget, playerAttackTypes)
  console.log('switched to set', setTarget)

  // getSetTarget()
  function getSetTarget(setDefault) {
    var setTarget = ''
    switch (combatManager.enemy.attackType) {
      case 'melee':
        setTarget = 'magic'
      case 'ranged':
        setTarget = 'melee'
      case 'magic':
        setTarget = 'melee'
      default:
        setTarget = combatManager.enemy.attackType
    }
    // if enemy is melee, but dont have magic set > use the first melee set
    if (setDefault) setTarget = combatManager.enemy.attackType
    return playerAttackTypes.findIndex((e) => e == setTarget)
  }

  // getPlayerAttackTypes() // ! test
  function getPlayerAttackTypes(equipmentSetNonCombat = 3) {
    var arr = []
    for (let i = 0; i < player.equipmentSets.length; i++) {
      if (i == equipmentSetNonCombat) continue
      // skip non-combat set
      arr.push(player.equipmentSets[i].slots.Weapon.item.attackType)
    }
    return arr

    // var i = 0
    // player.equipmentSets.forEach((e) => {
    //   if (i == equipmentSetNonCombat) return true
    //   arr.push(e.slots.Weapon.item.attackType)
    //   i++
    // })
  }
}

// ========================================================================== //
//

// AttackTypeID
// player.attackType

// todo: if no triangle set, get the first same attack style set

// player.equipmentSets.splice(equipmentSetNonCombat, 1)// ! 会把装备删掉！
