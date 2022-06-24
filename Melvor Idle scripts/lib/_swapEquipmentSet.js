var equipmentSetNonCombat = 3
swapEquipmentSet() // ! test

function swapEquipmentSet() {
  const playerAttackTypes = getPlayerAttackTypes(equipmentSetNonCombat)
  var setTarget = null

  if (game.activeSkill != 1) {
    // non-combat
    setTarget = equipmentSetNonCombat
  } else {
    // combat
    const setSameType = getSetByEnemy((setDefault = true))
    setTarget = getSetByEnemy()

    if (setTarget == -1) {
      // dont even have same attack type set w the enemy
      if (setSameType == -1) return console.log('!go get a weapon man!')
      setTarget = setSameType
    }
    // console.log(setTarget, playerAttackTypes)
  }

  if (setTarget != player.selectedEquipmentSet) {
    player.changeEquipmentSet(setTarget)
    console.log('swap to set', setTarget)
    return true
  }
  return false

  // ========================================================================== //
  //

  // getSetTarget()
  function getSetByEnemy(setDefault) {
    if (setDefault == true) {
      // if enemy is melee, but dont have magic set > use the first melee set
      setTarget = combatManager.enemy.attackType
    } else {
      switch (combatManager.enemy.attackType) {
        case 'melee':
          setTarget = 'magic'
        case 'ranged':
          setTarget = 'melee'
        case 'magic':
          setTarget = 'melee'
      }
    }
    // console.log('enemy type is', combatManager.enemy.attackType)
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
  }
}

// ========================================================================== //
//

// AttackTypeID
// player.attackType

// todo: if no triangle set, get the first same attack style set

// player.equipmentSets.splice(equipmentSetNonCombat, 1)// ! 会把装备删掉！
