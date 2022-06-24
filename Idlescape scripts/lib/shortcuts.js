// * shortcuts
// shortcuts() // ! test
function shortcuts(params) {
  // close popups
  const popupSelector = '.MuiDialog-container'
  const closeSelector = '.close-dialog-button'

  // when press 'Esc'
  document.onkeydown = function (e) {
    const closePopup = e.key === 'Escape' || e.key === 'Esc'
    if (closePopup) if (checkExist(popupSelector)) clickClose(closeSelector)
  }

  // when click outside of popup box
  document.querySelector('#root').onclick = function (e) {
    // only when popup is shown, only add click to popup
    if (checkExist(popupSelector)) {
      const popup = document.querySelectorAll(popupSelector)[0]
      popup.onclick = function (e) {
        // document.querySelector('#root').onclick = function (e) {
        var clickOnPopup = e.target.closest('.MuiPaper-root') // popupBox
        if (!clickOnPopup) clickClose(closeSelector)
      }
    }
  }

  function checkExist(selector) {
    const isExist = document.querySelectorAll(selector).length !== 0
    return isExist
  }

  function clickClose(selector) {
    if (checkExist(selector)) {
      document.querySelectorAll(selector)[0].click()
      return true
    }
    return false
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
