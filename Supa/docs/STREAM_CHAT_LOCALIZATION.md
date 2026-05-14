# Stream Chat Localization Configuration

## Overview

This document explains how Stream Chat Flutter localizations are configured for multiple languages, especially for languages not supported by Jiffy (Vietnamese, Indonesian).

## Supported Languages

The communication module supports the following languages:
- **Vietnamese (vi)** - Custom implementation
- **English (en)** - Built-in Stream Chat support
- **Korean (ko)** - Built-in Stream Chat support  
- **Indonesian (id)** - Custom implementation

## Implementation Details

### Custom Localizations

Custom localizations have been created for Vietnamese and Indonesian in:
`packages/supa_communication/lib/config/stream_chat_localizations.dart`

These extend `GlobalStreamChatLocalizations` and provide translations for all Stream Chat UI strings.

### Date Formatting

Since Jiffy doesn't support Vietnamese, Korean, or Indonesian well, date formatting is handled manually:

**Vietnamese (`sentAtText`):**
- Uses custom `_getDay()` helper method
- Formats dates as "ngày [day] [month]" (e.g., "ngày 15 tháng 1")
- Uses 24-hour time format manually

**Indonesian (`sentAtText`):**
- Uses custom `_getDay()` helper method  
- Formats dates as "tanggal [day] [month]" (e.g., "tanggal 15 Januari")
- Uses 24-hour time format manually

**Korean:**
- Uses built-in Stream Chat Korean localization which handles dates appropriately

### Integration

The localization delegates are automatically added to `MaterialApp.localizationsDelegates` in:
`packages/supa_foundation/lib/supa_app.dart`

The custom delegates are added before the built-in Stream Chat delegates so they take precedence for Vietnamese and Indonesian locales.

## Usage

The localizations are automatically applied based on the app's current locale. Stream Chat widgets will use:
- Vietnamese translations when locale is `vi`
- Indonesian translations when locale is `id`
- Korean translations when locale is `ko` (built-in)
- English translations when locale is `en` (built-in)

## Adding More Translations

To add more translations or update existing ones, edit:
`packages/supa_communication/lib/config/stream_chat_localizations.dart`

Add methods to either `StreamChatLocalizationsVi` or `StreamChatLocalizationsId` classes following the same pattern as the existing methods.

## Notes

- Date formatting for Vietnamese and Indonesian is handled manually since Jiffy doesn't support these languages
- All required abstract methods from `GlobalStreamChatLocalizations` are implemented
- Some warnings about "doesn't override an inherited getter" may appear but are safe to ignore (these are likely methods that don't exist in the base class)
