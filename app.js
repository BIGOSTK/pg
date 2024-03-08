const API_SEND_CODE = "https://userapi.qiekj.com/common/sms/sendCode";
const API_USER_REG = "https://userapi.qiekj.com/user/reg";

const axiosHeaders = {
    "Version": "1.50.0",
    "phoneBrand": "Windows",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "Connection": "Keep-Alive",
    "Accept-Encoding": "gzip"
};

function validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

let timer = null;

async function sendPostRequest() {
    const phoneInput = document.getElementById("phoneInput").value;
    if (!validatePhone(phoneInput)) {
        alert("请输入有效的手机号码！");
        return;
    }

    if (timer) {
        alert("请等待60秒后再尝试发送验证码");
        return;
    }

    try {
        const body = new URLSearchParams({ phone: phoneInput, template: "reg" });
        const response = await axios.post(API_SEND_CODE, body.toString(), { headers: axiosHeaders });
        if (response.data.code === 0) {
            alert("验证码发送成功！");
            startTimer();
        } else {
            alert("验证码发送失败：" + response.data.msg);
        }
    } catch (error) {
        console.error('请求失败:', error);
        alert("验证码发送失败！");
    }
}

function startTimer() {
    let countdown = 60;
    const sendBtn = document.querySelector("button[onclick='sendPostRequest()']");
    sendBtn.disabled = true;
    timer = setInterval(() => {
        if (countdown <= 0) {
            clearInterval(timer);
            timer = null;
            sendBtn.textContent = "发送验证码";
            sendBtn.disabled = false;
        } else {
            sendBtn.textContent = `重新发送(${countdown})`;
            countdown--;
        }
    }, 1000);
}

async function verifyCode() {
    const phoneInput = document.getElementById("phoneInput").value;
    const verifyInput = document.getElementById("verifyInput").value;

    try {
        const body = new URLSearchParams({ channel: "h5", phone: phoneInput, verify: verifyInput });
        const response = await axios.post(API_USER_REG, body.toString(), { headers: axiosHeaders });
        if (response.data.code === 0) {
            document.getElementById("responseDisplay").textContent = response.data.data.token;
            alert("登录成功！");
        } else {
            alert("登录失败：" + response.data.msg);
        }
    } catch (error) {
        console.error('登录失败:', error);
        alert("登录失败！");
    }
}

async function copy() {
    try {
        const responseDisplay = document.getElementById("responseDisplay");
        await navigator.clipboard.writeText(responseDisplay.textContent);
        alert("复制Token成功！");
    } catch (err) {
        console.error('复制Token失败:', err);
        alert("复制Token失败，请手动复制！");
    }
}
