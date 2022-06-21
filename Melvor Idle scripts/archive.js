// ========================================================================== //
// * get item's id

const getID = function () {
  id = this.id
  id = id.slice(id.lastIndexOf('-') + 1)
  console.log(id)
  return id
}

document.getElementById('bank-item-button-890').onmouseover = getID
// console.log(id)

// ========================================================================== //
// ! bugs
// ! clicking upgrade it goes to select
// ! func name 'upgradeItemAll' could cause freeze in tampermonkley

// ========================================================================== //
// upgrade item

// v0
id = 886
// click item
$('#bank-item-button-'.concat(id.toString())).click()
// click "upgrade"
$('.bank-container-upgrade-item .btn').click()
// click "upgrade all"
$('#view-upgrade-btn-all').click()

// v2
// ! can only fire once, then btn-upgrade doesnt responnd

function upgradeItemByID() {
  $('.bank-container-upgrade-item .btn').click()
  $('#view-upgrade-btn-all').click()

  // foo = $('.bank-container-upgrade-item .btn')
  // console.log(foo.length)
  // setTimeout(foo.click(), 300)

  // bar = $('#view-upgrade-btn-all')
  // setTimeout(bar.click(), 300)
}

id = 886
$('#bank-item-button-'.concat(id.toString())).click()
upgradeItemByID()

// v3
// ! Uncaught TypeError: Cannot read properties of null (reading 'click')
// ! using "upgradeItem" could raise some conflict

function upgradeItemByID() {
  // $('#bank-item-button-'.concat(id.toString())).click()
  $('#bank-item-button-886').click()
  $('#bank-item-button-890').click()
  $('.bank-container-upgrade-item .btn').click()
  $('#view-upgrade-btn-all').click()
}
upgradeItemByID()

// * help version (w in-game function)

// let itemID = 890
let upgradedItemID = items[itemID].trimmedItemID
confirmUpgradeItemAll(itemID, upgradedItemID)

let qty = 1
confirmUpgradeItem(itemID, upgradedItemID, qty)

// ? in-game function
function confirmUpgradeItemAll(itemID, upgradeItemID) {
  let qtyToUpgrade = Infinity
  items[upgradeItemID].itemsRequired.forEach((req) => {
    const bankQty = getBankQty(req[0])
    const amountPossible = Math.floor(bankQty / req[1])
    if (amountPossible < qtyToUpgrade) qtyToUpgrade = amountPossible
  })
  if (qtyToUpgrade > 0) confirmUpgradeItem(itemID, upgradeItemID, qtyToUpgrade)
}
