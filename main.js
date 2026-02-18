const amountBtns = document.querySelectorAll('.amount-btn');
const pickBtn = document.querySelector('.pick-btn');
const miniDisplay = document.querySelector('.mini-display');
const lottoNumbersContainer = document.querySelector('.lotto-numbers');
const themeSwitch = document.querySelector('#checkbox');

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

const handleAmountButtonClick = (e) => {
    const lines = parseInt(e.target.dataset.lines);
    generateLottoLines(lines, false);
};

const pickRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    miniDisplay.textContent = randomNumber;
    miniDisplay.classList.add('pop');
    
    setTimeout(() => {
        miniDisplay.classList.remove('pop');
        // 자동 생성 로직 제거: 이제 번호만 보여줍니다.
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

// Initial generation (default 1 line)
generateLottoLines(1);