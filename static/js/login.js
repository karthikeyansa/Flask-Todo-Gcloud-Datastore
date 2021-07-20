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
                window.location.href = "/tasks";
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


async function validateAndRegister(){
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    if(email.value !== "" && password.value !== ""){
        let requestSettings = {"method": "POST", "headers": {"Content-Type": "application/json"}, "body": JSON.stringify({"email": email.value, "password": password.value})}
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
                alerts.style.display = "block";
                alerts.className = "alert-danger alerts"
                if(email.value.includes("@") && email.value.includes(".com")){
                    alerts.innerHTML = "User email already taken";
                }
                else{
                    alerts.innerHTML = "Invalid email ID"
                }
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