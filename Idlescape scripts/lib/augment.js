// auto select item and augment
var target = 'black_daggers'
var augLvlMax = 3
var autoAug = setInterval(checkAugment, 2000)

checkAugment((target = 'black_daggers'))
function checkAugment() {
  const btnAug = document.querySelector('.enchanting-window-apply-button')
  const currentItemAugLvl = document
    .querySelector('.augmented-text')
    .textContent.replace('+', '')

  if (btnAug != null && currentItemAugLvl < augLvlMax) {
    btnAug.click()
  } else {
    const itemList = document.querySelectorAll('.augmenting-items-list > div')
    itemList.forEach((e) => {
      let hit = false
      let itemAugLvl = ''

      e.childNodes.forEach((k) => {
        if (
          k.className == 'item-icon' &&
          k.getAttribute('src').includes(target)
        ) {
          hit = true
          // console.log('hit:', target, hit, k)
        } else if (k.className == 'item-augment') {
          itemAugLvl = k.textContent.replace('+', '')
        }
      })
      // console.log(hit, itemAugLvl < checkPoint)
      if (hit && itemAugLvl < augLvlMax) {
        e.click()
        // console.log('hit', itemAugLvl, e)
      }
    })
  }
}

// clearInterval(autoAug)

// ========================================================================== //
//
