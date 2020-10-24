
function changePassword(e){
    e.preventDefault()
    const uname = document.querySelector('#pwd').value.trim()
    const npwd = document.querySelector('#npwd').value.trim()
    const cnpwd = document.querySelector('#cnpwd').value.trim()

    if(npwd === cnpwd){
        document.querySelector('#pwd').value = npwd
        document.querySelector('#npwd').value = "password12345"
        document.querySelector('#cnpwd').value = "password12345"
        return alert("Password changed")
    }else{
        return alert("Password and confirmed password do not match. Please check again!")
    }
}
