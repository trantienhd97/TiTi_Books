# Streak Animation Guide

This document describes the implementation and usage of the `SupaStreakAnimation` widget, used for providing visual feedback during state updates (e.g., successful task status changes).

## Overview

The `SupaStreakAnimation` is a reusable widget that creates a "light streak" or "shimmer" effect that sweeps across a container. It's designed to be subtle yet noticeable, providing a premium feel to UI interactions.

## Location

The animation code is located in:
`packages/supa_work/lib/animations/streak_animation.dart`

## Features

- **Customizable Color**: The streak uses a gradient based on the provided color.
- **Adjustable Speed**: Control the transit time via the `duration` parameter.
- **Variable Length**: Use `widthFactor` to make the streak shorter or longer than the host container.
- **Smooth Fade**: Uses a `LinearGradient` with transparent ends for a soft, professional look.
- **Automatic Lifecycle**: Handles its own `AnimationController` and state transitions.

## Usage

### Simple Usage
Place the widget inside a `Stack` (usually as the first child to appear behind text, or last for an overlay effect).

```dart
Stack(
  children: [
    SupaStreakAnimation(
      isUpdating: _isLoading, // Boolean trigger
      color: theme.colorScheme.primary,
    ),
    // Your content here
  ],
)
```

### Custom Configuration
To create a long, slow-moving gold streak:

```dart
SupaStreakAnimation(
  isUpdating: _isProcessing,
  color: Colors.amber,
  duration: const Duration(milliseconds: 1000),
  widthFactor: 3.0, // Length is 3x the container width
)
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `isUpdating` | `bool` | **Required** | When changed from `false` to `true`, triggers the animation once. |
| `color` | `Color` | `Colors.green` | The base color for the shimmer gradient. |
| `duration` | `Duration` | `400ms` | Total time for the streak to move from off-screen left to off-screen right. |
| `widthFactor` | `double` | `2.0` | The width of the streak segment relative to the container width. |

## Implementation Details

The widget uses a `LayoutBuilder` to calculate the container's width. The animation sweeps the `left` property of the streak from `-segmentWidth` to `totalWidth`, ensuring it starts and ends completely off-screen.

The internal gradient is configured as:
- `color.withValues(alpha: 0.0)` at the edges.
- `color.withValues(alpha: 0.15)` at the center (peak intensity).
