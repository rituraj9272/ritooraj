# 🚀 Rituraj Singh - DevOps Engineer Portfolio

A modern, interactive portfolio website showcasing DevOps engineering expertise, cloud infrastructure projects, and professional experience.

![Portfolio Preview](https://img.shields.io/badge/Portfolio-Live-00D9FF)
![License](https://img.shields.io/badge/License-MIT-7B2FF7)
![Status](https://img.shields.io/badge/Status-Active-00FFA3)

## ✨ Features

### 🎨 Design
- **Dark DevOps Theme**: Professional dark mode with cyan, purple, and accent colors
- **Animated Background**: Canvas-based CI/CD pipeline visualization
- **Smooth Animations**: Intersection Observer API for scroll-triggered animations
- **Fully Responsive**: Mobile-first design that works on all devices
- **Modern UI/UX**: Clean, professional layout inspired by top DevOps portfolios

### 📋 Sections
1. **Hero Section**: Eye-catching introduction with animated typing effect
2. **About**: Professional summary with code-style presentation
3. **Skills**: Comprehensive DevOps toolset organized by category
4. **Projects**: Featured GitHub projects with live stats
5. **Architecture**: Animated CI/CD pipeline and infrastructure diagrams
6. **Experience**: Timeline view of professional journey
7. **Case Studies**: Detailed DevOps implementation examples
8. **Certifications**: Professional credentials and achievements
9. **Terminal**: Interactive terminal-style section
10. **Contact**: Easy ways to connect with form and social links

### 🌟 Interactive Features
- Smooth scrolling navigation
- Animated pipeline visualization
- Hover effects on all interactive elements
- Mobile-responsive hamburger menu
- Back-to-top button
- Scroll progress indicator
- Keyboard navigation (Arrow keys)
- Contact form with mailto integration
- Console easter eggs for curious developers

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern flexbox & grid layouts
- **Vanilla JavaScript**: No frameworks, pure JS
- **Font Awesome**: Icons library
- **Canvas API**: Background animations

## 📁 Project Structure

```
Portfolio/
├── index.html          # Main HTML file
├── style.css           # Styling and animations
├── script.js           # JavaScript functionality
├── README.md           # This file
└── RES/
    ├── profile.png            # Your profile picture
    └── Rituraj_Devops.pdf     # Your resume PDF
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code (recommended) or any code editor
- Live Server extension for VS Code (optional but recommended)

### Installation

1. **Clone or Download**
   ```bash
   git clone <your-repo-url>
   # OR download the ZIP and extract
   ```

2. **Add Your Profile Picture**
   - Place your profile image in the `RES` folder
   - Name it `profile.png` (or update the path in `index.html`)
   - Recommended size: 500x500px (square)

3. **Add Your Resume**
   - Place your resume PDF in the `RES` folder
   - Name it `Rituraj_Devops.pdf` (or update the path in `index.html`)

### Running Locally

#### Method 1: Using VS Code Live Server (Recommended)

1. Open the project folder in VS Code
2. Install "Live Server" extension by Ritwick Dey
3. Right-click on `index.html`
4. Select "Open with Live Server"
5. Your default browser will open at `http://127.0.0.1:5500`

#### Method 2: Using Python HTTP Server

```bash
# Navigate to the project directory
cd Portfolio

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Open browser to http://localhost:8000
```

#### Method 3: Direct File Opening

Simply double-click `index.html` to open in your default browser.
(Some features like contact form may work better with a local server)

## 🎨 Customization

### Update Personal Information

1. **index.html**
   - Update name, title, tagline
   - Change social media links
   - Modify project descriptions
   - Update experience timeline
   - Change certifications

2. **style.css**
   - Colors: Modify CSS variables at the top
   - Fonts: Change font families
   - Spacing: Adjust padding/margins
   - Animations: Customize transition speeds

3. **script.js**
   - Animation timings
   - Canvas particle effects
   - Typing speed
   - Form submission behavior

### Color Scheme

Current theme colors (in `style.css`):
```css
--primary-color: #00D9FF;     /* Cyan - Main accent */
--secondary-color: #7B2FF7;   /* Purple - Secondary accent */
--accent-color: #FF006E;      /* Pink - Highlights */
--success-color: #00FFA3;     /* Green - Success states */
--warning-color: #FFD60A;     /* Yellow - Warnings */
```

To change colors, simply update these CSS variables.

### Adding New Projects

In `index.html`, duplicate a project card and update:
```html
<div class="project-card">
    <div class="project-icon">
        <i class="fas fa-your-icon"></i>
    </div>
    <h3>Project Name</h3>
    <p class="project-description">Description...</p>
    <div class="project-tags">
        <span>Tech1</span>
        <span>Tech2</span>
    </div>
    <div class="project-links">
        <a href="github-url" target="_blank" class="project-link">
            <i class="fab fa-github"></i> View Code
        </a>
    </div>
</div>
```

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## 🌐 Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings
3. Navigate to Pages section
4. Select branch (main) and folder (root)
5. Click Save
6. Your site will be live at `https://yourusername.github.io/repository-name/`

### Netlify

1. Drag and drop your `Portfolio` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository
3. Site goes live instantly with custom domain option

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow the prompts
4. Your site will be deployed

## 🐛 Troubleshooting

### Images not loading
- Check file paths in `index.html`
- Ensure images are in the `RES` folder
- Verify file names match exactly (case-sensitive)

### Animations not working
- Check browser console for JavaScript errors
- Ensure all files are in the same directory
- Try clearing browser cache

### Contact form not working
- The form uses `mailto:` which requires an email client
- Update email address in `script.js`
- Consider integrating with FormSpree or EmailJS for web-based forms

## 🔧 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ IE11 (limited support, animations may not work)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📞 Contact

**Rituraj Singh**
- Email: singh.ritooraj@gmail.com
- GitHub: [@ritooraj01](https://github.com/ritooraj01)
- LinkedIn: [rituraj-singh-0001](https://linkedin.com/in/rituraj-singh-0001)

## 🎯 Keywords

DevOps • AWS • Cloud Infrastructure • CI/CD • Jenkins • Docker • Kubernetes • ECS • Redis • RabbitMQ • Portfolio • Web Development • Automation • SRE • Site Reliability Engineering

---

**Built with ❤️ and ☕ by Rituraj Singh**

*"Infrastructure is code. Code is life. Life is... mostly debugging."* 😄

## 🚀 Quick Start Commands

```bash
# Clone the repository
git clone <your-repo>

# Navigate to directory
cd Portfolio

# Start local server (using Python 3)
python -m http.server 8000

# Open browser
open http://localhost:8000
```

## 📝 TODO / Future Enhancements

- [ ] Add dark/light mode toggle
- [ ] Integrate real-time GitHub stats API
- [ ] Add blog section
- [ ] Implement search functionality
- [ ] Add language switcher (i18n)
- [ ] Create downloadable resume generator
- [ ] Add project filtering by technology
- [ ] Implement lazy loading for images
- [ ] Add accessibility improvements (ARIA labels)
- [ ] SEO optimization
- [ ] Add Google Analytics
- [ ] Create sitemap.xml
- [ ] Add PWA support

## 🙏 Credits

- **Design Inspiration**: 
  - [adityaseth.in](https://adityaseth.in)
  - [aradhyapuneeth.github.io](https://aradhyapuneeth.github.io)
- **Icons**: [Font Awesome](https://fontawesome.com)
- **Fonts**: System fonts for optimal performance

---

⭐ Star this repo if you found it helpful!
🍴 Fork it to create your own portfolio!
