document.addEventListener("DOMContentLoaded", () => {
  const playerManagementTab = document.getElementById("player-management-tab");
  const playerScorecardsTab = document.getElementById("player-scorecards-tab");
  const playerManagementScreen = document.getElementById(
    "player-management-screen"
  );
  const playerScorecardsScreen = document.getElementById(
    "player-scorecards-screen"
  );
  const playerNameInput = document.getElementById("player-name-input");
  const addPlayerButton = document.getElementById("add-player-button");
  const playerList = document.getElementById("player-list");
  const goToScorecardsButton = document.getElementById(
    "go-to-scorecards-button"
  );
  const playerScorecardTabsContainer = document.getElementById(
    "player-scorecard-tabs"
  );
  const scorecardContent = document.getElementById("scorecard-content");

  // Modal elements
  const scoreModal = document.getElementById("score-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalScoreInput = document.getElementById("modal-score-input");
  const modalMinusBtn = document.getElementById("modal-minus-btn");
  const modalPlusBtn = document.getElementById("modal-plus-btn");
  const modalSaveBtn = document.getElementById("modal-save-btn");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  let players = [];
  let activePlayerName = null;
  let activeSpaceIndex = null;
  let activeIsKey = false;
  const spaceLabels = [
    "Top-Left",
    "Top-Center",
    "Top-Right",
    "Mid-Left",
    "Mid-Center",
    "Mid-Right",
    "Bot-Left",
    "Bot-Center",
    "Bot-Right",
  ];

  // Load players from localStorage
  const loadPlayers = () => {
    const storedPlayers = localStorage.getItem("9space_tableau_players");
    if (storedPlayers) {
      let loadedPlayers = JSON.parse(storedPlayers);
      // Data migration for old keyCategory property
      loadedPlayers.forEach((player) => {
        if (player.key === undefined && player.keyCategory !== undefined) {
          player.key = player.keyCategory;
          delete player.keyCategory;
        }
        // Ensure key property exists and is a number
        if (player.key === undefined || player.key === null) {
          player.key = 0;
        }
      });
      players = loadedPlayers;
      savePlayers(); // Save the potentially migrated data
      renderPlayerList();
      renderScorecards();
    }
  };

  // Save players to localStorage
  const savePlayers = () => {
    localStorage.setItem("9space_tableau_players", JSON.stringify(players));
  };

  // Switch screens
  const showScreen = (screenToShow) => {
    playerManagementScreen.classList.remove("active");
    playerScorecardsScreen.classList.remove("active");
    playerManagementTab.classList.remove("active");
    playerScorecardsTab.classList.remove("active");

    if (screenToShow === "management") {
      playerManagementScreen.classList.add("active");
      playerManagementTab.classList.add("active");
    } else {
      playerScorecardsScreen.classList.add("active");
      playerScorecardsTab.classList.add("active");
      renderScorecards(); // Re-render scorecards when switching to this screen
    }
  };

  // Render player tags on Player Management screen
  const renderPlayerList = () => {
    playerList.innerHTML = "";
    players.forEach((player) => {
      const playerTag = document.createElement("div");
      playerTag.classList.add("player-tag");
      playerTag.innerHTML = `
                <span>${player.name}</span>
                <button class="remove-player" data-name="${player.name}">&times;</button>
            `;
      playerList.appendChild(playerTag);
    });
  };

  // Add player
  addPlayerButton.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    if (name) {
      if (
        players.some(
          (player) => player.name.toLowerCase() === name.toLowerCase()
        )
      ) {
        alert("Player with this name already exists!");
        return;
      }
      players.push({
        name: name,
        scores: Array(9).fill(0), // 9 spaces
        key: 0,
      });
      playerNameInput.value = "";
      renderPlayerList();
      savePlayers();
      renderScorecards(); // Update scorecards
    }
  });

  // Remove player
  playerList.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-player")) {
      const playerName = event.target.dataset.name;
      if (confirm(`Are you sure you want to remove ${playerName}?`)) {
        players = players.filter((player) => player.name !== playerName);
        renderPlayerList();
        savePlayers();
        renderScorecards(); // Update scorecards
      }
    }
  });

  // Render scorecards and player tabs
  const renderScorecards = () => {
    playerScorecardTabsContainer.innerHTML = "";
    scorecardContent.innerHTML = "";

    if (players.length === 0) {
      scorecardContent.innerHTML =
        '<p style="text-align: center; color: #777;">No players added yet. Go to Player Management to add players.</p>';
      return;
    }

    const playerTabsWrapper = document.createElement("div");
    playerTabsWrapper.className = "player-tabs-wrapper";

    players.forEach((player, index) => {
      // Create player tab
      const playerTab = document.createElement("button");
      playerTab.classList.add("player-scorecard-tab");
      playerTab.textContent = player.name;
      playerTab.dataset.name = player.name;
      playerTabsWrapper.appendChild(playerTab);
    });

    playerScorecardTabsContainer.appendChild(playerTabsWrapper);

    // Add "Reset All" button
    const resetAllButton = document.createElement("button");
    resetAllButton.textContent = "Reset All";
    resetAllButton.className = "btn btn-danger reset-all-button";
    playerScorecardTabsContainer.appendChild(resetAllButton);

    resetAllButton.addEventListener("click", () => {
      if (
        confirm("Are you sure you want to reset all scores for all players?")
      ) {
        players.forEach((player) => {
          player.scores.fill(0);
          player.key = 0;
        });
        savePlayers();
        renderScorecards();
      }
    });

    players.forEach((player, index) => {
      // Create scorecard content for player
      const playerCard = document.createElement("div");
      playerCard.classList.add("player-scorecard");
      playerCard.dataset.name = player.name;
      playerCard.hidden = true; // Hide all cards by default
      playerCard.innerHTML = `
                <div class="scorecard-player-header">
                    <h3>${player.name}</h3>
                    <div class="total-score-display">0</div>
                </div>
                <div class="score-grid">
                    ${Array(9)
                      .fill()
                      .map(
                        (_, i) => `
                        <div class="score-item" data-player-name="${player.name}" data-space-index="${i}">
                            <label>${spaceLabels[i]}</label>
                            <div class="score-display">${player.scores[i]}</div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="key-category-section score-item" data-player-name="${
                  player.name
                }" data-key="true">
                    <i class="fas fa-key"></i>
                    <label>Key</label>
                    <div class="score-display">${player.key}</div>
                </div>
                <button class="btn reset-score-button" data-name="${
                  player.name
                }">Reset Scores</button>
            `;
      scorecardContent.appendChild(playerCard);

      updateTotalScore(player, playerCard); // Initial total score calculation
    });

    // Activate the first player tab and scorecard by default
    const firstPlayerTab = playerTabsWrapper.firstElementChild;
    if (firstPlayerTab) {
      firstPlayerTab.classList.add("active");
      const firstPlayerCard = scorecardContent.firstElementChild;
      if (firstPlayerCard) {
        firstPlayerCard.classList.add("active");
        firstPlayerCard.hidden = false;
      }
    }
  };

  // Open modal and handle score editing
  const openScoreModal = (playerName, spaceIndex, isKey) => {
    activePlayerName = playerName;
    activeSpaceIndex = spaceIndex;
    activeIsKey = isKey;

    const player = players.find((p) => p.name === playerName);
    if (!player) return;

    let currentValue = 0;
    if (isKey) {
      modalTitle.textContent = "Key";
      currentValue = player.key;
    } else {
      modalTitle.textContent = spaceLabels[spaceIndex];
      currentValue = player.scores[spaceIndex];
    }

    modalScoreInput.value = currentValue === 0 ? "" : currentValue;
    scoreModal.style.display = "flex";
    modalScoreInput.focus();
  };

  const closeScoreModal = () => {
    scoreModal.style.display = "none";
  };

  const saveScoreFromModal = () => {
    const player = players.find((p) => p.name === activePlayerName);
    if (!player) return;

    const newValue = parseInt(modalScoreInput.value) || 0;

    if (activeIsKey) {
      player.key = newValue;
    } else {
      player.scores[activeSpaceIndex] = newValue;
    }

    savePlayers();
    renderScorecards();
    setTimeout(() => {
      const activeTab = document.querySelector(
        `.player-scorecard-tab[data-name="${activePlayerName}"]`
      );
      if (activeTab) activeTab.click();
    }, 0);

    closeScoreModal();
  };

  // Event listeners for modal
  modalMinusBtn.addEventListener("click", () => {
    modalScoreInput.value = Math.max(
      0,
      (parseInt(modalScoreInput.value) || 0) - 1
    );
    saveScoreFromModal();
  });
  modalPlusBtn.addEventListener("click", () => {
    modalScoreInput.value = (parseInt(modalScoreInput.value) || 0) + 1;
    saveScoreFromModal();
  });
  modalSaveBtn.addEventListener("click", saveScoreFromModal);
  modalCloseBtn.addEventListener("click", closeScoreModal);
  scoreModal.addEventListener("click", (event) => {
    if (event.target === scoreModal) {
      closeScoreModal();
    }
  });

  // Add event listener for reset buttons and score items
  scorecardContent.addEventListener("click", (event) => {
    const target = event.target.closest(".score-item, .reset-score-button");
    if (!target) return;

    if (target.classList.contains("reset-score-button")) {
      const playerName = target.dataset.name;
      if (confirm(`Are you sure you want to reset scores for ${playerName}?`)) {
        const player = players.find((p) => p.name === playerName);
        if (player) {
          player.scores.fill(0);
          player.key = 0;
          savePlayers();
          renderScorecards();
          // Ensure the correct tab and card remain active after re-render
          setTimeout(() => {
            const activeTab = document.querySelector(
              `.player-scorecard-tab[data-name="${playerName}"]`
            );
            if (activeTab) {
              activeTab.click();
            }
          }, 0);
        }
      }
    } else if (target.classList.contains("score-item")) {
      const playerName = target.dataset.playerName;
      const spaceIndex = target.dataset.spaceIndex;
      const isKey = target.dataset.key === "true";
      openScoreModal(
        playerName,
        spaceIndex !== undefined ? parseInt(spaceIndex) : null,
        isKey
      );
    }
  });

  // Update total score for a player
  const updateTotalScore = (player, playerCardElement) => {
    const total =
      player.scores.reduce((sum, score) => sum + score, 0) + player.key;
    playerCardElement.querySelector(
      ".total-score-display"
    ).textContent = `Total: ${total}`;

    // Update the score on the tab
    const playerTab = document.querySelector(
      `.player-scorecard-tab[data-name="${player.name}"]`
    );
    if (playerTab) {
      playerTab.textContent = `${player.name} (${total})`;
    }
  };

  // Handle player scorecard tab clicks
  playerScorecardTabsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("player-scorecard-tab")) {
      const selectedPlayerName = event.target.dataset.name;

      // Deactivate all tabs and hide all scorecards
      document
        .querySelectorAll(".player-scorecard-tab")
        .forEach((tab) => tab.classList.remove("active"));
      document.querySelectorAll(".player-scorecard").forEach((card) => {
        card.classList.remove("active");
        card.hidden = true;
      });

      // Activate clicked tab and show corresponding scorecard
      event.target.classList.add("active");
      const selectedCard = document.querySelector(
        `.player-scorecard[data-name="${selectedPlayerName}"]`
      );
      if (selectedCard) {
        selectedCard.classList.add("active");
        selectedCard.hidden = false;
      }
    }
  });

  // Event Listeners for main navigation tabs
  playerManagementTab.addEventListener("click", () => showScreen("management"));
  playerScorecardsTab.addEventListener("click", () => showScreen("scorecards"));
  goToScorecardsButton.addEventListener("click", () =>
    showScreen("scorecards")
  );

  // Initial load
  loadPlayers();
  showScreen("management"); // Start on Player Management screen
});
