// * re-roll monster, re-enter combat zone
window.autoRollMonster = function (combatZoneID = 5) {
  window.monsterTargetList = [
    // ! comment out target monster
    'Guard ', // ruby
    // 'Black Knight ',
    'Infected Naga ', // g/r ore/bar, bracelet
    // 'Corrupted Tree ', // seeds
    // 'Bone Giant ', // 1h Chorus of Souls, cape
    // 'Moss Giant ', // 2h Moss Maul
    'Fire Giant ', // coal
    // 'Ice Giant ', // fish, crown, kala
  ]
  const combatZoneList = {
    0: 'Farm',
    1: 'Caves',
    2: 'City',
    3: 'Lava Maze',
    4: 'Corrupted Lands',
    5: 'Vally of Giants',
    6: 'Chaos Wastes',
  }
  // window.combatZoneID = 5
  // repeat(rollMonster, (sec = 3), (count = (60 / 5) * 60 * 24))
  // var ms1 = 1600 // delay after running from combat
  // var ms2 = 3000 // delay after entering combat zone

  // function rollMonster() {

  console.log('target combat zone:', combatZoneList[combatZoneID])
  repeat(checkMonster, (sec = 1.8), (count = 2))
  repeat(checkCombatZone, (sec = 0.8), (count = 2), (para = combatZoneID))

  // ========================================================================== //
  //

  // function checkAutoEatThreshold(params) {
  //   var hpChar = document
  //     .querySelectorAll('.combat-info-bar-health-text')[0]
  //     .textContent.match(/\d+/g)
  //   var hpCharCurrent = hpChar[0]
  //   var hpCharMax = hpChar[1]
  //   var autoEatThreshold = hpCharMax * 0.2
  //   if (hpCharCurrent < autoEatThreshold) {
  //     clickBtnRun()
  //     console.log('run out of food')
  //   } else {
  //     console.log('has food')
  //   }
  // }

  // checkCombatZone()
  // repeat(checkCombatZone) // * works
  function checkCombatZone(combatZoneID) {
    var combatZone = document.querySelectorAll('.combat-zone')
    // ! if using $ could be null
    // let combatZone = $('.combat-zone')
    if (combatZone.length == 0) {
      // wait until in zone page shows
      // console.log('not in combat zone page, will check later')
      // setTimeout(checkCombatZone(), delay1) // ! delay not working
    } else {
      combatZone[combatZoneID].click()
    }
  }

  // repeat(checkMonster) // * works
  function checkMonster() {
    var foo = document.querySelectorAll('.combat-monster-area')[0]

    if (typeof foo == 'undefined') {
      console.log('not in combat || no active monbster')
      return
    } else {
      var bar = foo.childNodes[0]
      if (typeof bar !== 'undefined') {
        var getMonsterCurrent = bar.className
        // ! 拿不到className的可能：刷新monster时；不在combat page时

        if (monsterTargetList.includes(getMonsterCurrent)) {
          // console.log(getMonsterCurrent, 'is target monster')
        } else {
          console.log(getMonsterCurrent, ': is not target monster, running...')
          // clickBtnRun()
          document.querySelectorAll('.combat-bar-button')[4].click()
        }
      }
    }

    // 相当于自己写了一个 if str in arr
    // for (let i = 0; i < monsterTargetList.length; i++) {
    //   var getMonsterCurrent = document.getElementsByClassName(
    //     monsterTargetList[i]
    //   )
    //   if (getMonsterCurrent.length > 0) {
    //     console.log(getMonsterCurrent, 'is target monster, fighting...')
    //   } else if (
    //     typeof document.getElementsByClassName('combat-monster-area') !==
    //     'undefined'
    //   ) {
    //     console.log('is not target monster, running...')
    // clickBtnRun()
    //   }
    // }
  }

  function repeat(fn = test, sec = 1, count = 5, para) {
    let i = 0
    function f() {
      fn(para)
      i += 1
      // if (fn == rollMonster) console.log(fn.name, i, 'times')
      setTimeout(function () {
        if (i < count) f()
      }, 1000 * sec)
    }
    f()
  }
}

var beginAutoRollMonster = setInterval(autoRollMonster, 3000)
// autoRollMonster((combatZoneID = 5)) // ! test
