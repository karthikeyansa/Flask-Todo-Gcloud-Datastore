function validateAndLogin(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if(email && password){
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/", true);
        xhttp.responseType = "json";
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        xhttp.onreadystatechange = function(){
            if(this.status === 200 && this.readyState === 4){
                window.location.href = "/";
            }
        }
        xhttp.send(JSON.stringify({"email": email, "password": password}))
    }
    else{
        alert("Enter a valid email and password!")
    }
    
}

function validateAndRegister(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if(email && password){
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/register", true);
        xhttp.responseType = "json";
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        xhttp.onreadystatechange = function(){
            if(this.status === 200 && this.readyState === 4){
                window.location.href = "/";
            }
        }
        xhttp.send(JSON.stringify({"email": email, "password": password}))
    }
    else{
        alert("Enter a valid email and password!")
    }
    
}