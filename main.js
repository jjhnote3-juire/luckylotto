const generateBtn = document.querySelector('.generate-btn');
const generateFiveBtn = document.querySelector('.generate-five-btn');
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

// 공통 생성 함수: 개수를 인자로 받고, append 여부를 결정할 수 있음
const generateLottoLines = (count, append = false) => {
    if (!append) {
        lottoNumbersContainer.innerHTML = '';
    }
    for (let i = 0; i < count; i++) {
        lottoNumbersContainer.appendChild(createLottoLine());
    }
};

// 일반 버튼 클릭 시 (기존 유지: 새로 생성)
const generateOneLottoLine = () => generateLottoLines(1);
const generateFiveLottoLines = () => generateLottoLines(5);

const pickRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    miniDisplay.textContent = randomNumber;
    miniDisplay.classList.add('pop');
    
    // 애니메이션 효과 후
    setTimeout(() => {
        miniDisplay.classList.remove('pop');
        
        // 핵심 로직: 5,000원 버튼(5줄 생성)을 randomNumber 번 누른 효과
        // 즉, 5 * randomNumber 줄을 생성함
        const totalLines = 5 * randomNumber;
        generateLottoLines(totalLines, false); // 기존 번호는 지우고 새로 생성
        
        // 5,000원 버튼 시각적 효과 (눌리는 느낌)
        generateFiveBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            generateFiveBtn.style.transform = '';
        }, 100);
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


generateBtn.addEventListener('click', generateOneLottoLine);
generateFiveBtn.addEventListener('click', generateFiveLottoLines);
pickBtn.addEventListener('click', pickRandomNumber);

// Initial generation
generateOneLottoLine();