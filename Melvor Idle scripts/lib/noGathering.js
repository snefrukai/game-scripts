// * hide no gathering account's skills
window.checkNoGathering = function () {
  var noGatheringSkills = [
    0, // woodcutting
    1, // mining
    2, // firemaking
    4, // fishing
    10, // thiving
    20, // agility
    22, // astrology
  ]

  if (username && username.includes('NG')) {
    console.log('Detected "No Gathering".')

    noGatheringSkills.forEach((skill) => {
      $('#nav-skill-tooltip-' + skill.toString()).remove()

      // in-game func
      // ! could still enter the skill page
      if (skillsUnlocked[skill] != false) {
        skillsUnlocked[skill] = false
        forceStopSkill(skill)
        if (
          PAGES[currentPage].skillID !== undefined &&
          PAGES[currentPage].skillID === skill
        )
          changePage(Pages.Bank)
        if (defaultPageOnLoad === skill)
          changeSetting(2, Pages.Bank, false, false)
        updateSkillWindow(skill) // update ui
        updateSkillLevelCap()
      }
    })

    console.log('"No Gathering" skills locked and hidden.')
  }
}

checkNoGathering()
