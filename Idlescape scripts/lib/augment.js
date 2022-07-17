// auto select item and agument

var target = 'black_daggers'
var autoAug = setInterval(checkAug, 2000)

function checkAug() {
  var btnAug = document.querySelector('.enchanting-window-apply-button')
  var checkPoint = document
    .querySelector('.augmented-text')
    .textContent.includes('10')

  if (btnAug != null && !checkPoint) btnAug.click()
  else {
    var itemsAug = document.querySelectorAll(
      '.augmenting-items-list > div > img'
    )

    for (let i = 0; i < itemsAug.length; i++) {
      var imgSrc = itemsAug[i].getAttribute('src')
      const hit = imgSrc.includes(target)
      if (hit) {
        console.log('hit:', imgSrc)
        itemsAug[i].click()
        break // skip items w agu lvls
      }
    }
  }
}

// clearInterval(autoAug)

// ========================================================================== //
//
