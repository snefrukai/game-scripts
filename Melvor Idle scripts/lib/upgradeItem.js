// auto upgrade selected item by item ID at set interval

window.upgradeItem_repeat = function (itemID, fn, count, minute) {
  function upgradedItemID(itemID) {
    return items[itemID].trimmedItemID
  }

  // function upgrade(itemID, qty) {
  //   confirmUpgradeItem(itemID, upgradedItemID(itemID), qty)
  // }

  // ! func name 'upgradeItemAll' could cause freeze in tampermonkley
  function upgradeAll(itemID) {
    for (let k = 0; k < itemID.length; k++) {
      confirmUpgradeItemAll(itemID[k], upgradedItemID(itemID[k]))
      console.log('upgrading item ID', itemID[k])
    }
  }

  function repeat(itemID, fn = upgradeAll, count = 10000, minute = 5) {
    let i = 0
    function recur() {
      fn(itemID)
      i += 1
      console.log('upgraded', i, 'times')
      setTimeout(function () {
        if (i < count) {
          recur()
        }
      }, 1000 * 60 * minute)
    }
    recur()
  }

  repeat(itemID)
}

upgradeItem_repeat([
  768, // air shard
  769, // water ...
  770, // earth ...
  771, // fire ...
  // 890, // mys stone
  // 886, // mys stone charge
])
