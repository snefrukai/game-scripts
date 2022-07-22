// * alchemy unwanted high value items
// https://wiki.melvoridle.com/w/Item_Alchemy
const targetKeywords = [
  ['God', 200], // in case it needs more for upgrade in future expansions
  'Godsword',
  'Infernal Cape',
  'Cape of Prat',
  // 'Aeris',
  // 'Glacia',
  // 'Ragnar',
  // 'Shipwheel', GP 10k
  // 'Antique Vase', GP 30k
  // 'Bobby's Pocket' GP 4k
  // 'Giant Club', GP 15k
]

var itemAlchemy = setInterval(() => {
  const skillItem1 = 'Item Alchemy III'
  var target = getItemWithQty(targetKeywords)
  console.log('target', target)

  if (target == {}) {
    // end if no target
    game.altMagic.stop()
    clearInterval(itemAlchemy)
    console.log(skillItem1, 'done')
  } else {
    // action
    // buff items are equipped through changeEquipmentAndBuff.js
    const skillItem2 = Object.keys(target)[0] // ingredient item
    const start = setSkillAction('Magic', skillItem1, skillItem2) // needs names w/o '_'
    // console.log(skillItem1, ',', skillItem2, getBankQty(skillItem2))
    // start()
  }
  // cant show when hit check point
}, 1000 * 2)
// clearInterval(itemAlchemy)

// ========================================================================== //
//

// getItemWithQty() // ! test
function getItemWithQty(targetKeywords) {
  var result = []
  targetKeywords.forEach((target) => {
    const hasCountMin = typeof target == 'object'
    const keyword = hasCountMin ? target[0] : target
    const countMin = hasCountMin ? target[1] : 4
    items.forEach((item) => {
      if (item.name.includes(keyword)) {
        const bankQty = getBankQty(item.id)
        if (bankQty > countMin) {
          result[item.name] = bankQty
        }
      }
    })
  })
  // console.log('getItemWithQty', result)
  return result
}

// getBankQty(772) // ! test: Air_Chest 772
// getBankQty('Aeris God Helmet')
function getBankQty(itemID) {
  if (typeof itemID == 'string') {
    itemID = Items[itemID.replace(/\s/gm, '_')]
  }

  const inBank = bank[getBankId(itemID)]
  if (inBank) {
    return inBank.qty
  }
}

// ========================================================================== //
//

getHighValueItems() // ! test
function getHighValueItems(params) {
  var result = {}

  bank.forEach((e) => {
    const val = 35000
    const qty = 4
    const filter = !Items[e.id].includes('God')
    if (e.sellsFor >= val && e.qty > qty && filter) {
      result[Items[e.id]] = e.qty
    }
  })
  console.log(result)
}
