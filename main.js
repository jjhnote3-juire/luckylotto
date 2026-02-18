const amountBtns = document.querySelectorAll('.amount-btn');
const pickBtn = document.querySelector('.pick-btn');
const miniDisplay = document.querySelector('.mini-display');
const lottoNumbersContainer = document.querySelector('.lotto-numbers');
const themeSwitch = document.querySelector('#checkbox');

let currentSelectedLines = 1; // 기본 선택: 1,000원(1줄)
let isAnimating = false; // 애니메이션 중 중복 클릭 방지

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
    if (!lottoNumbersContainer) return;
    if (!append) {
        lottoNumbersContainer.innerHTML = '';
    }
    for (let i = 0; i < count; i++) {
        lottoNumbersContainer.appendChild(createLottoLine());
    }
};

const updateActiveButton = (selectedBtn) => {
    if (!selectedBtn) return;
    amountBtns.forEach(btn => btn.classList.remove('active'));
    selectedBtn.classList.add('active');
};

const handleAmountButtonClick = (e) => {
    if (isAnimating) return; // 애니메이션 중에는 금액 변경 불가
    const btn = e.target;
    currentSelectedLines = parseInt(btn.dataset.lines);
    updateActiveButton(btn);
    generateLottoLines(currentSelectedLines, false);
};

const pickRandomNumber = () => {
    if (!miniDisplay || isAnimating) return;
    isAnimating = true;

    const randomNumber = Math.floor(Math.random() * 5) + 1;
    miniDisplay.textContent = randomNumber;
    miniDisplay.classList.add('pop');
    
    // 1단계: 추첨 숫자 표시 애니메이션 (0.3초)
    setTimeout(() => {
        miniDisplay.classList.remove('pop');
        
        // 2단계: 추첨 결과(randomNumber) 횟수만큼 번호 교체 애니메이션 실행
        let count = 0;
        const intervalTime = 150; // 교체 속도 (0.15초)
        
        const rollEffect = setInterval(() => {
            generateLottoLines(currentSelectedLines, false);
            count++;
            
            // 시각적 효과 (깜빡임)
            const activeBtn = document.querySelector('.amount-btn.active');
            if (activeBtn) {
                activeBtn.style.opacity = (count % 2 === 0) ? '0.5' : '1';
            }

            if (count >= randomNumber) {
                clearInterval(rollEffect);
                isAnimating = false; // 애니메이션 종료
                
                if (activeBtn) {
                    activeBtn.style.opacity = '1';
                    activeBtn.classList.add('active-flash');
                    setTimeout(() => activeBtn.classList.remove('active-flash'), 400);
                }
            }
        }, intervalTime);

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

// Event Listeners with Null Checks
if (amountBtns.length > 0) {
    amountBtns.forEach(btn => btn.addEventListener('click', handleAmountButtonClick));
}
if (pickBtn) {
    pickBtn.addEventListener('click', pickRandomNumber);
}
if (themeSwitch) {
    themeSwitch.addEventListener('change', switchTheme);
}

// Check for saved theme preference
(function () {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
        if (themeSwitch && currentTheme === 'dark') {
            themeSwitch.checked = true;
        }
    }
})();

// 초기화 (메인 페이지 전용)
if (lottoNumbersContainer) {
    const defaultBtn = document.querySelector('.amount-btn[data-lines="1"]');
    if (defaultBtn) {
        updateActiveButton(defaultBtn);
    }
    generateLottoLines(currentSelectedLines);
}