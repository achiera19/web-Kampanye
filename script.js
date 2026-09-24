const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
	const isOpen = navMenu.classList.toggle('open');
	menuToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-menu a').forEach((link) => {
	link.addEventListener('click', () => {
		navMenu.classList.remove('open');
		menuToggle.setAttribute('aria-expanded', 'false');
	});
});

const lampInput = document.querySelector('#lamp-count');
const hourInput = document.querySelector('#hour-count');
const lampValue = document.querySelector('#lamp-value');
const hourValue = document.querySelector('#hour-value');
const savingResult = document.querySelector('#saving-result');
const emissionResult = document.querySelector('#emission-result');

function updateRange(input) {
	const percentage = ((input.value - input.min) / (input.max - input.min)) * 100;
	input.style.background = `linear-gradient(90deg, var(--green) ${percentage}%, #dce7e0 ${percentage}%)`;
}

function updateCalculator() {
	const lampCount = Number(lampInput.value);
	const hours = Number(hourInput.value);
	const monthlyKwh = lampCount * 10 * hours * 30 / 1000;
	const saving = monthlyKwh * 1440;
	const emission = monthlyKwh * 0.85;
	lampValue.textContent = `${lampCount} lampu`;
	hourValue.textContent = `${hours} jam`;
	savingResult.textContent = `Rp ${Math.round(saving).toLocaleString('id-ID')}`;
	emissionResult.textContent = `${emission.toFixed(1).replace('.', ',')} kg`;
	updateRange(lampInput);
	updateRange(hourInput);
}

lampInput.addEventListener('input', updateCalculator);
hourInput.addEventListener('input', updateCalculator);
updateCalculator();

const commitmentForm = document.querySelector('#commitment-form');
const commitmentList = document.querySelector('#commitment-list');
const commitmentCount = document.querySelector('#commitment-count');

function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
}

commitmentForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const name = document.querySelector('#name').value.trim();
	const className = document.querySelector('#class').value.trim();
	const promise = document.querySelector('#promise').value.trim();
	const item = document.createElement('article');
	item.className = 'commitment-item';
	const avatar = document.createElement('div');
	avatar.className = 'commitment-avatar';
	avatar.textContent = initials(name);
	const content = document.createElement('div');
	const userName = document.createElement('strong');
	userName.textContent = name;
	const userClass = document.createElement('span');
	userClass.textContent = className;
	const userPromise = document.createElement('p');
	userPromise.textContent = promise;
	content.append(userName, userClass, userPromise);
	const time = document.createElement('time');
	time.textContent = 'Baru saja';
	item.append(avatar, content, time);
	commitmentList.prepend(item);
	commitmentCount.textContent = String(commitmentList.children.length).padStart(2, '0');
	commitmentForm.reset();
});

const questions = [
	{ text: 'Berapa suhu AC yang direkomendasikan agar tetap nyaman dan hemat energi?', options: ['16°C', '20°C', '24°C', '28°C'], answer: 2 },
	{ text: 'Apa yang sebaiknya dilakukan setelah selesai mengisi daya perangkat?', options: ['Membiarkannya terpasang', 'Mencabut charger dari stopkontak', 'Menambah kabel ekstensi', 'Mematikan Wi-Fi saja'], answer: 1 },
	{ text: 'Kebiasaan mana yang paling membantu mengurangi pemborosan listrik?', options: ['Menyalakan semua lampu', 'Membuka kulkas terus-menerus', 'Menggunakan mode hemat daya', 'Menaikkan kecerahan layar'], answer: 2 }
];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
const questionNumber = document.querySelector('#question-number');
const progressBar = document.querySelector('#progress-bar');
const questionText = document.querySelector('#question-text');
const quizOptions = document.querySelector('#quiz-options');
const quizFeedback = document.querySelector('#quiz-feedback');
const nextButton = document.querySelector('#next-question');

function renderQuestion() {
	const question = questions[currentQuestion];
	selectedAnswer = null;
	questionNumber.textContent = `Pertanyaan ${currentQuestion + 1} dari ${questions.length}`;
	progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
	questionText.textContent = question.text;
	quizFeedback.textContent = '';
	nextButton.innerHTML = currentQuestion === questions.length - 1 ? 'Lihat hasil <span>→</span>' : 'Lanjut <span>→</span>';
	quizOptions.innerHTML = question.options.map((option, index) => `<button class="quiz-option" type="button" data-index="${index}">${option}</button>`).join('');
	quizOptions.querySelectorAll('.quiz-option').forEach((option) => {
		option.addEventListener('click', () => {
			quizOptions.querySelectorAll('.quiz-option').forEach((item) => item.classList.remove('selected'));
			option.classList.add('selected');
			selectedAnswer = Number(option.dataset.index);
		});
	});
}

nextButton.addEventListener('click', () => {
	if (selectedAnswer === null) {
		quizFeedback.textContent = 'Pilih satu jawaban terlebih dahulu.';
		return;
	}
	if (selectedAnswer === questions[currentQuestion].answer) score += 1;
	if (currentQuestion < questions.length - 1) {
		currentQuestion += 1;
		renderQuestion();
		return;
	}
	const message = score === 3 ? 'Luar biasa! Kamu EcoSpark sejati.' : score === 2 ? 'Hebat! Tinggal sedikit lagi.' : 'Yuk, mulai dari satu kebiasaan kecil hari ini.';
	document.querySelector('#quiz-content').innerHTML = `<div class="quiz-result"><p class="eyebrow"><span></span> Hasilmu</p><h3>${score} / ${questions.length}</h3><p>${message}</p><button class="button button-primary" type="button" id="restart-quiz">Ulangi kuis <span>↻</span></button></div>`;
	nextButton.style.display = 'none';
	quizFeedback.textContent = '';
	document.querySelector('#restart-quiz').addEventListener('click', () => {
		currentQuestion = 0;
		score = 0;
		nextButton.style.display = 'inline-flex';
		renderQuestion();
	});
});

renderQuestion();
