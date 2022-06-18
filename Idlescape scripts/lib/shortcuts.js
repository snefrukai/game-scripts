// ========================================================================== //
// * shortcuts
// ========================================================================== //

// shortcuts() // ! test

function shortcuts(params) {
  // ========================================================================== //
  // close popups

  var popupSelector = '.MuiDialog-container'

  // when press 'Esc'
  document.onkeydown = function (e) {
    var closePopup = e.key === 'Escape' || e.key === 'Esc'
    if (closePopup) if (checkExist(popupSelector)) clickClose()
  }

  // when click outside of popup box
  document.querySelector('#root').onclick = function (e) {
    // only when popup is shown, only add click to popup
    if (checkExist(popupSelector)) {
      var popup = document.querySelectorAll(popupSelector)[0]
      popup.onclick = function (e) {
        // document.querySelector('#root').onclick = function (e) {
        var isClosest = e.target.closest('.MuiPaper-root') // popupBox
        if (!isClosest) clickClose()
      }
    }
  }

  function checkExist(selector) {
    var tar = document.querySelectorAll(selector)
    var isExist = tar.length !== 0
    // if (isExist) console.log(selector, 'exist') // ! test
    return isExist
  }

  function clickClose() {
    foo = '.close-dialog-button'
    if (checkExist(foo)) {
      document.querySelectorAll(foo)[0].click()
    }
  }
}

// ========================================================================== //
// * archive
// ========================================================================== //

// // ========================================================================== //
// // stopPropagation

// var foo = document.getElementsByTagName('body')[0]
// // var foo = document.getElementById('root')
// foo.onclick = function (e) {
//   var btnClose = document.querySelectorAll('.close-dialog-button')[0]
//   btnClose.click()
//   console.log('click')
// }

// // Prevent events from getting pass .popup
// var popupQuerySelector = 'MuiPaper-root' // MuiDialog-paper
// var popup = document.getElementsByClassName(popupQuerySelector)[0]
// popup.onclick = function (e) {
//   e.stopPropagation()
// }

// document.onkeydown = function (evt) {
//   evt = evt || window.event
//   var isEscape = false
//   if ('key' in evt) {
//     isEscape = evt.key === 'Escape' || evt.key === 'Esc'
//   }
//   if (isEscape) {
//     console.log('2')
//   }
// }

// // ! not work
// document.addEventListener('keypress', function (evt) {
//   if (e.key === 'Escape' || e.key === 'Esc') {
//     console.log('hit2')
//   }
// })
