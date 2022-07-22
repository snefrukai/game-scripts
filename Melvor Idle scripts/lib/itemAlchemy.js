// * alchemy unwanted high value items

itemAlchemy() // !test

function itemAlchemy(params) {
  // https://wiki.melvoridle.com/w/Item_Alchemy
  var target = ['Aeris', 'Glacia']
  var result = []
  var countMint = 4

  // get all hit items
  target.forEach((e) => {
    const hit = items.filter((i) => i.name.includes(e))
    result = result.concat(hit)
  })
  // console.log('itemAlchemy', result)

  // get items in bank as IDs
  var temp = {}
  result.forEach((e) => {
    const qty = getBankQty(e.id)
    if (qty > countMint) temp[e.name] = qty
  })
  result = temp
  // console.log('hit and count', result)

  // action
  // buff items are equipped through changeEquipmentAndBuff.js
  var skillItem1 = 'Item Alchemy III'
  var skillItem2 = Object.keys(result)[0] // ingredient item
  console.log(skillItem1, skillItem2)

  var start = undefined
  start = setSkillAction('Magic', skillItem1, skillItem2) // needs names w/o '_'
  start()

  // check item qty
  var checkQty = setInterval(() => {
    const qty = getBankQty(skillItem2)
    let log = 'qty: ' + skillItem2 + ' ' + qty

    if (qty <= countMint) {
      game.altMagic.stop()
      clearInterval(checkQty)
      log += ', check point'
    }
    console.log(log)
  }, 1000)

  // ========================================================================== //
  //

  // getBankQty(772) // ! test: Air_Chest 772
  // getBankQty('Aeris God Helmet')

  function getBankQty(itemID) {
    if (typeof itemID == 'string') {
      itemID = Items[itemID.replace(/\s/gm, '_')]
    }
    const inBank = bank[getBankId(itemID)]
    if (inBank) return inBank.qty
  }
}
