# PMTools.pro

PMTools.pro is a progressive web application (PWA) providing productivity professionals with a suite of powerful, intuitive tools. Built with modern web technologies and focused on performance, scalability, and user experience.

## 🚀 Features

- **Calculator**: Advanced calculation modes with history tracking and shareable results
- **Time Tracker**: Pomodoro technique integration with project-based logging
- **Project Estimation Tool**: Parametric cost estimation with risk factor calculations
- Dark/Light theme support
- Responsive design
- PWA support

## 🛠 Tech Stack

- **Frontend**: React (Next.js 14+)
- **Backend**: Supabase
- **Database**: Supabase Postgres
- **State Management**: Zustand
- **UI Framework**: Shadcn/UI
- **Styling**: Tailwind CSS
- **Analytics**: Plausible (privacy-focused)
- **Hosting**: Netlify

## 🏗 Project Structure

```
pmtools.pro/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx         # Root layout component
│   │   ├── page.tsx          # Home page component
│   │   └── globals.css       # Global styles
│   ├── components/            # Reusable components
│   │   ├── tools/            # Tool-specific components
│   │   │   └── calculator/   # Calculator tool components
│   │   ├── ui/              # UI components (shadcn/ui)
│   │   └── theme/           # Theme components
│   ├── lib/                  # Utility functions and configs
│   │   ├── supabase.ts      # Supabase client
│   │   └── utils.ts         # Helper functions
│   └── pages/               # Page components
├── public/                   # Static assets
├── styles/                   # CSS modules and styles
├── types/                    # TypeScript type definitions
├── package.json             # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # Project documentation
```

## 🚦 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/whittenluke/pmtools.pro.git
cd pmtools.pro
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## 🧪 Testing

Coming soon...

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Luke Whitten

## 🔮 Roadmap

### Short-Term (3-6 months)

- Launch initial 3 tools
- Establish user base
- Implement analytics
- Optimize SEO
- Build community engagement

### Mid-Term (6-18 months)

- Expand tool ecosystem
- Introduce user collaboration features
- Develop mobile PWA
- Implement advanced monetization
- Create developer API

### Long-Term (2-5 years)

- Become the de-facto productivity toolkit
- Enterprise-grade feature set
- Global user community
- Platform expansion
- AI-powered tool recommendations

## 🌟 Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Supabase](https://supabase.com/) for the backend infrastructure

## 📧 Contact

Luke Whitten - [GitHub](https://github.com/whittenluke)

Project Link: [https://github.com/whittenluke/pmtools.pro](https://github.com/whittenluke/pmtools.pro)
