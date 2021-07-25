var email = document.getElementById("email");
email.addEventListener("keyup", function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById("submit").click();
    }
})

var password = document.getElementById("password");
password.addEventListener("keyup", function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById("submit").click();
    }
})

async function validateAndLogin(){
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    if(email.value !== "" && password.value !== ""){
        let requestSettings = {"method": "POST", "headers": {"Content-Type": "application/json"}, "body": JSON.stringify({"email": email.value, "password": password.value})}
        try{
            let request = await fetch("/", requestSettings);
            let response = await request.json();
            let data  = await response;
            if(data.success === true){
                window.location.href = "/notes";
            }
            else{
                let alerts = document.getElementById("alerts");
                alerts.style.display = "block";
                alerts.className = "alert-danger alerts"
                alerts.innerHTML = "Invalid credentials";
                setTimeout(() => {alerts.style.display = "none"}, 3000)
            }
        }
        catch(error){
            console.log(error)
        }
    }
    else{
        let alerts = document.getElementById("alerts");
        alerts.style.display = "block";
        alerts.className = "alert-primary alerts"
        alerts.innerHTML = "Enter a valid email and password!";
        setTimeout(() => {alerts.style.display = "none"}, 3000)
    }
    
}


let confirmPassword = document.getElementById("confirmpassword");
confirmPassword.addEventListener("keyup", function(event){
    event.preventDefault();
    let password = document.getElementById("password");
    if(password.value !== confirmPassword.value && confirmPassword.value.length > 0){
        let alertpassword = document.getElementById("passwordAlerts")
        alertpassword.style.cssText = "color:red"
        alertpassword.innerHTML = "Password mismatch with confirm Password."
    }
    else{
        let alertpassword = document.getElementById("passwordAlerts")
        alertpassword.innerHTML = "";
    }
})
confirmPassword.addEventListener('keydown', function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById("submit").click();
    }
})

async function validateAndRegister(){
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var confirmPassword = document.getElementById("confirmpassword");
    if(email.value !== "" && password.value !== ""){
        let requestSettings = {"method": "POST", 
                               "headers": {"Content-Type": "application/json"}, 
                               "body": JSON.stringify({"email": email.value, "password": password.value, "confirmPassword": confirmPassword.value})}
        try{
            let request = await fetch("/register", requestSettings);
            let response = await request.json();
            let data  = await response;
            if(data.success === true){
                let alerts = document.getElementById("alerts");
                alerts.style.display = "block";
                alerts.className = "alert-success alerts"
                alerts.innerHTML = "Registered successfully";
                setTimeout(function(){window.location.href = "/";}, 2000)
            }
            else{
                let alerts = document.getElementById("alerts");
                alerts.style.cssText = "display:block;height:53px;";
                alerts.className = "alert-danger alerts"
                alerts.innerText = response.reason;
                setTimeout(() => {alerts.style.display = "none"}, 3000)

            }
        }
        catch(error){
            console.log(error)
        }     
    }
    else{
        let alerts = document.getElementById("alerts");
        alerts.style.display = "block";
        alerts.className = "alert-primary alerts"
        alerts.innerHTML = "Enter a valid email and password!";
        setTimeout(() => {alerts.style.display = "none"}, 3000)
    }
    
}