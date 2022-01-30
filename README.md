# SwampHacks 2022 Submission
This project was created as a submission to [SwampHacks 2022](https://swamphacks.notion.site/SwampHacks-VIII-Hacker-Guide-1d4a8b027b9647cd88f29764b6d87a9a).
**Team Members**:  *Jonathan Lo and Eric Wang*

## ChefAssist
ChefAssist is a voice assistant designed to be your personal Sous Chef in the kitchen. ChefAssist offers a wide variety of meals and will help guide you to make the perfect dish using voice commands, precise and understandable quantities, time keeping, and much more!

## Running ChefAssist
In order to run ChefAssist locally, you will need its dependencies and an Assembly AI Key.
### Set Up
 1. Clone the repository.
 2. Install Node.js
 3. Create a `config.txt` and input the Assembly AI Key according to `config.text.example`
 5. Start local server using: 
  ```
  npm run server
  npm run client
  ```


## Tech Stack
The backend is written in Javascript utilizing Jquery and AJAX for live speech and feed. The frontend is written in HTML and CSS. ChefAssist utilizes [Assembley AI's](https://www.assemblyai.com/) API for real time voice commands and NLP. 
