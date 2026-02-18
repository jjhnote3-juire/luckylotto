const amountBtns = document.querySelectorAll('.amount-btn');
const pickBtn = document.querySelector('.pick-btn');
const miniDisplay = document.querySelector('.mini-display');
const lottoNumbersContainer = document.querySelector('.lotto-numbers');
const themeSwitch = document.querySelector('#checkbox');

let currentSelectedLines = 1; // 기본 선택: 1,000원(1줄)

const getNumberColor = (number) => {
    if (number <= 10) return '#fbc400'; // 노란색
    if (number <= 20) return '#69c8f2'; // 파란색
    if (number <= 30) return '#ff7272'; // 빨간색
    if (number <= 40) return '#aaa'; // 회색
    return '#b0d840'; // 초록색
};

const createLottoLine = () => {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    const lineContainer = document.createElement('div');
    lineContainer.classList.add('lotto-line');

    sortedNumbers.forEach(number => {
        const lottoBall = document.createElement('div');
        lottoBall.classList.add('lotto-ball');
        lottoBall.textContent = number;
        lottoBall.style.backgroundColor = getNumberColor(number);
        lineContainer.appendChild(lottoBall);
    });

    return lineContainer;
};

const generateLottoLines = (count, append = false) => {
    if (!append) {
        lottoNumbersContainer.innerHTML = '';
    }
    for (let i = 0; i < count; i++) {
        lottoNumbersContainer.appendChild(createLottoLine());
    }
};

const updateActiveButton = (selectedBtn) => {
    amountBtns.forEach(btn => btn.classList.remove('active'));
    selectedBtn.classList.add('active');
};

const handleAmountButtonClick = (e) => {
    const btn = e.target;
    currentSelectedLines = parseInt(btn.dataset.lines);
    updateActiveButton(btn);
    generateLottoLines(currentSelectedLines, false);
};

const pickRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    miniDisplay.textContent = randomNumber;
    miniDisplay.classList.add('pop');
    
    setTimeout(() => {
        miniDisplay.classList.remove('pop');
        
        // 선택된 금액 버튼의 배수만큼 생성 (예: 2,000원 선택 시 2 * 추첨숫자)
        const totalLines = currentSelectedLines * randomNumber;
        generateLottoLines(totalLines, false);
        
        // 선택된 버튼에 시각적 피드백 (반짝임 효과)
        const activeBtn = document.querySelector('.amount-btn.active');
        if (activeBtn) {
            activeBtn.classList.add('active-flash');
            setTimeout(() => activeBtn.classList.remove('active-flash'), 400);
        }
    }, 300);
};

const switchTheme = (e) => {
    if (e.target.checked) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

amountBtns.forEach(btn => btn.addEventListener('click', handleAmountButtonClick));
pickBtn.addEventListener('click', pickRandomNumber);
themeSwitch.addEventListener('change', switchTheme);

// Check for saved theme preference
(function () {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeSwitch.checked = true;
        }
    }
})();

// 초기화: 1,000원 버튼 활성화
const defaultBtn = document.querySelector('.amount-btn[data-lines="1"]');
if (defaultBtn) {
    updateActiveButton(defaultBtn);
    generateLottoLines(1);
}