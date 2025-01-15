const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  let score = 0,
    misses = 0,
    totalClicks = 0,
    startTime = null;
  const gameArea = $("game-area");
  const scoreElement = $("score");
  const missesElement = $("misses");
  const timeElement = $("time");
  const Diana = $("diana");
  const bang = $("bang");
  const fail = $("fail");
  const maxScoreElement = $("max-score");

  // Recuperar la puntuación máxima del localStorage
  let maxScore = localStorage.getItem("maxScore")
    ? parseFloat(localStorage.getItem("maxScore"))
    : 0;
  maxScoreElement.textContent = `Puntuación máxima: ${maxScore}`;

  // Función para actualizar la interfaz de usuario
  const updateUI = () => {
    scoreElement.textContent = `Aciertos: ${score}`;
    missesElement.textContent = `Fallos: ${misses}`;
    timeElement.textContent = `Tiempo: 0.00 segundos`;
  };

  // Función para mover la diana aleatoriamente
  const moveDiana = () => {
    setTimeout(() => {
      Diana.style.top = `${
        Math.random() * (gameArea.offsetHeight - Diana.offsetHeight)
      }px`;
      Diana.style.left = `${
        Math.random() * (gameArea.offsetWidth - Diana.offsetWidth)
      }px`;
    }, 100); // Pequeño retraso para que el cambio sea visible
  };

  const playShotEffect = (clickX, clickY) => {
    const shotEffect = document.createElement("div");
    shotEffect.classList.add("shot-effect");

    // Obtener la posición del gameArea
    const gameAreaRect = gameArea.getBoundingClientRect();

    // Ajustar las coordenadas relativas al gameArea
    const adjustedX = clickX - gameAreaRect.left;
    const adjustedY = clickY - gameAreaRect.top;

    // Centrar el efecto de disparo en el punto de clic
    const shotSize = 20; // Tamaño estimado del shot-effect
    shotEffect.style.left = `${adjustedX - shotSize / 2}px`;
    shotEffect.style.top = `${adjustedY - shotSize / 2}px`;

    gameArea.appendChild(shotEffect);

    setTimeout(() => {
      shotEffect.style.transform = "scale(3)";
      shotEffect.style.opacity = 0;
    }, 10);

    setTimeout(() => shotEffect.remove(), 300);
  };

  // Función para mostrar animación de aciertos/errores
  const showScoreAnimation = (isHit) => {
    const scoreAnimation = document.createElement("span");
    scoreAnimation.classList.add("score-animation");
    scoreAnimation.textContent = isHit ? "+1" : "-1";
    const targetElement = isHit ? bang : fail;
    if (!targetElement)
      return console.error("El elemento de puntuación no se ha encontrado.");

    // Eliminar animación anterior si existe
    const existingAnimation = targetElement.querySelector(".score-animation");
    if (existingAnimation) existingAnimation.remove();

    targetElement.appendChild(scoreAnimation);
    scoreAnimation.style.cssText = `
            color: ${isHit ? "green" : "red"};
            font-size: 24px;
            font-weight: bold;
            font-style: italic;
            transition: opacity 0.5s;
            opacity: 1;
        `;

    setTimeout(() => {
      scoreAnimation.style.transform = "translateX(0px)";
      scoreAnimation.style.opacity = 0;
    }, 500);

    setTimeout(() => scoreAnimation.remove(), 1500);
  };

  // Función para calcular y mostrar el tiempo y puntuación final
  const endGame = () => {
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const penalizacionTime = misses;
    const points = (100 * (1 / totalTime) * (score - penalizacionTime)).toFixed(
      2
    );
    // Verificar si la puntuación final es mayor que la puntuación máxima
    if (points > maxScore) {
      maxScore = points;
      localStorage.setItem("maxScore", maxScore); // Guardar la nueva puntuación máxima
      maxScoreElement.textContent = `Puntuación máxima: ${maxScore}`; // Actualizar la UI
    }

    alert(`
            ¡Juego terminado!
            Aciertos: ${score}
            Fallos: ${misses}
            Penalización: ${penalizacionTime} segundos
            Tiempo total: ${totalTime} segundos
            Puntuación final: ${points}
        `);

    // Resetear valores
    score = misses = totalClicks = 0;
    updateUI();
    startTime = null;
  };

  // Evento de disparo
  gameArea.addEventListener("click", (e) => {
    console.log(Diana.getBoundingClientRect());
    console.log(e.clientX, e.clientY);
    const { left, right, top, bottom } = Diana.getBoundingClientRect();
    const { clientX, clientY } = e;

    totalClicks++; // Incrementar clics totales
    if (!startTime) startTime = Date.now(); // Iniciar el tiempo en el primer clic

    // Comprobar si el clic fue sobre la diana
    const isHit =
      clientX > left && clientX < right && clientY > top && clientY < bottom;
    if (isHit) {
      score++;
      playShotEffect(clientX, clientY);
      moveDiana();
    } else {
      misses++;
    }

    updateUI();
    showScoreAnimation(isHit);

    if (score === 20) {
      endGame();
    }
  });

  // Función para actualizar el tiempo
  const updateTime = () => {
    if (startTime) {
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      timeElement.textContent = `Tiempo: ${elapsedTime} segundos`;
    }
  };

  // Actualizar el tiempo cada 10ms
  setInterval(updateTime, 10);

  // Inicializar la posición de la diana
  moveDiana();
});
