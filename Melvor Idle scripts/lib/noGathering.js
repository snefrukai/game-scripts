// * hide no gathering account's skills
function checkNoGathering() {
  if (username && username.includes('NG')) {
    console.log('Detected No Gathering.')
    hideNoGathering()
    console.log('No Gathering skills hidden.')
  }

  function hideNoGathering() {
    // $('#nav-skill-tooltip-1').classList.toggle('d-none')
    // $('#nav-skill-tooltip-0').remove()

    var noGatheringSkills = [
      '#nav-skill-tooltip-0', // woodcutting
      '#nav-skill-tooltip-1', // mining
      '#nav-skill-tooltip-2', // firemaking
      '#nav-skill-tooltip-4', // fishing
      '#nav-skill-tooltip-10', // thiving
      '#nav-skill-tooltip-20', // agility
      '#nav-skill-tooltip-22', // astrology
    ]

    for (var i = 0; i < noGatheringSkills.length; i++) {
      $(noGatheringSkills[i]).remove()
    }
  }
}

// checkNoGathering()
