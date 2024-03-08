const API_SEND_CODE = 'https://userapi.qiekj.com/common/sms/sendCode';
const API_USER_REG = "https://userapi.qiekj.com/user/reg";

function validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

let timer = null;

function UA() {
    const androidVersions = ['8.0', '9.0', '10', '11', '12', '13', '14'];
    const phoneModels = ['Samsung Galaxy S10', 'Google Pixel 5', 'OnePlus 8T', 'Xiaomi Mi 11', 'Huawei P40'];
    const chromeVersions = ['90.0.4430.210', '91.0.4472.120', '92.0.4515.159', '93.0.4577.82', '94.0.4606.61', '118.0.0.0'];
    const androidVersion = androidVersions[Math.floor(Math.random() * androidVersions.length)];
    const phoneModel = phoneModels[Math.floor(Math.random() * phoneModels.length)];
    const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)];
    return `Mozilla/5.0 (Linux; Android ${androidVersion}; ${phoneModel} Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Mobile Safari/537.36`;
}

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

    const formData = new FormData();
    formData.append('phone', phoneInput);
    formData.append('template', 'reg');

    try {
        // 定义请求头
        const axiosHeaders = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'uid': 'undefined',
            'sec-ch-ua-mobile': '?1',
            'User-Agent': UA(),
            'sec-ch-ua-platform': 'Android',
            'Origin': 'https://h5.qiekj.com',
            'X-Requested-With': 'mark.via',
            'Sec-Fetch-Site': 'same-site',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://h5.qiekj.com/',
            'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
        };
        const response = await axios.post(API_SEND_CODE, formData, { headers: axiosHeaders });
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

    const formData = new FormData();
    formData.append('channel', 'h5');
    formData.append('phone', phoneInput);
    formData.append('verify', verifyInput);

    const axiosHeaders = {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        "Origin": "https://h5.qiekj.com",
        "Referer": "https://h5.qiekj.com/",
        "User-Agent": UA(),
        "X-Requested-With": "mark.via"
    };

    try {
        const response = await axios.post(API_USER_REG, formData, { headers: axiosHeaders });
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


function copy() {
    const responseDisplay = document.getElementById("responseDisplay");
    navigator.clipboard.writeText(responseDisplay.textContent)
        .then(() => {
            alert("复制成功！");
        })
        .catch(err => {
            console.error('复制失败:', err);
            alert("复制失败！");
        });
}
