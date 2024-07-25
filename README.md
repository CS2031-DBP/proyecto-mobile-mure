# Mure: Share Your Music Taste 🎧 🎶

**Mure**, the winner of the *Berners Lee Award 2024-1* for the UTEC course *Platform-Based Development* (CS2031), is a platform designed for users to share their music preferences with friends and followers. With Mure, you can create and share posts, playlists, and explore music content 🎙️

The project is developed using **Java and Spring Boot 🌱** for the backend, while the mobile application is developed with **React Native 📱**.

## Project Members 🤝

| Name              | Email                                                               |
|-------------------|---------------------------------------------------------------------|
| Joaquin Salinas   | [joaquin.salinas@utec.edu.pe](mailto:joaquin.salinas@utec.edu.pe)   |
| Guillermo Galvez  | [jose.galvez.p@utec.edu.pe](mailto:jose.galvez.p@utec.edu.pe)       |
| Alejandro Escobar | [alejandro.escobar@utec.edu.pe](mailto:alejandro.escobar@utec.edu.pe)|

## Prerequisites 🔧

Before setting up the project, ensure you have the following installed on your machine:

- **Node.js**: Latest version
- **Expo CLI**: Install by running `npm install -g expo-cli`
- **Backend**: You'll need to run the backend before using the app. Use the following repository: [Mure Backend](https://github.com/CS2031-DBP/proyecto-backend-mure). Also, if you don't use "localhost:8080" to communicate with your local API, feel free to change it in the `services/api.js` file to match your URL.

## Getting Started 🚀

To set up the project on your local machine, follow these steps:

1. **Clone the Repository**

   Open your terminal and clone the repository using the following command:

   ```sh
   git clone https://github.com/CS2031-DBP/proyecto-mobile-mure
   ```

2. **Navigate to the Project Directory**

   Change to the project directory:

   ```sh
   cd proyecto-mobile-mure
   ```

3. **Install Dependencies**

   Install the necessary dependencies:

   ```sh
   npm install
   ```

4. **Set Up Environment Variables**

   Create a `.env` file in the root of your project and add the following environment variable:

   ```plaintext
   EXPO_PUBLIC_BASE_PATH=your_backend_api_base_path
   ```

5. **Start the Application**

   Start the application using the following command:

   ```sh
   npx expo start
   ```

## Project Structure 🏗️

### Mobile App 📱

- **Framework**: React Native
- **Libraries**:
    - **React Navigation**
    - **React Native Paper**
    - **Expo**
    - **Axios**
    - **JWT Decode**
    - **React Native Safe Area Context**

## Main Screens 📄

### Add Post Screen ➕📝

Allows users to create posts with descriptions, images, and the ability to add information about a song or album, promoting social interaction on the platform.

### Add Story Screen ➕📖

Allows users to create short-lived content to share with friends and followers, enhancing social engagement on the platform.

### Add Playlist Screen ➕📋

Allows users to create new playlists by searching for songs and adding them to the playlist. Users can enter the playlist name and add songs.

### Edit Playlist Screen 📝📋

Allows modifying existing playlists by adding or removing songs.

### Edit Profile Screen ✏️

Allows users to edit their profile, including name and profile picture, keeping the information up to date.

### Profile Screen 👤

Shows information about a user, including their posts and playlists. Allows other users to view the profile, add or remove friends. For the current user, it allows editing the profile, viewing the friends list, and managing posts and playlists.

### Friends Screen 👥

Shows the current user's friends list, allowing viewing of their profiles, removing friends, and navigating to individual profiles.

### Library Screen 📚

Displays the user's library, including playlists, favorite songs, and more.

### Favorite Songs Screen ❤️🎵

Displays a list of the user's favorite songs.

### Album Screen 💿

Displays detailed information about an album, including its songs and artists. Allows users to play songs if a preview link is available.

### Add Song to Playlist Screen ➕🎶

Allows users to add a song to a playlist by searching for the song and selecting it from the search results.

### Search Screen 🔍

Provides a search interface for media entities such as songs, artists, and albums.

### Auth Screen 🔒

Handles user authentication processes including login and registration.

### Register Screen 📝

Registration screen for new users, allowing account creation with username, email, password, and birthday.

### Login Screen 🔑

Login screen to authenticate users using email and password, redirecting to the dashboard upon successful authentication.

### NotFound Screen ❓

404 error screen displayed when a user tries to access a non-existent route, offering options to redirect to login or dashboard.

## Relevant Services 🛠️

### Authentication and Users 🔒

Handles user authentication and management through services that communicate with the backend to validate credentials, create new accounts, and retrieve information about the current user or other users. Additionally, users can update their personal information such as name, email, and profile picture through the "Edit" or "Change Credentials" screens.

### Music and Artists 🎤🎵

Manages music and artists by allowing the search of albums and artists in the database, as well as the creation of new records. Facilitates the addition of new songs, including details such as title, artists, release date, genre, duration, and links to external platforms.

### Playlists 📋

For managing playlists, our services allow creating new playlists, retrieving specific playlists by ID, getting the current user's playlists, and the playlists of other users. Also provides functionalities for adding and removing songs within a playlist.

### Posts 📝

Posts on our platform are managed through services that allow creating new posts, retrieving global posts, and user-specific posts, with options to like or dislike them. Posts are divided into two parts: one containing musical information and the other the post details. In the post information, users can either play the song in the app, go to an album view and listen to some songs, or go to Spotify to enjoy anything they like! Also offers functionality to delete posts, ensuring users have full control over their content.

### User Management 👤

User management services facilitate various aspects of user interaction and profile maintenance:

- **User Password Verification**: A service to verify user passwords.
- **User Profile Update**: Users can update their profile information, including changing their profile picture, name, password, email, and nickname.
- **Delete User**: Service to delete a user profile by user ID.
- **User Friends Management**: This includes getting a list of friends, adding, and deleting friends.

### Notifications 🔔

Services related to managing notifications in the application:

- **Push Notifications**: Registers users for push notifications and handles sending notifications for various events.

### Utility Services ⚙️

- **Secure Storage**: Utilizes secure storage for sensitive information such as JWT tokens.
- **Image Picker**: Provides utility functions for picking and managing images, primarily used for profile pictures.

These services ensure a robust and user-friendly experience, enabling users to interact with content seamlessly while maintaining their personal profiles securely.

## Acknowledgments 🫶

We would like to thank everyone who supported the project by testing it and providing valuable feedback. Special thanks to our professor, Jorge Rios, whose guidance and encouragement were crucial to the successful development of this project 🗣️ 🙌

## License 📄

This project is licensed under the [GNU General Public License v3.0](http://www.gnu.org/licenses/gpl-3.0.html).