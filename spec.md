# Snakes and Ladders

## Current State
A fully interactive multiplayer Snakes and Ladders game with a React frontend. It has:
- GameSetup screen with a background image
- Main game board with dice, move log, and scoreboard tabs
- WinModal component
- Footer with copyright and caffeine.ai link on both setup and game screens
- Sound effects and visual animations for snakes/ladders
- No navigation, authentication, or informational pages

## Requested Changes (Diff)

### Add
- Footer navigation links: Disclaimer, Privacy Policy, About Us, Contact Us
- Modal dialogs for each footer page with relevant placeholder content:
  - **Disclaimer**: Legal disclaimer about the game being for entertainment purposes
  - **Privacy Policy**: What data is collected (game scores), how it's used, no personal data sold
  - **About Us**: Short description of the game and team/creator info
  - **Contact Us**: Contact form or email address placeholder
- **Login** modal: Form with email + password fields and a Submit button
- **Sign Up** modal: Form with name, email, password, confirm password fields and a Submit button
- Login and Sign Up buttons in the header (both setup and game screens)
- Footer links visible on both the setup screen and the game screen

### Modify
- Footer on both setup screen and game screen: add links for Disclaimer, Privacy Policy, About Us, Contact Us
- Header: add Login and Sign Up buttons

### Remove
- Nothing

## Implementation Plan
1. Create a `FooterLinks` component that renders the four text links + triggers modals
2. Create a `PageModal` component (reusable Dialog) for Disclaimer, Privacy Policy, About Us, Contact Us content
3. Create a `LoginModal` component with email/password form fields
4. Create a `SignUpModal` component with name, email, password, confirm password form fields
5. Add Login/Sign Up buttons to the header in `App.tsx` (both phases)
6. Replace inline footer in `App.tsx` (both setup and game phases) with the new `FooterLinks` component
7. Login and Sign Up are UI-only (no backend auth yet) - show a toast or placeholder on submit
