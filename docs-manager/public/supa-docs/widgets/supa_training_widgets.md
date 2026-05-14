# Supa Training Widgets

This document provides an overview of the reusable widgets in the `supa_training` package.

## AudioPlayerWidget

The `AudioPlayerWidget` provides a robust audio player with play/pause functionality, a progress bar that allows seeking, and comprehensive handling for loading and error states. It is designed to play audio from a given URL.

### Usage

```dart
const AudioPlayerWidget({
  super.key,
  required this.audioUrl,
  this.onPlaybackComplete,
  required this.isProcessing,
  this.audioName,
  this.onPlayerCreated,
});
```

### Example

```dart
AudioPlayerWidget(
  audioUrl: 'https://example.com/audio.mp3',
  isProcessing: false,
  audioName: 'My Audio Track',
  onPlaybackComplete: () {
    print('Playback completed!');
  },
)
```

## ContentWidget

The `ContentWidget` is responsible for displaying HTML content fetched from a specified URL. It provides visual feedback for loading states and error conditions, with a retry mechanism.

### Usage

```dart
const ContentWidget({
  super.key,
  required this.title,
  required this.fileUrl,
  required this.fileName,
});
```

### Example

```dart
ContentWidget(
  title: 'Lesson 1: Introduction',
  fileUrl: 'https://example.com/lesson1.html',
  fileName: 'lesson1.html',
)
```

## CourseCard

The `CourseCard` widget displays a compact overview of a training course, featuring its image, name, type, and (if applicable) end date. It's designed to be tappable for further interaction.

### Usage

```dart
const CourseCard({
  super.key,
  required this.course,
  required this.onTap,
  this.itemHeight = 280,
  this.isSmall,
});
```

### Example

```dart
CourseCard(
  course: course,
  onTap: () {
    // Navigate to course details
  },
)
```

## CustomSelectionGroup

The `CustomSelectionGroup` widget allows users to select one or multiple options from a provided list of `QuestionAnswer` objects. It supports both single and multi-selection modes and provides visual feedback for correct answers once the question has been answered.

### Usage

```dart
const CustomSelectionGroup({
  super.key,
  required this.options,
  required this.onChanged,
  required this.answered,
  required this.answerMappings,
  this.isMultiSelect = false,
});
```

### Example

```dart
CustomSelectionGroup(
  options: [
    QuestionAnswer(id: 1, content: 'Option 1', isCorrectAnswer: false),
    QuestionAnswer(id: 2, content: 'Option 2', isCorrectAnswer: true),
  ],
  onChanged: (selectedOptions) {
    print('Selected options: $selectedOptions');
  },
  answered: false,
  answerMappings: [],
  isMultiSelect: false,
)
```

## OptionChoice

The `OptionChoice` widget is an interactive component designed for presenting multiple-choice or single-choice questions within training modules. It features a countdown timer, displays question content (including a title and an optional image), and allows users to select answers with visual feedback. It supports both single and multiple answer selections.

### Usage

```dart
const OptionChoice({
  super.key,
  required this.contents,
  this.file,
  required this.title,
  required this.time,
  required this.selecteds,
  this.onUpdateOption,
  this.onTimeUp,
  required this.courseSectionId,
  required this.courseSectionContentId,
  required this.isCompleted,
  required this.isMultipleChoice,
});
```

### Example

```dart
OptionChoice(
  title: 'What is Flutter?',
  time: 60,
  contents: [
    CourseSectionContentAnswerOption(id: 1, content: 'A bird', isCorrect: false),
    CourseSectionContentAnswerOption(id: 2, content: 'A UI toolkit', isCorrect: true),
  ],
  selecteds: [],
  courseSectionId: 1,
  courseSectionContentId: 1,
  isCompleted: false,
  isMultipleChoice: false,
  onUpdateOption: (selected) {
    print('Selected: $selected');
  },
  onTimeUp: (timeUp) {
    print('Time up: $timeUp');
  },
)
```

## PathCard

The `PathCard` widget displays a card representing a training path, showcasing its image, name, and the total number of courses it encompasses. It is designed to be tappable for user interaction.

### Usage

```dart
const PathCard({
  super.key,
  required this.trainingPath,
  required this.onTap,
  this.itemHeight = 132,
});
```

### Example

```dart
PathCard(
  trainingPath: trainingPath,
  onTap: () {
    // Navigate to training path details
  },
)
```

## QuestionAnswerResult

The `QuestionAnswerResult` widget displays the outcome of a question and answer, visually indicating whether the answer was correct or incorrect through an icon and corresponding text.

### Usage

```dart
const QuestionAnswerResult({
  super.key,
  required this.isCorrect,
  required this.content,
});
```

### Example

```dart
QuestionAnswerResult(
  isCorrect: true,
)
```

## QuizCard

The `QuizCard` widget displays a quiz entry, showing its name, deadline, and a visual indicator (lock icon) if prerequisite courses are not completed. It handles user interaction, including navigation to course previews when required.

### Usage

```dart
const QuizCard({
  super.key,
  required this.quiz,
  required this.onTap,
  this.itemHeight = 240,
});
```

### Example

```dart
QuizCard(
  quiz: quizPartition,
  onTap: () {
    // Navigate to quiz details
  },
)
```

## ResponsiveGridView

The `ResponsiveGridView` widget arranges a list of items in a grid layout, dynamically adjusting the number of columns based on the available screen width to provide a responsive user interface.

### Usage

```dart
const ResponsiveGridView({
  super.key,
  required this.items,
  required this.itemHeight,
  this.padding,
});
```

### Example

```dart
ResponsiveGridView(
  items: const [
    Card(child: Center(child: Text('Item 1'))),
    Card(child: Center(child: Text('Item 2'))),
    Card(child: Center(child: Text('Item 3'))),
  ],
  itemHeight: 150,
)
```

## SidleImage

The `SidleImage` widget presents a series of images as slides, optionally accompanied by notes. It provides a `PageView` for navigation, a page indicator, and functionality for full-screen image viewing, suitable for step-by-step training content.

### Usage

```dart
const SidleImage({
  super.key,
  required this.contents,
  required this.hasAudioFile,
});
```

### Example

```dart
SidleImage(
  contents: [
    CourseSectionContentSlide(
      image: File(url: 'https://example.com/slide1.jpg'),
      note: 'This is the first slide.',
    ),
    CourseSectionContentSlide(
      image: File(url: 'https://example.com/slide2.jpg'),
      note: 'This is the second slide.',
    ),
  ],
)
```

## TextBorderButton

The `TextBorderButton` widget provides a customizable button with a text label, a border, and optional features like an icon and a loading indicator.

### Usage

```dart
const TextBorderButton({
  super.key,
  required this.text,
  required this.onPressed,
  this.isLoading = false,
  this.mainAxisAlignment = MainAxisAlignment.start,
  this.icon,
  this.textStyle,
});
```

### Example

```dart
TextBorderButton(
  text: 'Submit',
  onPressed: () {
    // Handle button press
  },
)
```

## TrainingAttachmentItem

The `TrainingAttachmentItem` widget displays a single attachment, which can be either a file or a link. It shows an appropriate icon, the attachment name, and for files, it displays the file size and a download/open button. This widget is functionally identical to `AttachmentItem` in `supa_spend`.

### Usage

```dart
const TrainingAttachmentItem({
  super.key,
  required this.item,
});
```

### Example

```dart
TrainingAttachmentItem(
  item: attachment,
)
```

## TrueFalseChoice

The `TrueFalseChoice` widget is a specialized interactive component designed for presenting true/false questions within training modules. It shares similar functionalities with `OptionChoice` but is optimized for binary answer selections. It includes a timer, displays content (title, optional image), and allows users to make true/false selections.

### Usage

```dart
const TrueFalseChoice({
  super.key,
  required this.contents,
  this.file,
  required this.title,
  required this.time,
  required this.selecteds,
  this.onUpdateOption,
  this.onTimeUp,
  required this.courseSectionId,
  required this.courseSectionContentId,
  required this.isCompleted,
  required this.isMultipleChoice,
  required this.content,
});
```

### Example

```dart
TrueFalseChoice(
  title: 'Is Flutter a UI framework?',
  time: 30,
  contents: [
    CourseSectionContentAnswerOption(id: 1, content: 'True', isCorrect: true),
    CourseSectionContentAnswerOption(id: 2, content: 'False', isCorrect: false),
  ],
  selecteds: [],
  courseSectionId: 1,
  courseSectionContentId: 1,
  isCompleted: false,
  isMultipleChoice: false,
  content: 'Select true or false.',
  onUpdateOption: (selected) {
    print('Selected: $selected');
  },
)
```

## YoutubeVideoPlayerWidget

The `YoutubeVideoPlayerWidget` embeds and plays YouTube videos, providing playback controls and handling various video states.

### Usage

```dart
const YoutubeVideoPlayerWidget({
  super.key,
  required this.videoUrl,
  this.onVideoComplete,
  this.isAutoplay = true,
  this.isRewind = false,
  this.isLandscape = false,
});
```

### Example

```dart
YoutubeVideoPlayerWidget(
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
  isAutoplay: true,
  onVideoComplete: () {
    print('Video playback completed!');
  },
)
```