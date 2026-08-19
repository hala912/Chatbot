# Chatbot

A simple AI chatbot built with Next.js, Tailwind CSS, DaisyUI, and the Google Gemini API.

## Features

- Real-time chat interface with message history
- Powered by Google's Gemini (`gemini-3.6-flash`) via `@google/genai`
- Styled with Tailwind CSS + DaisyUI chat components
- Loading indicator while waiting for AI responses

## Tech stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4 + DaisyUI v5
- **AI:** Google Gemini API (`@google/genai`)
- **Language:** TypeScript

## Getting started

### Prerequisites

- Node.js 20.6+ recommended
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

```bash
npm install
```

### Environment setup

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=your_api_key_here
```

Never commit this file — it's already covered by `.gitignore`.

### Run the dev server

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) to see the chatbot.

## Project structure

```
app/
  api/
    chat/
      route.ts       # API route that talks to Gemini
  page.tsx            # Chat UI (input, message history, send logic)
  layout.tsx
  globals.css
```

## How it works

1. The frontend (`app/page.tsx`) keeps the full conversation in React state as a `history` array.
2. On send, the updated history is POSTed to `/api/chat`.
3. The API route (`app/api/chat/route.ts`) forwards the history to Gemini via `generateContent` and returns the model's reply.
4. The frontend appends the reply to `history` and re-renders the chat.

## Roadmap / ideas

- [ ] Streaming responses (word-by-word) instead of waiting for the full reply
- [ ] Error handling UI for rate limits / model overload (503s)
- [ ] Persist chat history (localStorage or a database)
- [ ] Deploy to Vercel

## License

Personal learning project.