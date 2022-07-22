// * add mastery pool xp to skill after overnight
window.addPoolXPForCount = function (skillID, count, sec = 30) {
  var i = 0
  var checkPool = setInterval(() => {
    checkPoint = parseFloat(
      document.querySelector('.mastery-pool-xp-progress-15').textContent
    )
    // if (checkPoint < 95.5) {
    addMasteryXPToPool(skillID, 4046897, false, true)
    i = i + 1
    console.log('add pool xp:', Skills[skillID], i, 'times')
    if (i == count) {
      clearInterval(checkPool)
      console.log('add pool xp: finished')
    }
    // }
  }, 1000 * sec)
}

// addPoolXPForCount(15, 2)

// ========================================================================== //
// todo: input box for count
// todo: btn for event

// ========================================================================== //
// !
// for (let i = 0; i < count; i++) { // ! why not work?
