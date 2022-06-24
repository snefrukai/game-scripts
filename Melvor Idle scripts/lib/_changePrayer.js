// changePrayer([0, 1]) // ! test
changePrayer(['Thick_Skin', 'Burst_of_Strength']) // ! test

window.changePrayer = function (activatePrayer = []) {
  var arrTemp = []
  for (const i of activatePrayer) {
    if (typeof i == 'string') arrTemp.push(Prayers[i])
    // console.log(i)
  }
  // console.log(arrTemp)
  activatePrayer = arrTemp

  // ! from Action Queue
  for (const i of player.activePrayers.entries()) {
    // if target prayer is active, leave it unchangde
    activatePrayer.includes(i[0])
      ? activatePrayer.splice(
          activatePrayer.findIndex((a) => a == i[0]),
          1
        )
      : activatePrayer.unshift(i[0]) // adds to the beginning of array
  }
  for (const i of activatePrayer) player.togglePrayer(i) // in-game func
}
