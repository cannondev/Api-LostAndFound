# Lost and Found

![TeamLF](https://github.com/user-attachments/assets/113a7ed4-55be-469d-952c-5bd9aedaab07)

(https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)
### Scafolding:
![CS52](https://hackmd.io/_uploads/rJiE7PIcye.jpg)

### Project Description:

"Lost and Found" is a web app where you send anonymous messages as paper airplanes that land on random spots across a world map for others to discover. Each day, unlock a new country to scratch off, explore fun facts, and uncover hidden messages. Collect unique stamps for your virtual passport as you complete countries and unlock achievements, creating a personalized journey of global stories and connections.


## URL
[https://project-api-lost-and-found-9lyg.onrender.com](https://project-api-lost-and-found-9lyg.onrender.com)


## Architecture
**Backend Framework:** Express.js  
- **Database:** MongoDB (Mongoose for schema management)  
- **Authentication:** Passport.js (JWT-based authentication)  
- **Security:** Bcrypt.js for password hashing  
- **Other:**  
  - OpenAI API  
  - Sharp 

## Setup

### DEPLOYED WEBSITE IS FULLY FUNCTIONAL

### Clone the repository:  
```sh
git clone https://github.com/your-repo/lost-and-found-backend.git
cd lost-and-found-backend
```
### Install dependencies:
```
npm install
```
### Set up environment variables:
Create a .env file in the root directory and configure:
```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```



## Deployment
### Push changes to GitHub
```
git add .
git commit -m "Your commit message"
git push origin main
```

### Manual Deployment
Go to your Render dashboard. Select the project. Click "Redeploy latest commit" or trigger a build manually.

## Authors

- Yasmeen Hussein
- Peipei Soeung
- Cinay Dilibal
- Thomas Clark
