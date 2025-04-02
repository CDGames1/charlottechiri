document.addEventListener("DOMContentLoaded", () => {
  // GLOBAL FADE FUNCTIONS
  function fadeIn(el) { el.style.opacity = 1; }
  function fadeOut(el) { el.style.opacity = 0; }

  // ELEMENTS
  const overlay = document.getElementById("overlay");
  const enterBtn = document.getElementById("enterBtn");
  const interactiveSection = document.getElementById("interactiveSection");
  const sceneryPopup = document.getElementById("sceneryPopup");
  const sceneryButtons = document.querySelectorAll(".sceneryBtn");
  const closePopup = document.getElementById("closePopup");
  const sceneChangerTrigger = document.getElementById("sceneChangerTrigger");
  const sceneFadeOverlay = document.getElementById("sceneFadeOverlay");
  const sceneFadeText = document.getElementById("sceneFadeText");

  const volumeSlider = document.getElementById("volumeSlider");

  // Audio Elements
  const backgroundAudio = document.getElementById("backgroundAudio");
  const deepBreathAudio = document.getElementById("deepBreathAudio");
  const candleLitAudio = document.getElementById("candleLitAudio");
  const candleOutAudio = document.getElementById("candleOutAudio");
  const fireplaceOnAudio = document.getElementById("fireplaceOnAudio");
  const fireplaceOffAudio = document.getElementById("fireplaceOffAudio");
  const chiriAudio = document.getElementById("chiriAudio");

  // Interactive Objects (in objectBar)
  const stereo = document.getElementById("stereo");
  const couch = document.getElementById("couch");
  const fireplace = document.getElementById("fireplace");
  const candle = document.getElementById("candle");

  // Overlays for meditation and relaxation
  const meditationOverlay = document.getElementById("meditationOverlay");
  const meditationText = document.getElementById("meditationText");
  const meditationImage = document.getElementById("meditationImage");
  const relaxOverlay = document.getElementById("relaxOverlay");
  const relaxImage = document.getElementById("relaxImage");
  const relaxText = document.getElementById("relaxText");

  // State toggles for candle and fireplace
  let candleOn = true;
  let fireplaceOn = true;

  // Volume control: update backgroundAudio volume based on slider
  volumeSlider.addEventListener("input", () => {
    backgroundAudio.volume = volumeSlider.value;
  });

  // When "Enter" is clicked, fade out overlay and show interactive section
  enterBtn.addEventListener("click", () => {
    overlay.style.opacity = 0;
    setTimeout(() => {
      overlay.style.display = "none";
      interactiveSection.style.display = "block";
      // Show the scenery selector
      sceneryPopup.style.display = "block";
      // Default scenery
      setScenery("forest");
    }, 2000);
  });

  // Scene changer popup: show on hover/tap at top center
  sceneChangerTrigger.addEventListener("mouseenter", () => {
    sceneryPopup.style.display = "block";
  });
  sceneChangerTrigger.addEventListener("click", () => {
    sceneryPopup.style.display = "block";
  });
  sceneryButtons.forEach(button => {
    button.addEventListener("click", () => {
      const scenery = button.getAttribute("data-scenery");
      fadeScene(scenery);
      sceneryPopup.style.display = "none";
    });
  });
  closePopup.addEventListener("click", () => {
    sceneryPopup.style.display = "none";
  });

  // Function to fade scene out and switch background and ambient audio with sceneFadeOverlay
  function fadeScene(scenery) {
    sceneFadeText.textContent = scenery === "forest" ? "Forest" : "Beach";
    sceneFadeOverlay.style.opacity = 1;
    setTimeout(() => {
      setScenery(scenery);
      sceneFadeOverlay.style.opacity = 0;
    }, 1500);
  }

  // Function to set scenery background and ambient audio
  function setScenery(scenery) {
    let bgImage = "";
    let audioSrc = "";
    switch (scenery) {
      case "forest":
        bgImage = "assets/forest.jpg";
        audioSrc = "assets/forest.mp3";
        break;
      case "beach":
        bgImage = "assets/beach.jpg";
        audioSrc = "assets/beach.mp3";
        break;
      default:
        bgImage = "assets/forest.jpg";
        audioSrc = "assets/forest.mp3";
    }
    interactiveSection.style.backgroundImage = `url('${bgImage}')`;
    backgroundAudio.src = audioSrc;
    backgroundAudio.volume = volumeSlider.value;
    backgroundAudio.play();
  }

  // MEDITATION SEQUENCE triggered by clicking the stereo
  function startMeditation() {
    stereo.removeEventListener("click", startMeditation);
    let initialVolume = backgroundAudio.volume;
    const volumeFadeInterval = setInterval(() => {
      if (backgroundAudio.volume > 0.2) {
        backgroundAudio.volume -= 0.05;
        volumeSlider.value = backgroundAudio.volume;
      } else {
        clearInterval(volumeFadeInterval);
      }
    }, 500);

    meditationOverlay.style.opacity = 1;
    meditationOverlay.style.pointerEvents = "all";
    deepBreathAudio.play();

    let cycle = 0;
    const totalCycles = 5;

    function showMessage(message, imageSrc, duration, callback) {
      meditationText.innerHTML = message;
      fadeIn(meditationText);
      if (imageSrc) {
        meditationImage.src = imageSrc;
        fadeIn(meditationImage);
      } else {
        fadeOut(meditationImage);
      }
      setTimeout(() => {
        fadeOut(meditationText);
        fadeOut(meditationImage);
        setTimeout(callback, 1000);
      }, duration);
    }

    function startCountdown(callback) {
      meditationText.innerHTML = "Get Ready for some Deep breaths";
      fadeIn(meditationText);
      let count = 3;
      const countdownInterval = setInterval(() => {
        meditationText.innerHTML = `${count}.....`;
        count--;
        if (count < 0) {
          clearInterval(countdownInterval);
          fadeOut(meditationText);
          setTimeout(callback, 1000);
        }
      }, 1000);
    }

    function breathCycle() {
      if (cycle >= totalCycles) {
        const restoreInterval = setInterval(() => {
          if (backgroundAudio.volume < initialVolume) {
            backgroundAudio.volume += 0.05;
            volumeSlider.value = backgroundAudio.volume;
          } else {
            clearInterval(restoreInterval);
          }
        }, 500);
        deepBreathAudio.pause();
        deepBreathAudio.currentTime = 0;
        showMessage("Great job! 😊", null, 2000, () => {
          fadeOut(meditationOverlay);
          meditationOverlay.style.pointerEvents = "none";
          meditationText.innerHTML = "";
          meditationImage.src = "";
          stereo.addEventListener("click", startMeditation);
        });
        return;
      }
      showMessage("Inhale In Through your Nose", "assets/inhale.png", 4000, () => {
        showMessage("Exhale out through your Mouth", "assets/exhale.png", 5000, () => {
          cycle++;
          breathCycle();
        });
      });
    }

    startCountdown(() => {
      breathCycle();
    });
  }

  // Couch interaction: relax overlay with relaxing.png, white text, lower background volume, play chiri.mp3
  function startRelaxation() {
    couch.removeEventListener("click", startRelaxation);
    let initialVolume = backgroundAudio.volume;
    const volumeFadeInterval = setInterval(() => {
      if (backgroundAudio.volume > 0.2) {
        backgroundAudio.volume -= 0.05;
        volumeSlider.value = backgroundAudio.volume;
      } else {
        clearInterval(volumeFadeInterval);
      }
    }, 500);

    relaxOverlay.style.opacity = 1;
    relaxOverlay.style.pointerEvents = "all";
    setTimeout(() => { fadeIn(relaxImage); fadeIn(relaxText); }, 500);
    chiriAudio.play();

    chiriAudio.onended = () => {
      const restoreInterval = setInterval(() => {
        if (backgroundAudio.volume < initialVolume) {
          backgroundAudio.volume += 0.05;
          volumeSlider.value = backgroundAudio.volume;
        } else {
          clearInterval(restoreInterval);
        }
      }, 500);
      fadeOut(relaxImage);
      fadeOut(relaxText);
      setTimeout(() => {
        fadeOut(relaxOverlay);
        relaxOverlay.style.pointerEvents = "none";
        couch.addEventListener("click", startRelaxation);
      }, 1000);
    };
  }

  // Toggling Candle on/off
  candle.addEventListener("click", () => {
    if (candleOn) {
      candle.src = "assets/candleout.png";
      candleOutAudio.play();
      candleOn = false;
    } else {
      candle.src = "assets/candle.png";
      candleLitAudio.play();
      candleOn = true;
    }
  });

  // Toggling Fireplace on/off
  fireplace.addEventListener("click", () => {
    if (fireplaceOn) {
      fireplace.src = "assets/fireplaceout.png";
      fireplaceOffAudio.play();
      fireplaceOn = false;
    } else {
      fireplace.src = "assets/fireplace.png";
      fireplaceOnAudio.play();
      fireplaceOn = true;
    }
  });

  // Object interactions
  stereo.addEventListener("click", startMeditation);
  couch.addEventListener("click", startRelaxation);
});
