window.agilitySetting = [
  {
    name: 'Thieving',
    obstacle: {
      0: 'Rope Climb',
      4: 'Rooftop Run',
    },
    // obstacle: [
    //   [0, 'Rope Climb'],
    //   [4, 'Rooftop Run'],
    // ],
  },
  {
    name: 'crafting',
    obstacle: {
      3: 'Cave Climb',
      5: 'Lake Swim',
      6: 'Boulder Trap',
      7: 'Spike Jump',
      8: 'Ice Jump',
      11: 'Pillar of Combat',
    },
  },
  {
    name: 'combat',
    obstacle: {
      2: 'Pipe Balance',
      3: 'Coal Stones',
      5: 'Tree Hop',
      6: 'Heat Trap',
      7: 'Tree Hang',
      8: 'Ice Jump',
      9: 'Boulder Move',
      11: 'Pillar of Combat',
    },
  },
]

window.autoChangeObstacle = function (skillTarget) {
  // equip cape

  // change ob if not as setting
  var obCurrent = getObCurrent()
  var obSetting = agilitySetting.find((e) =>
    e.name.includes(skillTarget)
  ).obstacle
  // console.log(settingObstacle, obstacleCurrent)
  for (const key in obSetting) {
    if (obSetting[key] != obCurrent[key]) {
      changeOb(key, obSetting[key])
      console.log(`${key}: ${obSetting[key]}, done`)
      // if using arr in seting, would be like:
      // obstacleSetting[1] != obstacleCurrent[0]
      // not very intuitive
    }
  }

  // ========================================================================== //
  //

  function getObCurrent(params) {
    var obCurrent = []
    agilityObstacleMenus.forEach((e) => obCurrent.push(e.name.innerText))
    return obCurrent
  }

  // setAgilityObstacle(0, 'Rope Climb') // ! test
  // setAgilityObstacle(0, 'Cargo Net') // ! test
  function changeOb(iCategory, obStr) {
    // open ob menu
    agilityObstacleMenus[iCategory].selectObstacleButton.click()

    // select ob
    var obObj = agilityObstacleSelectMenus.find(
      (e) => e.name.innerText == obStr
    )
    obObj.link.click()

    // v2
    // no significant time improvement ?
    // agilityObstacleSelectMenus.forEach((e) => {
    //   if (e.name.innerText == obStr) {
    //     e.link.click()
    //     return true
    //   }
    // })

    // confirm build
    document.querySelector('.swal2-confirm.btn.btn-primary.m-1').click()
  }
}

autoChangeObstacle('Thieving') // ! test

// ========================================================================== //
//

// Action Queue

// case 'Build Agility Obstacle': {
//         const obstacleID = Agility.obstacles.findIndex(
//           (a) => a.name == skillItem
//         )
//         const obstacleNumber = parseInt(actionName) - 1
//         return () => {
//           if (chosenAgilityObstacles[obstacleNumber] == obstacleID) return true
//           if (
//             !canIAffordThis(
//               Agility.obstacles[obstacleID].cost,
//               Agility.obstacles[obstacleID].skillRequirements,
//               obstacleID
//             )
//           )
//             return false
//           if (chosenAgilityObstacles[obstacleNumber] >= 0)
//             destroyAgilityObstacle(obstacleNumber, true)
//           buildAgilityObstacle(obstacleID, true)
//           return true
//         }
//       }
