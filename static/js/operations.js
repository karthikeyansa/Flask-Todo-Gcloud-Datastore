// login

let loginEmail = document.getElementById("loginEmail");
if(loginEmail){
    loginEmail.addEventListener("keypress", function(event){
        if(event.keyCode === 13){
            let loginButton = document.getElementById("loginSubmit");
            loginButton.click();
        }
    })
}

let loginPassword = document.getElementById("loginPassword");
if(loginPassword){
    loginPassword.addEventListener("keypress", function(event){
        if(event.keyCode === 13){
            let loginButton = document.getElementById("loginSubmit");
            loginButton.click();
        }
    })
}

let loginSubmit = document.getElementById("loginSubmit");
if(loginSubmit){
    loginSubmit.addEventListener("click", function(){
        this.setAttribute("disabled", true);
        validateAndLogin();
    })
}
async function validateAndLogin(){
    let email = document.getElementById("loginEmail");
    let password = document.getElementById("loginPassword");
    let requestSettings = {"method": "POST", "headers": {"Content-Type": "application/json"}, 
                            "body": JSON.stringify({"email": email.value, "password": password.value})}
    if(email.value !== "" && password.value !== ""){
        try{
            let request = await fetch("/", requestSettings);
            let response = await request.json();
            let data  = await response;
            if(data.success === true){
                window.location.href = "/app";
            }
            else if(data.success == false){
                let alerts = document.getElementById("alerts");
                alerts.style.display = "block";
                alerts.style.backgroundColor= "red";
                alerts.innerHTML = data.message;
                setTimeout(() => {alerts.style.display = "none"}, 3000)
            }
        }
        catch(error){
            console.log(error)
        }
        finally{
            let loginButton = document.getElementById("loginSubmit");
            loginButton.removeAttribute("disabled");
        }
    }
    else{
        let alerts = document.getElementById("alerts");
        alerts.style.display = "block";
        alerts.style.backgroundColor = "red";
        alerts.style.width = "470px"
        alerts.innerHTML = "Enter a valid email and password!";
        setTimeout(() => {alerts.style.display = "none"}, 3000);
        let loginButton = document.getElementById("loginSubmit");
        loginButton.removeAttribute("disabled");
    }
}

// Register

let registeremail = document.getElementById("registerEmail");
if(registeremail){
    registeremail.addEventListener("keyup", function(event){
        if(event.keyCode === 13){
            event.preventDefault();
            validateAndRegister();
        }
    })
}

let registerpassword = document.getElementById("registerPassword");
if(registerpassword){
    registerpassword.addEventListener("change", function(){
        let confirmPassword = document.getElementById("confirmPassword");
        let alertpassword = document.getElementById("passwordAlerts");
        if(confirmPassword.value !== '' && this.value !== confirmPassword.value){
            alertpassword.style.cssText = "color:red";
            alertpassword.innerHTML = "Password mismatch with confirm Password.";
        }
        else{
            alertpassword.innerHTML = "";
        }
    })
    registerpassword.addEventListener("keyup", function(event){
        let confirmPassword = document.getElementById("confirmPassword");
        let alertpassword = document.getElementById("passwordAlerts");
        if(this.value !== confirmPassword.value && this.value.length !== 0 && confirmPassword.value.length !== 0){
            alertpassword.style.cssText = "color:red"
            alertpassword.innerHTML = "Password mismatch with confirm Password."
        }
        else if(event.keyCode !== 13){
            alertpassword.innerHTML = "";
        }
    })
    registerPassword.addEventListener("keypress", function(event){
        if(event.keyCode === 13){
            let registerButton = document.getElementById("registerSubmit");
            registerButton.setAttribute("disabled", true);
            validateAndRegister();
        }
    })
}

let confirmPassword = document.getElementById("confirmPassword");
if(confirmPassword){
    confirmPassword.addEventListener("change", function(){
        let password = document.getElementById("registerPassword");
        let alertpassword = document.getElementById("passwordAlerts")
        if(password.value !== this.value || this.value.length === 0){
            alertpassword.style.cssText = "color:red"
            alertpassword.innerHTML = "Password mismatch with confirm Password."
        }
        else{
            alertpassword.innerHTML = "";
        }
    })
    confirmPassword.addEventListener("keyup", function(event){
        let password = document.getElementById("registerPassword");
        let alertpassword = document.getElementById("passwordAlerts")
        if(password.value !== this.value || this.value.length === 0){
            alertpassword.style.cssText = "color:red"
            alertpassword.innerHTML = "Password mismatch with confirm Password."
        }
        else if(event.keyCode !== 13){
            alertpassword.innerHTML = "";
        }
    })
    confirmPassword.addEventListener("keypress", function(event){
        if(event.keyCode === 13){
            let registerButton = document.getElementById("registerSubmit");
            registerButton.setAttribute("disabled", true);
            validateAndRegister();
        }
    })
}

let registerButton = document.getElementById("registerSubmit");
if(registerButton){
    registerButton.addEventListener("click", function(){
        this.setAttribute("disabled", true);
        validateAndRegister();
    })
}

async function validateAndRegister(){
    var email = document.getElementById("registerEmail");
    var registerPassword = document.getElementById("registerPassword");
    var confirmPassword = document.getElementById("confirmPassword");
    if(validateEmail(email.value) && registerPassword.value !== "" && confirmPassword.value !== ""){
        if(validatePassword(registerPassword.value)){
            let requestSettings = {method: "POST", headers: {"Content-Type": "application/json"}, 
                                   body: JSON.stringify({"email": email.value, "password": registerPassword.value})}
            try{
                let request = await fetch("/register", requestSettings);
                let response = await request.json();
                let data  = await response;
                if(data.success === true){
                    let alerts = document.getElementById("alerts");
                    alerts.style.display = "block";
                    alerts.style.backgroundColor = "green";
                    alerts.innerText =  data.message;
                    setTimeout(function(){window.location.href = "/";}, 2000)
                }
                else if(data.success === false){
                    let alerts = document.getElementById("alerts");
                    alerts.style.display = "block";
                    alerts.style.backgroundColor = "red";
                    alerts.innerHTML = data.message;
                    setTimeout(() => {alerts.style.display = "none"}, 3000)
                }
            }
            catch(error){
                console.warn(error)
            }     
            finally{
                let registerButton = document.getElementById("registerSubmit");
                registerButton.removeAttribute("disabled"); 
            }
        }
        else{
            let alerts = document.getElementById("passwordAlerts");
            alerts.style.display = "block";
            alerts.style.color = "red";
            alerts.innerHTML = "Password must contain an uppercase letter, a lowercase letter and a number with atleast a length 8 characters.";
            setTimeout(() => {alerts.style.display = "none"}, 3000);
            let registerButton = document.getElementById("registerSubmit");
            registerButton.removeAttribute("disabled");  
        }
    }
    else{
        let alerts = document.getElementById("alerts");
        alerts.style.display = "block";
        alerts.style.backgroundColor = "red";
        alerts.style.width = "470px"
        alerts.innerHTML = "Enter a valid email and password and confirm password!";
        setTimeout(() => {alerts.style.display = "none"}, 3000);
        let registerButton = document.getElementById("registerSubmit");
        registerButton.removeAttribute("disabled"); 
    }
}

function validateEmail(email){
    try{
        var characters = /[a-zA-Z0-0]/g;
        let personalInfo = email.split("@")[0];
        let domainInfo = email.split("@")[1];
        if(personalInfo.length >= 3 && domainInfo.split(".")[0].length >= 3){
            if(personalInfo.match(characters)){
                let ext = domainInfo.split(".")[1];
                if(ext.length >= 2){
                    return true;
                }
            }
        }
        return false;
    }
    catch{
        return false;
    }
}

function validatePassword(password){
    try{
        var lowerCase = /[a-z]/g;
        var upperCase = /[A-Z]/g;
        var numbers = /[0-9]/g;
        if(password.match(lowerCase) && password.match(upperCase) && password.match(numbers) && password.length >= 7){
            return true;
        }
        return false;
    }
    catch{
        return false
    }
}