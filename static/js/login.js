var loginEmail = document.getElementById("loginEmail");
if(loginEmail){
    loginEmail.addEventListener("keyup", function(event){
        if(event.keyCode === 13){
            event.preventDefault();
            document.getElementById("loginSubmit").click();
        }
    })
}


var loginpassword = document.getElementById("loginPassword");
if(loginpassword){
    loginpassword.addEventListener("keyup", function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById("loginSubmit").click();
    }
    })
}

let loginButton = document.getElementById("loginSubmit");
if(loginButton){
    loginButton.addEventListener("click", function(){
        this.setAttribute("disabled", true);
        validateAndLogin();
    })
}


async function validateAndLogin(){
    var email = document.getElementById("loginEmail");
    var password = document.getElementById("loginPassword");
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
        finally{
            let loginButton = document.getElementById("loginSubmit");
            loginButton.removeAttribute("disabled");
        }
    }
    else{
        let alerts = document.getElementById("alerts");
        alerts.style.display = "block";
        alerts.className = "alert-primary alerts"
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
    registerpassword.addEventListener("keyup", function(){
        let confirmPassword = document.getElementById("confirmPassword");
        let alertpassword = document.getElementById("passwordAlerts");
        if(this.value !== confirmPassword.value && this.value.length !== 0 && confirmPassword.value.length !== 0){
            alertpassword.style.cssText = "color:red"
            alertpassword.innerHTML = "Password mismatch with confirm Password."
        }
        else{
            alertpassword.innerHTML = "";
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
    confirmPassword.addEventListener('keydown', function(event){
        if(event.keyCode === 13){
            event.preventDefault();
            document.getElementById("registerSubmit").click();
        }
    })
    confirmPassword.addEventListener("keyup", function(){
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
    if(email.value !== "" && registerPassword.value !== ""){
        let requestSettings = {"method": "POST", 
                               "headers": {"Content-Type": "application/json"}, 
                               "body": JSON.stringify({"email": email.value, "password": registerPassword.value, "confirmPassword": confirmPassword.value})}
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
        finally{
            let registerButton = document.getElementById("registerSubmit");
            registerButton.removeAttribute("disabled"); 
        }
    }
    else{
        let alerts = document.getElementById("alerts");
        alerts.style.display = "block";
        alerts.className = "alert-primary alerts"
        alerts.innerHTML = "Enter a valid email and password!";
        setTimeout(() => {alerts.style.display = "none"}, 3000);
        let registerButton = document.getElementById("registerSubmit");
        registerButton.removeAttribute("disabled"); 
    }
       
}