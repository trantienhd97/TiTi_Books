# Celebration Animation Guide

This document describes the implementation and usage of the full-screen celebration animation within the Super App.

## Overview

The celebration animation is a reusable visual effect designed to provide positive feedback to users upon completing a significant task (e.g., finishing a task assignment). It features a mascot or icon that leaps across the screen from bottom-left to top-right, pauses in the center with a pulse effect, and then flies off-screen.

## Location

The animation code is located in:
`packages/supa_work/lib/animations/celebration_animation.dart`

## Features

- **Full-Screen Rendering**: Uses Flutter's `Overlay` to ensure the animation is visible over all other UI elements.
- **Dynamic Trajectory**: Moves in a parabolic arc with smooth easing.
- **Mid-point Pause**: Pauses for approximately 1 second in the center of the screen.
- **Customizable**: Allows passing any `Widget` to be used as the mascot.
- **Rainbow Trail**: Includes a default multi-colored trail behind the mascot.

## Usage

### Simple Usage
To trigger the animation with the default mascot (sparkle icon with rainbow trail):

```dart
CelebrationOverlay.show(context);
```

### Custom Mascot
To use a custom widget or icon as the mascot:

```dart
CelebrationOverlay.show(
  context,
  child: Container(
    width: 80,
    height: 80,
    decoration: BoxDecoration(
      color: Colors.orange,
      shape: BoxShape.circle,
    ),
    child: Icon(Icons.star, color: Colors.white, size: 40),
  ),
);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `context` | `BuildContext` | Required. Used to find the application's Overlay. |
| `child` | `Widget?` | Optional. The widget to animate. If null, a default mascot is used. |
| `duration` | `Duration` | Optional. Total duration of the animation (default: 4 seconds). |

## Implementation Details

The animation uses an `AnimationController` with a custom mapping from `rawProgress` to `t` (spatial progress) to achieve the pause effect in the center:

- **0.0 - 0.4**: Fly to center (t moves from 0.0 to 0.5).
- **0.4 - 0.65**: Pause at center (t remains 0.5, scale pulses).
- **0.65 - 1.0**: Fly from center to end (t moves from 0.5 to 1.0).
