<template>
	<div class="main-center-vertically" style="background-color: var(--white)">
		<button @click="openHomeMenu" class="header-button-home">
			<img class="header-icon" src="@/assets/png/home.png">
		</button>
		<button v-if="gamePhase==='setup'" @click="backButton" class="header-button-back">
			Zurück
			<img class="header-icon-back" src="@/assets/png/back.png">
		</button>
		<div v-if="showingHomePopup" class="home-background">
			<div class="home-container">
				<button class="x-button" @click="showingHomePopup=false">
					<img class="x-icon" src="@/assets/png/exit.png">
				</button>
				<h2 style="font-size: 30pt; margin: 5px;">Menu</h2>
				<button @click="playAgain" class="button white-button">Spiel neu starten</button>
				<button @click="backToTitle" class="button white-button">Beenden</button>
			</div>
		</div>
		<div v-if="gamePhase==='setup' && setupPhase === 0" class="main-center-vertically">
			<h1 style="margin: 0;"><InlineIcon :size="35" :imgurl="'person'"></InlineIcon>Anzahl Spieler*innen?</h1>
			<ul class="setup-button-list">
				<li><button class="setup-button" v-on:click="choosePlayerCount(2)">2 Spieler*innen</button></li>
				<li><button class="setup-button" v-on:click="choosePlayerCount(3)">3 Spieler*innen</button></li>
				<li><button class="setup-button" v-on:click="choosePlayerCount(4)">4 Spieler*innen</button></li>
			</ul>
		</div>
		<div v-if="gamePhase==='setup' && setupPhase === 1" class="main-center-vertically">
			<h1 style="margin: 0;"><InlineIcon :size="35" :imgurl="'person'"></InlineIcon>Spieler*innen</h1>
			<ul class="setup-button-grid">
				<li v-for="(name, index) in playerCount" :key="index">
					<input 
					type="text" 
					maxlength="20" 
					placeholder="Namen hier eingeben..." 
					class="setup-input-field"
					v-model="playerNames[index]"
					>
				</li>
			</ul>
			<button 
				class="button black-button" 
				@click="goToNextScreen"
				:disabled="!allNamesEntered"
				>
				Weiter
			</button>
		</div>
		<div v-if="gamePhase==='setup' && setupPhase === 2" class="main-center-vertically">
			<h1 style="margin: 0;"><InlineIcon :imgurl="'time'" :size="50"></InlineIcon>Wie viel Zeit pro Runde?</h1>
			<ul class="setup-button-list">
				<li><button class="setup-button" v-on:click="chooseTimeLimit(1)">1 Minuten</button></li>
				<li><button class="setup-button" v-on:click="chooseTimeLimit(3)">3 Minuten</button></li>
				<li><button class="setup-button" v-on:click="chooseTimeLimit(5)">5 Minuten</button></li>
			</ul>
		</div>
		<div v-if="gamePhase==='setup' && setupPhase === 3" class="main-center-vertically">
			<h1 style="margin: 0;">Lasst uns spielen!</h1>
			<span style="margin: 0;">Eure Spieler*innen sind..."</span>
			<ul class="setup-player-list">
				<li v-for="playerName in playerNames"><RotatedBGText class="setup-player-list-item orange-rotated">{{ playerName }}</RotatedBGText></li>
			</ul>
			<span style="margin: 0;">Und ihr habt...<InlineIcon :imgurl="'time'" :size="30"></InlineIcon><RotatedBGText :tilt="3" style="--bgcolor: var(--black); color: var(--white)">{{ timeLimit }} {{ timeLimit === 1 ? 'Minute' : 'Minuten' }}</RotatedBGText></span>
			<button class="button black-button" @click="goToNextScreen">Spiel starten</button>
		</div>

		<!-- TRAVEL STAGE -->
		<div v-if="gamePhase==='travel'" class="main-center-vertically">
			<h1 style="margin: 0;">Lasst uns beginnen!</h1>
			<span style="margin: 0;">Geht durch die ersten beiden Räume der Ausstellung, bis ihr bei den Portraits ankommt.</span>
			<br>
			<button class="button white-button" @click="goToNextScreen">Wir sind da!</button>
		</div>

		<!-- ACTUAL GAME STAGE -->
		<div class="darkener" :style="darkenerStyle">
			<div class="popup-text" :style="popupStyle">
				<RotatedBGText :tilt="-5" style="font-weight: bold; font-size: 80pt;">{{ popupText }}</RotatedBGText>
			</div>
		</div>
		<div v-if="showingPopup" class="stop-input"></div>
		<div v-if="gamePhase==='game' && roundPhase===0" class="main-center-vertically" style="background-color: var(--black);">
			<h1 class="white-text"><RotatedBGText class="orange-rotated" style="font-weight: bold; color: black">{{currentPlayer}}</RotatedBGText> darf raten!</h1>
			<span class="white-text">{{currentPlayer}} hat <RotatedBGText :tilt="3" class="orange-rotated">{{ timeLimit }} Minuten Zeit</RotatedBGText></span>
			<span class="white-text">, um möglichtst viele Portaits zu finden, welche der Rest der Gruppe beschreibt.</span>
			<span class="white-text">Tipp: Zwei Portraits befinden sich auf der Rückseite der blauen Wand.</span>
			<br>
			<button class="button white-button" @click="goToNextScreen">Start!</button>
		</div>
		<div v-if="gamePhase==='game' && roundPhase===1" class="main-game-container" style="background-color: var(--black);">
			<section class="game-info-section">
				<h3 class="timer" :style="`color: ${timeLeft < 10 ? '#fc2803' : 'var(--white)'};`"><InlineIcon :imgurl="'time-white'" :size="40"></InlineIcon> {{ timeRemainingCounter }}</h3>
				<ul class="disabled-words-section">
					<li class="disabled-word" style="font-size: 1.5vw; font-weight: 300;">Verbotene Wörter:</li>
					<li class="disabled-word" v-for="word in shuffledArtworks[imageIndex]?.forbiddenWords">{{ word }}</li>
				</ul>
				<span class="game-player-score">{{ currentPlayer }}'s Punktestand: <span style="color: var(--orange);">{{ playerScore }}</span></span>
			</section>
			<section class="game-painting-section">
				<h3 class="round-title">Runde <span class="round-title-number">{{ `${round + 1}` }}</span></h3>
				<div class="image-section">
					<div class="describe-painting-container">
						<h4><RotatedBGText :tilt="0" style="--bgcolor: var(--orange)">Beschreibe das Gemälde!</RotatedBGText></h4>
					</div>
					<img class="image" :src="imageUrl">
					<div class="image-bottom-section">
						<button class="image-button white-button" @click="foundImage">Gefunden!</button>
						<button class="image-button white-button" @click="skipImage">Überspringen!</button>
					</div>
				</div>
			</section>
		</div>
		<div v-if="gamePhase==='end'" class="main-center-vertically" style="background-color: var(--white);">
			<h2 style="font-size: 24pt;">Das Spiel ist vorbei!</h2>
			<span style="font-size: 20pt;">Der Punktestand deines Teams ist <RotatedBGText style="--color: var(--black); --bgcolor: var(--orange);">{{ totalScore }}</RotatedBGText></span>
			<span v-for="(playername, index) in playerNames" style="font-size: 20pt;">{{ playername }}: <RotatedBGText style="--color: var(--white); --bgcolor: var(--black);">{{playerScores[index]}}</RotatedBGText></span>
			<span style="font-size: 20pt;">ist eure individuelle Punktzahl</span>
			<div class="end-button-container">
				<button class="button black-button" style="margin: 20px" @click="playAgain">Nochmal spielen!</button>
				<button class="button white-button" style="margin: 20px" @click="backToTitle">Beenden</button>
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
	import '@/assets/base.css'

	import { PropType, defineComponent, computed, ref, onMounted } from 'vue';
	import { useRouter } from 'vue-router'
	import RotatedBGText from './RotatedBGText.vue';
	import artworkData from '../../text/data.json';
	import InlineIcon from './InlineIcon.vue';

	interface ArtworkData {
		thumbnail : string;
		forbiddenWords : string[];
	}

	export default defineComponent({
		name: 'Game',
		components: {
			RotatedBGText, InlineIcon
		},
		props:{

		},
		setup(){
			const router = useRouter();

			const playerCount = ref(0);
			const timeLimit = ref(3);

			const gamePhase = ref<'setup' | 'travel' | 'game' | 'end'>('setup');
			const setupPhase = ref(0);
			const roundPhase = ref(0);
			const round = ref(0);
			const imageIndex = ref(0);

			const shuffledArtworks = ref<ArtworkData[]>([]);
			
			const currentPlayer = ref("Sebastian");
			const timeLeft = ref(0);
			const playerScore = ref(0);

			let countingTime = false;

			const showingHomePopup = ref(false);
			
			const playerNames = ref<string[]>(['', '', '', '']);
			const playerScores = ref<number[]>([0,0,0,0]);
			const allNamesEntered = computed(() => {
				for (let index = 0; index < playerNames.value.length; index++) {
					const element = playerNames.value[index];
					if(element === ''){
						return false;
					}
				}
				return true;
			});

			const darkenerStyle = computed(()=>{
				return `opacity: ${showingPopup.value ? '100%' : '0%'};`;
			});
			const popupStyle = computed(()=>{
				return `transform: scale(${showingPopup.value ? '100%' : '0%'});`;
			});

			const imageUrl = computed(()=>{
				return 'src/assets/jpg/' + shuffledArtworks.value[imageIndex.value]?.thumbnail;
            });

			const totalScore = computed(()=>{
				let total = 0;
				playerScores.value.forEach(element => {
					total += element;
				});
				return total;
			});

			const timeRemainingCounter = computed(()=>{
				const adjustedTime = Math.max(0, timeLeft.value);

				const minutes = Math.floor(adjustedTime / 60);
				const remainingSeconds = adjustedTime % 60;
				const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
				
				return `${minutes}:${formattedSeconds}`;
			});

			const showingPopup = ref(false);
			const popupText = ref('SWEET');

			let imagesFound = 0;

			onMounted(()=>{
				recreateArtworkData();
				setInterval(decreaseTime, 1000);
			});

			function decreaseTime(){
				if(!countingTime) return;
				timeLeft.value--;
				
				if(timeLeft.value <= 0){
					countingTime = false;
					playerScores.value[round.value] = playerScore.value;
					showPopup('Runde vorbei!');
					setTimeout(() => {
						round.value++;
						currentPlayer.value = playerNames.value[round.value];
						roundPhase.value = 0;

						if(round.value >= playerNames.value.length){
							// Means the end of the game, route back to home
							gamePhase.value = 'end';
							return;
						}
					}, 1500);
				}
			}

			function recreateArtworkData(){
				shuffledArtworks.value = [];
				console.log(artworkData);
				artworkData.forEach(element => {
					const array = element.forbiddenWords.split('/').map(item => item.trim());
					console.log(array);
					shuffledArtworks.value.push({
						thumbnail: element.thumbnailFileName,
						forbiddenWords: array
					});
				});
				shuffledArtworks.value = shuffleArray(shuffledArtworks.value);
			}

			function foundImage(){
				imagesFound++;
				playerScore.value += 5;
				showPopup("Spitze!");

				setTimeout(() => {
					nextArtwork();
				}, 1500);
			}

			function skipImage(){
				showPopup("Übersprungen!");
				setTimeout(() => {
					nextArtwork();
				}, 1500);
			}

			function nextArtwork(){
				imageIndex.value++;
				if(imageIndex.value >= shuffledArtworks.value.length){
					recreateArtworkData();
					imageIndex.value = 0;
				}
			}

			function choosePlayerCount(pc : number){
				playerCount.value = pc;
				// Initialize with empty strings
				playerNames.value = Array(pc).fill('');
				playerScores.value = Array(pc).fill(0);
				goToNextScreen();
			}

			function chooseTimeLimit(tl : number){
				timeLimit.value = tl;
				goToNextScreen();
			}

			function goToNextScreen(){
				if(gamePhase.value === 'setup'){
					setupPhase.value++;
					if(setupPhase.value > 3){
						gamePhase.value = 'travel';
					}
				}
				else if(gamePhase.value === 'travel'){
					gamePhase.value = 'game';
					round.value = 0;
					roundPhase.value = 0;
					setupGame();
				}
				else if(gamePhase.value === 'game'){
					roundPhase.value++;
					if(roundPhase.value === 1){
						setupGame();
						countingTime = true;
					}

					if(roundPhase.value >= 2){
						round.value++;
						roundPhase.value = 0;
					}
				}
			}

			function setupGame(){
				console.log("Setting pu game");
				currentPlayer.value = playerNames.value[round.value];
				timeLeft.value = timeLimit.value * 60;
				playerScore.value = 0;
			}

			function showPopup(text : string){
				const countingTimeBefore = countingTime;
				countingTime = false;

				popupText.value = text;
				showingPopup.value = true;

				setTimeout(() => {
					hidePopup();
					countingTime = countingTimeBefore;
				}, 1500);
			}

			function hidePopup(){
				showingPopup.value = false;
			}

			function backToTitle(){
				router.push('/');
				showingHomePopup.value = false;
			}

			function playAgain(){
				round.value = 0;
				roundPhase.value = 0;
				gamePhase.value = 'setup';
				if(setupPhase.value < 3){
					setupPhase.value = 0;
				}
				else{
					setupPhase.value = 3;
				}
				showingHomePopup.value = false;
			}

			function backButton(){
				setupPhase.value--;
				if(setupPhase.value < 0){
					router.push('/');
					return;
				}
			}

			function openHomeMenu(){
				showingHomePopup.value = true;
			}

			function shuffleArray<T>(array: T[]): T[] {
				const shuffled = [...array];
				for (let i = shuffled.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
				}
				return shuffled;
			}

			return{
				router, RotatedBGText, gamePhase, setupPhase, roundPhase, showingPopup, showingHomePopup,
				popupText, foundImage, skipImage, darkenerStyle, popupStyle, round, timeLeft,
				currentPlayer, goToNextScreen, playerCount, timeLimit, chooseTimeLimit, choosePlayerCount,
				timeRemainingCounter, allNamesEntered, playerNames, imageIndex, shuffledArtworks, imageUrl,
				playerScore, playAgain, backToTitle, playerScores, totalScore, openHomeMenu, backButton
			}
		}
});
</script>