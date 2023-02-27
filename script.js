const displayPasswordEle = document.querySelector("[display-password]");
const passwordCopiedAlertEle = document.querySelector("[password-copied-alert]");
const copyToClipPicEle = document.querySelector("#copy-to-clip-pic");
const passwordLengthEle = document.querySelector("[password-length]");
const inputSliderEle = document.querySelector("[pass-len-slider]");
const upperCaseEle = document.querySelector("#upper-case");
const lowerCaseEle = document.querySelector("#lower-case");
const numbersEle = document.querySelector("#numbers");
const symbolsEle = document.querySelector("#symbols");
const allCheckBoxesEle = document.querySelectorAll("input[type=checkbox]");
const passwordStrengthEle = document.querySelector("[password-strength]");
const generatePasswordEle = document.querySelector(".generate-password");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 15;
let checkCount = 1;

// sets the passwordLength
const handleSlider = () => {
    inputSliderEle.value = passwordLength;
    passwordLengthEle.textContent = passwordLength;
    const min = inputSliderEle.min;
    const max = inputSliderEle.max;
    const sliderFillPercentage = ((passwordLength - min)*100)/(max - min);
    inputSliderEle.style.backgroundSize = `${sliderFillPercentage}% 100%`;
};
handleSlider()

const setPasswordStrengthIndicator = (color) => {
    passwordStrengthEle.style.backgroundColor = color;
    //  TODO ===> include shadow
    passwordStrengthEle.style.boxShadow = `0px 0px 12px 1px ${color}`;
};
// TODO ===> Set paswword strength circle to gray
setPasswordStrengthIndicator("#ccc")

const getRandomInteger = (min, max) => {
    let ranNum = Math.random();
    ranNum = min + Math.round(ranNum*(max - min));
    return ranNum;
};

const generateRandomNumber = () => getRandomInteger(0, 9);

const generateLowerCaseLetter = () => String.fromCharCode(getRandomInteger(97, 123));

const generateUpperCaseLetter = () => String.fromCharCode(getRandomInteger(65, 91));

const generateRandSymbol = () => {
    const index = getRandomInteger(0, symbols.length);
    return symbols.charAt(index);
};

const calcStrength = () => {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (upperCaseEle.checked) hasUpper = true;
    if (lowerCaseEle.checked) hasLower = true;
    if (numbersEle.checked) hasNum = true;
    if (symbolsEle.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setPasswordStrengthIndicator("#0f0");
    }
    else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6) {
        setPasswordStrengthIndicator("#ff0");
    }
    else {
            setPasswordStrengthIndicator("#f00");
        }
};

async function copyGeneratedPassword() {
    try {
        await navigator.clipboard.writeText(displayPasswordEle.value);
        passwordCopiedAlertEle.textContent = "copied";
        displayPasswordEle.value = "";
    } catch(error) {
        passwordCopiedAlertEle.textContent = "failed";
    }
    passwordCopiedAlertEle.classList.add("active");
    setTimeout(() => {
        passwordCopiedAlertEle.classList.remove("active");
        passwordCopiedAlertEle.textContent = "";
    }, 2000);
};

const handleCheckBoxChange = () => {
    checkCount = 0;
    allCheckBoxesEle.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    })
};

allCheckBoxesEle.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
})



inputSliderEle.addEventListener("input", event => {
    passwordLength = event.target.value;
    handleSlider();
});

copyToClipPicEle.addEventListener("click", () => {
    if (displayPasswordEle.value) 
        copyGeneratedPassword();
});

const shufflePassword = (password) => {
    // Fisher Yates Method
    password = password.split(""); // Array.from(password);
    for(let i = password.length-1; i > 0; i--) {
        let j = Math.round(Math.random()*(i+1));
        let temp = password[i];
        password[i] = password[j];
        password[j] = temp;
    }
    return password.join("");
}

generatePasswordEle.addEventListener("click", () => {
    // If all the check boxes are unselected
    if(checkCount <= 0) return;
    // special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    // let's start the journey to find new password
    password = "";
    // let's put the stuff mentioned by check boxes
    while(true) {
        if(upperCaseEle.checked) 
            password += generateUpperCaseLetter();
        if(lowerCaseEle.checked) 
            password += generateLowerCaseLetter();
        if(numbersEle.checked) 
            password += generateRandomNumber();
        if(symbolsEle.checked) 
            password += generateRandSymbol();
        if(password.length >= passwordLength) {
            password = password.slice(0, passwordLength);
            password = shufflePassword(password);
            break;
        }
    }
    // Show Password in the UI
    displayPasswordEle.value = password;
    // Calculate the Password Strength and change the UI accordingly
    calcStrength();
})


