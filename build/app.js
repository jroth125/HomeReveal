const mySwitch = document.getElementById('mySwitch')

chrome.storage.sync.get(['homeRevealOn'], (result) => {
    mySwitch.checked = result.homeRevealOn ? true : false
})

mySwitch.onclick = function(e) {
    console.log(e.target.checked)
    if (e.target.checked) {
        chrome.storage.sync.set({'homeRevealOn': true}, () => {
            console.log('it is set')
        })
    } else {
        chrome.storage.sync.set({'homeRevealOn': false}, () => {
            console.log('it is set to false')
        })
    }
    chrome.storage.sync.get(['homeRevealOn'], (result) => {
        console.log('the result is:', result.homeRevealOn)
    })
}
