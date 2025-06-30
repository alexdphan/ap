# Parallax Configuration

The parallax effect strength can now be controlled via an environment variable.

## Setup

1. Create a `.env.local` file in your project root (same directory as `package.json`)

2. Add the following line to your `.env.local` file:

```bash
NEXT_PUBLIC_PARALLAX_STRENGTH=0.25
```

## Configuration Options

| Value | Effect | Description |
|-------|--------|-------------|
| `0.0` | None | No parallax movement |
| `0.1` | Very Subtle | Barely noticeable movement |
| `0.25` | Subtle ⭐ | Recommended default |
| `0.5` | Moderate | Noticeable movement |
| `0.75` | Strong | Dramatic movement |
| `1.0` | Maximum | Very pronounced effect |

## Example `.env.local` file:

```bash
# Parallax effect strength (0.0 to 1.0)
NEXT_PUBLIC_PARALLAX_STRENGTH=0.25
```

## Important Notes

- Values must be between `0.0` and `1.0`
- If no environment variable is set, defaults to `0.25`
- Restart your development server after changing the value
- The environment variable affects all parallax components site-wide

## How it Works

The configuration is handled by `lib/parallax-config.ts`, which:
- Reads the `NEXT_PUBLIC_PARALLAX_STRENGTH` environment variable
- Validates the value is between 0 and 1
- Falls back to 0.25 if not set or invalid
- Provides the value to all parallax components

This ensures consistent parallax behavior across your entire site with easy configuration. 