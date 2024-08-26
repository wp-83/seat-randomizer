const randomizeBtn = document.querySelector("#randomize");
const randomNumberBox = document.querySelector("#random-number");
const refreshSeatsEl = document.querySelector("#refresh-seats");
const leftSeatsEl = document.querySelector(".left-seats .seats");
const rightSeatsEl = document.querySelector(".right-seats .seats");
const userNameEl = document.querySelector("#user-name");

const leftSeatsMap = [
	"",
	"",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
]; // 18

const rightSeatsMap = [
	"s",
	"s",
	"",
	"",
	"",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"s",
	"",
	"",
	"",
	"",
	"",
]; // 17

const leftSeats = leftSeatsMap.filter((e) => e != "").length;
const rightSeats = rightSeatsMap.filter((e) => e != "").length;
const totalSeats = leftSeats + rightSeats; // 1 to 35

const keyPrefix = "PPTI22_ARRADIUS";

function createSequenceOfNumbers(start, numbers) {
	return new Array(numbers).fill(0).map((_, i) => i + start);
}

function createSeats(numberOfSeats, positionEl, startAt) {
	for (let i = 0; i < numberOfSeats; i++) {
		const el = document.createElement("div");
		const nameEl = document.createElement("div");
		el.classList.add("seat");
		nameEl.innerHTML = "<p class='red'>NONE</p>";
		nameEl.classList.add("name");
		el.dataset.number = startAt + i;
		el.textContent = startAt + i;
		el.append(nameEl);
		positionEl.append(el);
	}
}

function createSeatsFromMap(map, positionEl, startAt) {
	let orderCount = 0;
	map.forEach((e) => {
		const el = document.createElement("div");

		el.classList.add("seat-box");
		if (e == "s") {
			const nameEl = document.createElement("div");
			nameEl.innerHTML = "<p class='red'>NONE</p>";
			nameEl.classList.add("name");
			el.classList.add("seat");
			el.dataset.number = startAt + orderCount;
			el.textContent = startAt + orderCount++;
			el.append(nameEl);
		}

		positionEl.append(el);
	});
}

function highlightOccupiedSeats() {
	const data = JSON.parse(
		localStorage.getItem(`${keyPrefix}_RANDOMIZED`) ?? "{}"
	);
	Object.keys(data).forEach((number) => {
		const seatEl = document.querySelector(`.seat[data-number='${number}']`);
		const seatNameEl = seatEl.querySelector(".name");
		seatNameEl.textContent = data[number];
		seatEl?.classList.add("seat-occupied");
		removeNumberFromArray(number);
	});
}

function initializeSeats() {
	// createSeats(leftSeats, leftSeatsEl, 1);
	// createSeats(rightSeats, rightSeatsEl, leftSeats + 1);
	createSeatsFromMap(leftSeatsMap, leftSeatsEl, 1);
	createSeatsFromMap(rightSeatsMap, rightSeatsEl, leftSeats + 1);
	highlightOccupiedSeats();
}

function generateRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomFromArray(array) {
	return array[~~(Math.random() * array.length)];
}

function setLocalStorage(item) {
	const data = JSON.parse(
		localStorage.getItem(`${keyPrefix}_RANDOMIZED`) ?? "{}"
	);

	data[item] = userNameEl.value;
	localStorage.setItem(`${keyPrefix}_RANDOMIZED`, JSON.stringify(data));
}

function checkForExistence(number) {
	const data = JSON.parse(
		localStorage.getItem(`${keyPrefix}_RANDOMIZED`) ?? "{}"
	);
	const exists = Object.keys(data).find((num) => num == number);
	return exists;
}

async function shuffle() {
	let maxTime = 1000;
	let timeElapsed = 0;
	return new Promise((resolve) => {
		let interval = setInterval(() => {
			if (timeElapsed >= maxTime) {
				clearInterval(interval);
				resolve();
				return;
			}
			let random = generateRandom(1, totalSeats);
			randomNumberBox.textContent = random;
			timeElapsed += 50;
		}, 50);
	});
}

function occupySeat(number) {
	const seat = document.querySelector(`.seat[data-number='${number}']`);
	seat.classList.add("seat-occupied");
	const seatName = seat.querySelector(".name");
	seatName.textContent = userNameEl.value;
	removeNumberFromArray(number);
}

function removeNumberFromArray(number) {
	numbers = numbers.filter((e) => e != number);
}

function checkFull() {
	const data = JSON.parse(
		localStorage.getItem(`${keyPrefix}_RANDOMIZED`) ?? "{}"
	);
	return Object.keys(data).length == totalSeats;
}

// initialization
let numbers = createSequenceOfNumbers(1, totalSeats);
let randoming = 0;
initializeSeats();
randomizeBtn.addEventListener("click", async function () {
	if (randoming == 1) return;
	if (userNameEl.value == null || userNameEl.value == "") {
		return alert("Please enter your name!!");
	}

	if (checkFull()) {
		alert("Full Seats!! Please Reset!!");
		return;
	}

	randoming = 1;
	let randomNumber;
	do {
		randomNumber = generateRandomFromArray(numbers);
	} while (checkForExistence(randomNumber));

	await shuffle();
	randomNumberBox.textContent = randomNumber;
	occupySeat(randomNumber);
	setLocalStorage(randomNumber);
	userNameEl.value = null;
	randoming = 0;
});

refreshSeatsEl.addEventListener("click", function () {
	localStorage.removeItem(`${keyPrefix}_RANDOMIZED`);
	document.querySelectorAll(".seat").forEach((el) => {
		el.classList.remove("seat-occupied");
		el.querySelector(".name").innerHTML = "";
	});
	numbers = createSequenceOfNumbers(1, totalSeats);
});
