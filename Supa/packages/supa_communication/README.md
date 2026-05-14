# SupaChat - Flutter Chat Library with GetStream Integration

A production-ready Flutter chat library powered by [Stream Chat](https://getstream.io/chat/), featuring a complete authentication backend, pre-built UI components, and seamless integration with existing Flutter apps.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Backend Requirements](#backend-requirements)
- [Quick Start](#quick-start)
- [Integration Guide](#integration-guide)
- [Backend API Reference](#backend-api-reference)
- [Configuration](#configuration)
- [Advanced Usage](#advanced-usage)
- [Development](#development)

---

## Features

- **Pre-built Chat UI**: Channel list, message view, and user search components
- **Authentication System**: Complete signup/login flow with JWT tokens
- **Secure Token Management**: Encrypted storage for tokens and credentials
- **Direct & Group Messaging**: Support for 1:1 and group conversations
- **User Search**: Find and start conversations with other users
- **State Management**: Built with Provider pattern
- **Stream Integration**: Leverages Stream Chat SDK for real-time messaging
- **Production Ready**: Error handling, validation, and rate limiting

---

## Architecture

```
getstream/
├── supa_chat/              # Flutter package (the library)
│   ├── lib/
│   │   ├── supa_chat.dart  # Public API
│   │   └── src/
│   │       ├── client/     # Chat client implementation
│   │       ├── config/     # Configuration classes
│   │       ├── models/     # Data models
│   │       ├── providers/  # State management
│   │       ├── services/   # API services
│   │       ├── storage/    # Secure storage
│   │       └── ui/         # UI widgets
│   └── example/            # Demo app
└── backend/                # Node.js authentication server
    ├── server.js           # Express server with Stream integration
    ├── database.js         # SQLite user management
    └── middleware/         # JWT authentication
```

---

## Backend Requirements

### Required Backend Endpoints

To integrate SupaChat with GetStream, you need a backend server that provides the following endpoints:

#### 1. **POST /signup**
Creates a new user account in both your database and Stream Chat.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "displayName": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "streamToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "apiKey": "vnt3qb9xc5z3",
  "user": {
    "id": "johndoe",
    "email": "john@example.com",
    "displayName": "John Doe",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

**Backend Implementation Requirements:**
- Validate username (3-30 chars, alphanumeric + underscore)
- Validate email format
- Validate password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
- Hash password with bcrypt
- Create user in your database
- Create user in Stream Chat using Stream SDK
- Generate JWT token for your app
- Generate Stream Chat token
- Return all tokens and user data

#### 2. **POST /login**
Authenticates existing user and returns tokens.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response:** Same as signup

**Backend Implementation Requirements:**
- Validate credentials against your database
- Verify password hash
- Generate fresh JWT token
- Generate fresh Stream Chat token
- Return tokens and user data

#### 3. **POST /token** (Requires Authentication)
Refreshes Stream Chat token without requiring re-login.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "userId": "johndoe"
}
```

**Response:**
```json
{
  "streamToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Backend Implementation Requirements:**
- Validate JWT token
- Verify userId matches JWT payload
- Generate fresh Stream Chat token using Stream SDK
- Return new Stream token

#### 4. **GET /users/search** (Requires Authentication)
Searches users by username or display name.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `query`: Search string

**Response:**
```json
{
  "users": [
    {
      "id": "janedoe",
      "email": "jane@example.com",
      "displayName": "Jane Doe",
      "avatarUrl": "https://example.com/jane.jpg"
    }
  ]
}
```

**Backend Implementation Requirements:**
- Validate JWT token
- Search users in database (username LIKE or displayName LIKE)
- Exclude current user from results
- Limit results (e.g., 20 users)
- Return user list

#### 5. **GET /health** (Optional)
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

---

### Backend Setup (Node.js Example)

The included backend server provides a reference implementation:

#### 1. Install Dependencies

```bash
cd backend
npm install
```

**Required packages:**
- `express` - Web framework
- `stream-chat` - Stream Chat SDK
- `better-sqlite3` - Database (or use your preferred DB)
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `express-rate-limit` - Rate limiting
- `dotenv` - Environment variables

#### 2. Configure Environment Variables

Create `backend/.env`:

```env
# Stream Chat Credentials (from https://getstream.io/dashboard/)
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Server Configuration
PORT=3001

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d

# Database
DATABASE_PATH=./supa_chat.db
```

#### 3. Start Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server runs on `http://localhost:3001`

---

## Quick Start

### 1. Add Dependency

Add to your `pubspec.yaml`:

```yaml
dependencies:
  supa_chat:
    path: ../supa_chat  # For local development
    # or from pub.dev when published:
    # supa_chat: ^1.0.0
```

### 2. Configure Environment

Create `.env` file in your app root:

```env
API_BASE_URL=http://localhost:3001
# For Android emulator: http://10.0.2.2:3001
# For iOS simulator: http://localhost:3001
# For production: https://your-backend-url.com
```

### 3. Initialize in Main

```dart
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'package:supa_chat/supa_chat.dart';

void main() async {
  await dotenv.load();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AuthProvider(
        authService: AuthService(
          baseUrl: dotenv.env['API_BASE_URL']!,
        ),
      ),
      child: const MaterialApp(
        home: AppContent(),
      ),
    );
  }
}
```

### 4. Handle Authentication State

```dart
class AppContent extends StatefulWidget {
  const AppContent({super.key});

  @override
  State<AppContent> createState() => _AppContentState();
}

class _AppContentState extends State<AppContent> {
  @override
  void initState() {
    super.initState();
    // Check if user is already logged in
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AuthProvider>().checkAuthStatus();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    switch (authProvider.state) {
      case AuthState.initial:
        return const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        );

      case AuthState.authenticated:
        return const ChatApp();

      case AuthState.unauthenticated:
        return const LoginPage();

      case AuthState.error:
        return Scaffold(
          body: Center(
            child: Text('Error: ${authProvider.errorMessage}'),
          ),
        );

      default:
        return const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        );
    }
  }
}
```

### 5. Initialize Chat Client

```dart
class ChatApp extends StatefulWidget {
  const ChatApp({super.key});

  @override
  State<ChatApp> createState() => _ChatAppState();
}

class _ChatAppState extends State<ChatApp> {
  late SupaChatClient _chatClient;
  bool _isConnecting = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _initializeChat();
  }

  Future<void> _initializeChat() async {
    try {
      final authProvider = context.read<AuthProvider>();

      final config = SupaChatConfig(
        apiKey: authProvider.apiKey!,
        userId: authProvider.currentUser!.id,
        tokenProvider: () => authProvider.getStreamToken(),
        backendUrl: dotenv.env['API_BASE_URL']!,
      );

      _chatClient = SupaChatClient(config);
      await _chatClient.connect();

      setState(() => _isConnecting = false);
    } catch (e) {
      setState(() {
        _isConnecting = false;
        _error = e.toString();
      });
    }
  }

  @override
  void dispose() {
    _chatClient.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isConnecting) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_error != null) {
      return Scaffold(
        body: Center(child: Text('Error: $_error')),
      );
    }

    return SupaChatApp(client: _chatClient);
  }
}
```

---

## Integration Guide

### Adding Chat to Existing Router Tree

If your app uses a router (e.g., GoRouter, Navigator 2.0), you can integrate the chat UI as a route:

#### Option 1: Full Chat App as Route

```dart
// Using GoRouter
GoRoute(
  path: '/chat',
  builder: (context, state) => const ChatApp(),
),
```

#### Option 2: Individual Chat Screens as Routes

```dart
import 'package:supa_chat/supa_chat.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';

// Initialize client globally or in a provider
late SupaChatClient globalChatClient;

// Route 1: Channel List
GoRoute(
  path: '/chat',
  builder: (context, state) => StreamChat(
    client: globalChatClient.client,
    child: ChannelListPage(
      onNewChatTap: () {
        // Navigate to user search
        context.push('/chat/new');
      },
    ),
  ),
),

// Route 2: Channel Detail
GoRoute(
  path: '/chat/channel/:channelId',
  builder: (context, state) {
    final channelId = state.pathParameters['channelId']!;
    final channel = globalChatClient.client.channel('messaging', id: channelId);

    return StreamChannel(
      channel: channel,
      child: const ChannelPage(),
    );
  },
),

// Route 3: New Chat (User Search)
GoRoute(
  path: '/chat/new',
  builder: (context, state) => const UserSearchScreen(),
),
```

#### Option 3: Chat as Nested Navigation

```dart
class MainApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: IndexedStack(
          index: _currentIndex,
          children: [
            HomePage(),
            ProfilePage(),
            ChatApp(),  // Chat as a tab
          ],
        ),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentIndex,
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
            BottomNavigationBarItem(icon: Icon(Icons.chat), label: 'Chat'),
          ],
        ),
      ),
    );
  }
}
```

### Custom UI Components

You can use individual components from the library:

```dart
import 'package:supa_chat/supa_chat.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';

class CustomChatScreen extends StatelessWidget {
  final SupaChatClient chatClient;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Custom Chat')),
      body: StreamChat(
        client: chatClient.client,
        child: StreamChannelListView(
          // Customize the channel list
          filter: Filter.and([
            Filter.equal('type', 'messaging'),
            Filter.in_('members', [chatClient.config.userId]),
          ]),
          sort: const [SortOption('last_message_at')],
          onChannelTap: (channel) {
            // Custom navigation
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => StreamChannel(
                  channel: channel,
                  child: const ChannelPage(),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
```

---

## Backend API Reference

### Stream Chat Integration Flow

```
1. User signs up
   ↓
2. Backend creates user in database
   ↓
3. Backend creates user in Stream Chat
   └─> StreamChat.upsertUser(userId, userName, imageUrl)
   ↓
4. Backend generates Stream token
   └─> client.createToken(userId)
   ↓
5. Frontend receives tokens
   ↓
6. Frontend connects to Stream
   └─> SupaChatClient.connect()
```

### Required Stream SDK Methods (Backend)

Your backend must use the Stream Chat SDK to:

```javascript
const { StreamChat } = require('stream-chat');

// Initialize Stream client
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

// Create user in Stream (during signup/login)
await serverClient.upsertUser({
  id: userId,
  name: displayName,
  image: avatarUrl,
});

// Generate Stream token
const streamToken = serverClient.createToken(userId);
```

### Database Schema

Minimum required user table schema:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- Username (used as Stream user ID)
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Security Best Practices

1. **Password Requirements**: Enforce strong passwords (min 8 chars, uppercase, lowercase, number)
2. **Rate Limiting**: Implement rate limits on signup/login endpoints
3. **JWT Security**: Use strong secrets, set reasonable expiration times
4. **Token Refresh**: Implement token refresh to avoid frequent re-logins
5. **HTTPS Only**: Use HTTPS in production
6. **CORS**: Configure CORS appropriately for your frontend domain
7. **Input Validation**: Validate all user inputs on both client and server

---

## Configuration

### SupaChatConfig Options

```dart
final config = SupaChatConfig(
  apiKey: 'your_stream_api_key',           // Required: Stream API key
  userId: 'current_user_id',               // Required: Current user's ID
  tokenProvider: () => getStreamToken(),   // Required: Function to fetch Stream token
  backendUrl: 'https://api.example.com',   // Required: Your backend URL
  theme: StreamChatThemeData.light(),      // Optional: Custom theme
  logLevel: Level.INFO,                    // Optional: Logging level (default: WARNING)
);
```

### Environment Variables

**Flutter App** (`.env`):
```env
API_BASE_URL=https://your-backend-url.com
```

**Backend** (`.env`):
```env
STREAM_API_KEY=your_key
STREAM_API_SECRET=your_secret
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
PORT=3001
DATABASE_PATH=./database.db
```

---

## Advanced Usage

### Opening Direct Messages Programmatically

```dart
final channel = await chatClient.openDirectChannel('other_user_id');
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (_) => StreamChannel(
      channel: channel,
      child: const ChannelPage(),
    ),
  ),
);
```

### Creating Group Channels

```dart
final channel = await chatClient.openGroupChannel(
  'my-group',
  ['user1', 'user2', 'user3'],
);
```

### Custom Token Provider

```dart
Future<String> customTokenProvider() async {
  // Fetch token from your own service
  final response = await http.post(
    Uri.parse('https://yourapi.com/stream-token'),
    headers: {'Authorization': 'Bearer $yourJWT'},
  );
  return jsonDecode(response.body)['streamToken'];
}

final config = SupaChatConfig(
  // ...
  tokenProvider: customTokenProvider,
);
```

### Listening to Connection State

```dart
chatClient.client.on().listen((event) {
  if (event.type == EventType.connectionChanged) {
    print('Connection state: ${event.online}');
  }
});
```

### Custom Theme

```dart
final config = SupaChatConfig(
  // ...
  theme: StreamChatThemeData.fromColorAndTextTheme(
    StreamColorTheme.dark(),
    StreamTextTheme.dark(),
  ),
);
```

---

## Development

### Running the Example App

```bash
# 1. Start backend
cd backend
npm install
npm start

# 2. Configure environment
cd ../supa_chat/example
echo "API_BASE_URL=http://10.0.2.2:3001" > .env  # Android
# or
echo "API_BASE_URL=http://localhost:3001" > .env  # iOS/Web

# 3. Run app
flutter pub get
flutter run
```

### Project Structure Best Practices

The library follows Flutter best practices:

- **Single Widget Per File**: Each widget has its own file (except private/tiny widgets)
- **Environment Variables**: All credentials stored in `.env` files
- **Secure Storage**: Tokens encrypted with `flutter_secure_storage`
- **State Management**: Provider pattern for predictable state
- **Error Handling**: Comprehensive try-catch with user-friendly messages
- **Code Formatting**: Use `dart format` and `dart fix` before committing

### Testing

```bash
# Run tests
cd supa_chat
flutter test

# Run integration tests
flutter test integration_test/
```

---

## Troubleshooting

### "Cannot connect to Stream"

- Verify Stream API key and secret in backend `.env`
- Check that backend is running and accessible
- Ensure `tokenProvider` is returning valid Stream token

### "Authentication failed"

- Verify backend URL in Flutter `.env`
- Check network connectivity
- Review backend logs for errors

### "Channel not found"

- Ensure user is connected to Stream before opening channels
- Verify channel IDs are consistent (library auto-generates IDs for direct messages)

### Android Emulator Network Issues

Use `10.0.2.2` instead of `localhost` in `.env`:
```env
API_BASE_URL=http://10.0.2.2:3001
```

---

## License

[Your License Here]

## Support

For issues and feature requests, please open an issue on GitHub.

For Stream Chat documentation, visit: https://getstream.io/chat/docs/

---

## Summary

**Required Backend Endpoints:**
1. `POST /signup` - Create account + Stream user + return tokens
2. `POST /login` - Authenticate + return tokens
3. `POST /token` - Refresh Stream token
4. `GET /users/search` - Search users
5. `GET /health` - Health check (optional)

**Key Integration Steps:**
1. Set up backend with Stream SDK
2. Add `supa_chat` dependency
3. Configure environment variables
4. Wrap app with `AuthProvider`
5. Initialize `SupaChatClient` when authenticated
6. Use `SupaChatApp` or individual components

**Stream Integration:**
- Backend creates Stream users during signup
- Backend generates Stream tokens using SDK
- Frontend connects to Stream with tokens
- Library handles all Stream UI components

This library provides a complete, production-ready chat solution that handles authentication, token management, and UI components, allowing you to focus on your app's core features.
