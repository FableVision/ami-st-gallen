<template>
	<div class="main-center-vertically" style="background-color: var(--white)">
		<div v-if="gamePhase==='setup' && setupPhase === 0" class="main-center-vertically">
			<h1 style="margin: 0;">How many players?</h1>
			<ul class="setup-button-list">
				<li><button class="setup-button" v-on:click="choosePlayerCount(2)">2 Players</button></li>
				<li><button class="setup-button" v-on:click="choosePlayerCount(3)">3 Players</button></li>
				<li><button class="setup-button" v-on:click="choosePlayerCount(4)">4 Players</button></li>
			</ul>
		</div>
		<div v-if="gamePhase==='setup' && setupPhase === 1" class="main-center-vertically">
			<h1 style="margin: 0;">What are their names?</h1>
			<ul class="setup-button-grid">
				<li v-for="(name, index) in playerCount" :key="index">
					<input 
					type="text" 
					maxlength="20" 
					placeholder="Add name here..." 
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
				Next
			</button>
		</div>
		<div v-if="gamePhase==='setup' && setupPhase === 2" class="main-center-vertically">
			<h1 style="margin: 0;">How much time per round?</h1>
			<ul class="setup-button-list">
				<li><button class="setup-button" v-on:click="chooseTimeLimit(3)">3 minutes</button></li>
				<li><button class="setup-button" v-on:click="chooseTimeLimit(5)">5 minutes</button></li>
				<li><button class="setup-button" v-on:click="chooseTimeLimit(7)">7 minutes</button></li>
			</ul>
		</div>
		<div v-if="gamePhase==='setup' && setupPhase === 3" class="main-center-vertically">
			<h1 style="margin: 0;">Let's play!</h1>
			<span style="margin: 0;">Your players are:</span>
			<ul class="setup-player-list">
				<li v-for="playerName in playerNames"><RotatedBGText class="setup-player-list-item orange-rotated">{{ playerName }}</RotatedBGText></li>
			</ul>
			<span style="margin: 0;">And you have {{ timeLimit }} minutes!</span>
			<button class="button black-button" @click="goToNextScreen">Start game</button>
		</div>

		<!-- TRAVEL STAGE -->
		<div v-if="gamePhase==='travel'" class="main-center-vertically">
			<h1 style="margin: 0;">Let's begin!</h1>
			<span style="margin: 0;">Head to <RotatedBGText class="orange-rotated">Gallery X</RotatedBGText></span>
			<br>
			<button class="button white-button" @click="goToNextScreen">Arrived!</button>
		</div>

		<!-- ACTUAL GAME STAGE -->
		<div class="darkener" :style="darkenerStyle">
			<div class="popup-text" :style="popupStyle">
				<RotatedBGText :tilt="-5" style="font-weight: bold; font-size: 100pt;">{{ popupText }}</RotatedBGText>
			</div>
		</div>
		<div v-if="showingPopup" class="stop-input"></div>
		<div v-if="gamePhase==='game' && roundPhase===0" class="main-center-vertically" style="background-color: var(--black);">
			<h1 class="white-text"><RotatedBGText class="orange-rotated" style="font-weight: bold; color: black">{{currentPlayer}}</RotatedBGText>is the guesser!</h1>
			<span class="white-text">{{currentPlayer}} has <RotatedBGText :tilt="3" class="orange-rotated">3 minutes</RotatedBGText></span>
			<span class="white-text">to find the artwork the rest of the team is describing.</span>
			<br>
			<button class="button white-button" @click="goToNextScreen">Start!</button>
		</div>
		<div v-if="gamePhase==='game' && roundPhase===1" class="main-game-container" style="background-color: var(--black);">
			<section class="game-info-section">
				<h3 class="timer" :style="`color: ${timeLeft < 10 ? '#fc2803' : 'var(--white)'};`">{{ timeRemainingCounter }}</h3>
				<ul class="disabled-words-section">
					<li style="font-size: 2vw; font-weight: 300;">Don't use these words!</li>
					<li v-for="word in shuffledArtworks[imageIndex]?.forbiddenWords">{{ word }}</li>
				</ul>
				<span class="game-player-score">{{ currentPlayer }}'s score: <span style="color: var(--orange);">{{ playerScore }}</span></span>
			</section>
			<section class="game-painting-section">
				<h3 class="round-title">Round <span class="round-title-number">{{ `${round + 1}` }}</span></h3>
				<div class="image-section">
					<div class="describe-painting-container">
						<h4><RotatedBGText :tilt="0" style="--bgcolor: var(--orange)">Describe this painting!</RotatedBGText></h4>
					</div>
					<img class="image" :src="imageUrl">
					<div class="image-bottom-section">
						<button class="image-button white-button" @click="foundImage">Found!</button>
						<button class="image-button white-button" @click="skipImage">Skip!</button>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script lang='ts'>
	import '@/assets/base.css'

	import { PropType, defineComponent, computed, ref, onMounted } from 'vue';
	import { useRouter } from 'vue-router'
	import RotatedBGText from './RotatedBGText.vue';
	import artworkData from '../../text/data.json';

	interface ArtworkData {
		thumbnail : string;
		forbiddenWords : string[];
	}

	export default defineComponent({
		name: 'Game',
		components: {
			RotatedBGText
		},
		props:{

		},
		setup(){
			const router = useRouter();

			const playerCount = ref(0);
			const timeLimit = ref(3);

			const gamePhase = ref<'setup' | 'travel' | 'game'>('setup');
			const setupPhase = ref(0);
			const roundPhase = ref(0);
			const round = ref(0);
			const imageIndex = ref(0);

			const shuffledArtworks = ref<ArtworkData[]>([]);
			
			const currentPlayer = ref("Sebastian");
			const timeLeft = ref(0);
			const playerScore = ref(0);

			let countingTime = false;
			
			const playerNames = ref<string[]>(['', '', '', '']);
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
                return new URL('/src/assets/jpg/' + shuffledArtworks.value[imageIndex.value]?.thumbnail, import.meta.url).href
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
					showPopup('Round over!');
					setTimeout(() => {
						round.value++;
						currentPlayer.value = playerNames.value[round.value];
						roundPhase.value = 0;
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
				showPopup("SWEET");

				setTimeout(() => {
					nextArtwork();
				}, 1500);
			}

			function skipImage(){
				showPopup("SKIPPED");
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
					}

					if(roundPhase.value >= 2){
						round.value++;
						roundPhase.value = 0;
					}
				}
			}

			function setupGame(){
				if(round.value >= playerNames.value.length){
					// Means the end of the game, route back to home
					router.push('/');
					return;
				}
				else{
					currentPlayer.value = playerNames.value[round.value];
					timeLeft.value = timeLimit.value * 60;
					timeLeft.value = 15;
					countingTime = true;
					playerScore.value = 0;
				}
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

			function shuffleArray<T>(array: T[]): T[] {
				const shuffled = [...array];
				for (let i = shuffled.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
				}
				return shuffled;
			}

			return{
				router, RotatedBGText, gamePhase, setupPhase, roundPhase, showingPopup,
				popupText, foundImage, skipImage, darkenerStyle, popupStyle, round, timeLeft,
				currentPlayer, goToNextScreen, playerCount, timeLimit, chooseTimeLimit, choosePlayerCount,
				timeRemainingCounter, allNamesEntered, playerNames, imageIndex, shuffledArtworks, imageUrl,
				playerScore
			}
		}
});
</script>