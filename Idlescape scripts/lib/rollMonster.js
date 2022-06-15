// * re-roll monster, re-enter combat zone

// ========================================================================== //
// * invoke and parameters

repeat(rollMonster, (sec = 5), (count = 100000))

function rollMonster() {
  // var ms1 = 1600 // delay after running from combat
  // var ms2 = 3000 // delay after entering combat zone

  var monsterSkipList = [
    // ! set monsterSkipList: comment out target monster
    // 'Guard ', // ruby
    'Black Knight ',
    'Infected Naga ', // g/r ore/bar, bracelet
    // 'Corrupted Tree ', // seeds
    'Bone Giant ', // 1h Chorus of Souls, cape
    'Moss Giant ', // 2h Moss Maul
    // 'Fire Giant ', // coal
    'Ice Giant ', // fish, crown, kala
  ]
  var combatZoneList = {
    0: 'Farm',
    1: 'Caves',
    2: 'City',
    3: 'Lava Maze',
    4: 'Corrupted Lands',
    5: 'Vally of Giants',
    6: 'Chaos Wastes',
  }
  // ! set combat zone ID
  var combatZoneID = 5
  // var combatZoneID = Object.keys(combatZoneList)[setCombatZoneID]
  console.log('combatZoneID:', combatZoneID)

  intoZonePage()
  repeat(checkMonster, (sec = 3), (count = 3))
  repeat(checkCombatZone, (sec = 3), (count = 3), (para = combatZoneID))

  // ========================================================================== //
  //

  function intoZonePage() {
    foo = document.querySelectorAll(
      '.drawer-item-icon[src="/images/combat/attack_icon.png"]'
    )
    foo[1].click()
  }

  function checkCombatZone(combatZoneID) {
    let combatZone = document.getElementsByClassName('combat-zone')
    // ! if using $ could be null
    // let combatZone = $('.combat-zone')
    if (combatZone.length == 0) {
      // wait until in zone page shows
      console.log('not in combat zone page, will check later')
      // setTimeout(checkCombatZone(), delay1) // ! delay not working
    } else {
      combatZone[combatZoneID].click()
    }
  }

  // checkCombatZone()
  // repeat(checkCombatZone) // * works

  function checkMonster() {
    for (let k = 0; k < monsterSkipList.length; k++) {
      monster = document.getElementsByClassName(monsterSkipList[k])

      if (monster.length > 0) {
        console.log('not target monster, running...')
        // document.getElementsByClassName('combat-bar-button')[0].click() // test
        document.getElementsByClassName('combat-bar-button')[4].click() // run
      } else {
        console.log('is target monster, fighting...')
      }
    }
  }
  // checkMonster()
  repeat(checkMonster) // * works
}

function repeat(fn = test, sec = 1, count = 5, para) {
  let i = 0
  function f() {
    fn(para)
    i += 1
    console.log(fn.name, i, 'times')
    setTimeout(function () {
      if (i < count) {
        f()
      }
    }, 1000 * sec)
  }
  f()
}
