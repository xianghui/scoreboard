# 9-Space Tableau Scoreboard

A simple, mobile-friendly web application for tracking scores for the 9-Space Tableau board game, or any other game that requires scoring for a 3x3 grid. This app can be used for scoring Castle Combo.

## Features

- **Player Management:** Easily add and remove players for the game session.
- **Intuitive Score-keeping:** A dedicated screen for each player with a 3x3 grid for score input.
- **Mobile-First Design:** The UI is optimized for use on mobile devices.
- **Modal Score Input:** Tap on a score box to open a large, easy-to-use modal for score entry.
- **Special "Key" Category:** Track an additional score category alongside the 9 grid spaces.
- **Individual and Global Resets:** Reset scores for a single player or for all players at once.
- **Persistent Sessions:** Player names and scores are saved to the browser's `localStorage`, so your game state is preserved even if you close the tab.

## How to Use

1.  **Open `index.html`:** Open the `index.html` file in any modern web browser.
2.  **Manage Players:**
    - On the "Player Management" screen, enter a player's name in the input field and click "Add Player".
    - To remove a player, click the "x" next to their name.
3.  **Track Scores:**
    - Navigate to the "Player Scorecards" screen.
    - Select a player's tab at the top.
    - Tap on any of the 9 grid spaces (e.g., "Top-Left") or the "Key" category to open the score input modal.
    - Use the `+` and `-` buttons or type directly into the input field to set the score.
    - Click "Save" to update the score.
    - The total score for each player is displayed on their tab.
4.  **Reset Scores:**
    - To reset all scores for the currently selected player, click the "Reset Scores" button at the bottom of their scorecard.
    - To reset all scores for all players, click the "Reset All" button in the player tab row.

## Files

- `index.html`: The main HTML file containing the structure of the application.
- `style.css`: The stylesheet for the application, including all layout, colors, and responsive design.
- `script.js`: The JavaScript file containing all the application logic, including player management, score tracking, and modal interactions.

## Technical Details

- **Frontend:** Built with plain HTML, CSS, and JavaScript. No external frameworks are used.
- **Icons:** Font Awesome is used for icons.
- **Data Storage:** `localStorage` is used to persist player data in the browser.
