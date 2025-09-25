<template>
	<div class="main-center-vertically" style="background-color: var(--white)">
		<button @click="openHomeMenu" class="header-button-home">
			<img class="header-icon" src="@/assets/png/home.png">
		</button>
		<button v-if="gamePhase==='setup'" @click="backButton" class="header-button-back" style="color: var(--black)">
			Esci
			<img class="header-icon-back" src="@/assets/png/back.png">
		</button>
		<div v-if="showingHomePopup" class="home-background">
			<div class="home-container">
				<button class="x-button" @click="showingHomePopup=false">
					<img class="x-icon" src="@/assets/png/exit.png">
				</button>
				<h2 style="font-size: 30pt; margin: 5px;">Menu</h2>
				<button @click="playAgain" class="button white-button">Gioca di nuovo</button>
				<button @click="backToTitle" style="color: var(--black)" class="button white-button">Esci</button>
			</div>
		</div>
		<div v-if="gamePhase==='setup' && setupPhase === 0" class="main-center-vertically">
			<h1 style="margin: 0;"><InlineIcon :size="35" :imgurl="'person'"></InlineIcon>Numero di giocatori e giocatrici</h1>
			<ul class="setup-button-list">
				<li><button class="setup-button" v-on:click="choosePlayerCount(2)">2 giocatori</button></li>
				<li><button class="setup-button" v-on:click="choosePlayerCount(3)">3 giocatori</button></li>
				<li><button class="setup-button" v-on:click="choosePlayerCount(4)">4 giocatori</button></li>
			</ul>
		</div>
		<div v-if="gamePhase==='setup' && setupPhase === 1" class="main-center-vertically">
			<h1 style="margin: 0;"><InlineIcon :size="35" :imgurl="'person'"></InlineIcon>Giocatori e giocatrici</h1>
			<ul class="setup-button-grid">
				<li v-for="(name, index) in playerCount" :key="index">
					<input 
					type="text" 
					maxlength="20" 
					placeholder="Inserire qui i nomi..." 
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
				Avanti
			</button>
		</div>
		<div v-if="gamePhase==='setup' && setupPhase === 2" class="main-center-vertically">
			<h1 style="margin: 0;"><InlineIcon :imgurl="'time'" :size="50"></InlineIcon>Quanto tempo per ogni turno?</h1>
			<ul class="setup-button-list">
				<li><button class="setup-button" v-on:click="chooseTimeLimit(1)">1 minuto</button></li>
				<li><button class="setup-button" v-on:click="chooseTimeLimit(3)">3 minuti</button></li>
				<li><button class="setup-button" v-on:click="chooseTimeLimit(5)">5 minuti</button></li>
			</ul>
		</div>
		<div v-if="gamePhase==='setup' && setupPhase === 3" class="main-center-vertically">
			<h1 style="margin: 0;">Iniziamo a giocare!</h1>
			<span style="margin: 0;">I partecipanti sono...</span>
			<ul class="setup-player-list">
				<li v-for="playerName in playerNames"><RotatedBGText class="setup-player-list-item orange-rotated">{{ playerName }}</RotatedBGText></li>
			</ul>
			<span style="margin: 0;">E avete a disposizione...<InlineIcon :imgurl="'time'" :size="30"></InlineIcon><RotatedBGText :tilt="3" style="--bgcolor: var(--black); color: var(--white)">{{ timeLimit }} {{ timeLimit === 1 ? 'minuto' : 'minuti' }}</RotatedBGText></span>
			<button class="button black-button" @click="goToNextScreen">Inizia il gioco</button>
		</div>

		<!-- TRAVEL STAGE -->
		<div v-if="gamePhase==='travel'" class="main-center-vertically">
			<h1 style="margin: 0;">Cominciamo!</h1>
			<span style="margin: 0; text-align: center;">Le opere d’arte che stai cercando si trovano in diverse sezioni dello spazio. Segui le indicazioni per trovare la sala in cui devi andare.</span>
			<br>
			<button class="button white-button" @click="goToNextScreen">Arrivati!</button>
		</div>

		<!-- ACTUAL GAME STAGE -->
		<div class="darkener" :style="darkenerStyle">
			<div class="popup-text" :style="popupStyle">
				<RotatedBGText v-if="!showingNextGalleryPopup" :tilt="-5" style="font-weight: bold; font-size: 70pt;">{{ popupText }}</RotatedBGText>
				<RotatedBGText v-if="showingNextGalleryPopup" :tilt="-2" style="font-weight: bold; font-size: 28pt;">Vai a...</RotatedBGText>
				<div style="height: 1rem;"></div>
				<RotatedBGText v-if="showingNextGalleryPopup" :tilt="0" style="font-weight: bold; font-size: 15pt;">
					<div v-for="gallery in shuffledArtworks[imageIndex]?.locationTexts" class="notranslate" translate="no">
						{{ gallery }}
					</div>
				</RotatedBGText>
				<div style="height: 1rem;"></div>
				<RotatedBGText v-if="showingNextGalleryPopup" :tilt="-2" style="font-weight: bold; font-size: 28pt;">...per la tua prossima sfida.</RotatedBGText>
				<div style="height: 1.5rem;"></div>
			</div>
		</div>
		<div v-if="showingPopup" class="stop-input"></div>
		<button 
			v-if="showingPopup && showingNextGalleryPopup" 
			@click="onFoundGallery" 
			class="button white-button arrived-button-popup">
				Arrivati!
		</button>
		<div v-if="gamePhase==='game' && roundPhase===0" class="main-center-vertically" style="background-color: var(--black);">
			<h1 class="white-text"><RotatedBGText class="orange-rotated" style="font-weight: bold; color: black">{{currentPlayer}}</RotatedBGText> può indovinare!</h1>
			<span class="white-text">{{currentPlayer}} ha <RotatedBGText :tilt="3" class="orange-rotated">{{ timeLimit }} minuti di tempo</RotatedBGText></span>
			<span class="white-text"> per trovare il maggior numero possibile di opere che il resto del gruppo descrive.</span>
			<!-- <span class="white-text">Tipp: Zwei Portraits befinden sich auf der Rückseite der blauen Wand.</span> -->
			<br>
			<button class="button white-button" @click="goToNextScreen">Inizia!</button>
		</div>
		<div v-if="gamePhase==='game' && roundPhase===1" class="main-game-container" style="background-color: var(--black);">
			<section class="game-info-section">
				<h3 class="timer notranslate" translate="no" :style="`color: ${timeLeft < 10 ? '#fc2803' : 'var(--white)'};`"><InlineIcon :imgurl="'time-white'" :size="40"></InlineIcon> {{ timeRemainingCounter }}</h3>
				<ul class="disabled-words-section">
					<li translate="no" class="location-word notranslate" v-for="word in shuffledArtworks[imageIndex]?.locationTexts">
						{{ word }}
					</li>
					<div style="height: 2rem;">{{  }}</div>
					<li class="disabled-word" style="font-size: 1.5vw; font-weight: 700;">
						<RotatedBGText :tilt="2" style="--bgcolor: var(--orange)">Parole vietate:</RotatedBGText>
					</li>
					<li class="disabled-word" v-for="word in shuffledArtworks[imageIndex]?.forbiddenWords">{{ word }}</li>
				</ul>
				<span class="game-player-score">Punteggio di {{ currentPlayer }}: <span style="color: var(--orange);">{{ playerScore }}</span></span>
			</section>
			<section class="game-painting-section">
				<h3 class="round-title">Turno <span class="round-title-number">{{ `${round + 1}` }}</span></h3>
				<div class="image-section">
					<div class="describe-painting-container">
						<h4><RotatedBGText :tilt="0" style="--bgcolor: var(--orange)">Descrivi l'opera!</RotatedBGText></h4>
					</div>
					<img class="image" :src="imageUrl">
					<div class="image-bottom-section">
						<button class="image-button white-button" @click="foundImage">Trovato!</button>
						<button class="image-button white-button" @click="skipImage">Salta!</button>
					</div>
				</div>
			</section>
		</div>
		<div v-if="gamePhase==='end'" class="main-center-vertically" style="background-color: var(--white);">
			<h2 style="font-size: 24pt;">Il gioco è finito!</h2>
			<span style="font-size: 20pt;">Il punteggio della tua squadra è <RotatedBGText style="--color: var(--black); --bgcolor: var(--orange);">{{ totalScore }}</RotatedBGText></span>
			<span v-for="(playername, index) in playerNames" style="font-size: 20pt;">{{ playername }}: <RotatedBGText style="--color: var(--white); --bgcolor: var(--black);">{{playerScores[index]}}</RotatedBGText></span>
			<span style="font-size: 20pt;">sono i vostri punteggi individuali.</span>
			<div class="end-button-container">
				<button class="button black-button" style="margin: 20px; color: var(--white);" @click="playAgain">Gioca di nuovo!</button>
				<button class="button white-button" style="margin: 20px; color: var(--black);" @click="backToTitle">Esci</button>
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
		locationTexts: string[];
		gallery: number;
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

			const locationTexts = ref<string[]>([]);

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
			const popupText = ref('Fantastico!');
			const showingNextGalleryPopup = ref(false);

			let imagesFound = 0;

			onMounted(()=>{
				recreateArtworkData();
				setInterval(decreaseTime, 1000);
				document.body.style.backgroundColor = 'var(--white)';
			});

			function decreaseTime(){
				if(!countingTime) return;
				timeLeft.value--;
				
				if(timeLeft.value <= 0){
					countingTime = false;
					playerScores.value[round.value] = playerScore.value;
					showPopup('Fine del turno!');
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
				const groupedByGallery: Record<number, any[]> = {};
				artworkData.forEach(element => {
					if (!groupedByGallery[element.gallery]) {
						groupedByGallery[element.gallery] = [];
					}
					
					const forbiddenWordsArray = element.forbiddenWords.split('/').map(item => item.trim());
					const locationTextsArray = element.locationTexts.split('/').map(item => item.trim());
					
					groupedByGallery[element.gallery].push({
						thumbnail: element.imageLinkToFolder,
						forbiddenWords: forbiddenWordsArray,
						locationTexts: locationTextsArray,
						gallery: element.gallery
					});
				});

				const galleryKeys = Object.keys(groupedByGallery).map(Number);
				const shuffledGalleries = shuffleArray(galleryKeys);

				shuffledArtworks.value = [];
				shuffledGalleries.forEach(galleryKey => {
					const shuffledGalleryItems = shuffleArray(groupedByGallery[galleryKey]);
					shuffledArtworks.value.push(...shuffledGalleryItems);
				});
			}

			function foundImage(){
				imagesFound++;
				playerScore.value += 5;
				showPopup("Fantastico!");

				setTimeout(() => {
					nextArtwork();
				}, 1500);
			}

			function skipImage(){
				showPopup("Saltato!");
				setTimeout(() => {
					nextArtwork();
				}, 1500);
			}

			function nextArtwork(){
				imageIndex.value++;
				if(imageIndex.value >= shuffledArtworks.value.length){
					recreateArtworkData();
					imageIndex.value = 0;

					goToNextGallery();
				}
				else{
					if(shuffledArtworks.value[imageIndex.value - 1].gallery != 
						shuffledArtworks.value[imageIndex.value].gallery){
						goToNextGallery();
					}
					
				}
			}

			function goToNextGallery(){
				setTimeout(() => {
					showNextGalleryPopup();
				}, 10);
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
					document.body.style.backgroundColor = 'var(--white)';
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
					document.body.style.backgroundColor = 'var(--black)';
				}
				else if(gamePhase.value === 'game'){
					document.body.style.backgroundColor = 'var(--black)';
					roundPhase.value++;
					if(roundPhase.value === 1){
						setupGame();
						countingTime = true;

						showNextGalleryPopup();
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

			function showNextGalleryPopup(){
				countingTime = false;

				showingPopup.value = true;
				showingNextGalleryPopup.value = true;
			}

			function onFoundGallery(){
				hidePopup();
				countingTime = true;

				setTimeout(() => {
					showingNextGalleryPopup.value = false;
				}, 100);
			}

			function showPopup(text : string, duration: number = 1500){
				const countingTimeBefore = countingTime;
				countingTime = false;
				showingNextGalleryPopup.value = false;

				popupText.value = text;
				showingPopup.value = true;

				setTimeout(() => {
					hidePopup();
					countingTime = countingTimeBefore;
				}, duration);
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
				playerScore, playAgain, backToTitle, playerScores, totalScore, openHomeMenu, backButton,
				showingNextGalleryPopup, onFoundGallery
			}
		}
});
</script>