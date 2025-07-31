# Api-LostAndFound

## Description
Lost and Found is a web app that I, alongside Cinay Dilibal, Peipei Soeung, and Yasmeen Hussein, created where you send anonymous messages as paper airplanes that land on random spots across a world map for others to discover. Each day, unlock a new country to scratch off, explore fun facts, and uncover hidden messages. Collect unique stamps for your virtual passport as you complete countries and unlock achievements, creating a personalized journey of global stories and connections.

## Deployed Application
https://project-lost-and-found-muix.onrender.com

## Video Demo
https://github.com/user-attachments/assets/96ea9dc5-63c1-43a7-9b8f-4096627b6266

##  Setup Instructions
Follow these steps to run the project locally:

```bash
# 1. Clone the repository
git clone git@github.com:cannondev/Api-Crammar.git

# 2. Navigate into the project folder
cd path/to/Api-Crammar

# 3. Install dependencies
npm install

# 4. Create a .env file in the root directory and add:
AUTH_SECRET=your_auth_secret
AI_API_KEY=your_ai_api_key

# 4. Run the development server
npm start
```

## Learning Journey:
This project was a team effort and our final, open-ended project for COSC 52 Full-Stack Web Development. My contributions to this project that I wanted to highlight for the code snippet portion of the Dali Lab Application are the integration of OpenAI's API Platform to generate cultural, historical, and fun facts about countries discovered, and consolidating them, along with user's thoughts sent out across the map, in a responsive passport modal with original styling with carousels and multiple pages. This functionality can be seen in the video demo and deployed site.

Relevant backend source code files include:
1 . src/controllers/openai_controller.js // call API and generate data
2 . src/controllers/country_controller.js // from which the data is generated
3 . stc/models/country_model.js // countrySchema holds relevant fact data
4 . src/router.js // relevant REST operations
5 . NOTE: src/services/passport.js is a poorly named file and handles auth. I did not write this.

This was my first time taking on the challenge of integrating a professional third-party API completely unguided, so I enjoyed the process of reading through the documentation and tweaking my implementation as I progressed. The in-house CSS, flex, etc. styling of the modal was a challenge as well and a fun design process that I enjoyed collaborating on with my group members.
