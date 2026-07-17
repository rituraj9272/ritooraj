# Requirements Document

## Introduction

This feature advances an existing beginner-level DevOps portfolio website (single-page static site built with HTML, CSS, and vanilla JavaScript) into a polished, unique, and production-quality portfolio for Rituraj Singh, a DevOps Engineer. The current site already includes a terminal-boot loading screen, split-screen hero, JSON-styled about block, categorized skills, filterable projects, animated architecture diagrams, an experience timeline, certifications, an interactive terminal, dark/light theming, a custom cursor, a canvas particle background, and scroll-driven animations. It is deployed to GitHub Pages at `ritooraj01.github.io`.

This enhancement treats the existing codebase as the foundation rather than rewriting from scratch. It introduces a signature interactive concept (a live infrastructure-dashboard / bootable-OS metaphor where the interactive terminal doubles as real site navigation), live GitHub data integration, interactive animated architecture diagrams as a centerpiece, a functioning contact form backed by a third-party form service, and improvements to performance, SEO, accessibility, responsiveness, and cross-browser support. All changes must remain deployable as static assets on GitHub Pages (no server-side runtime).

## Glossary

- **Portfolio_Site**: The single-page static web application that presents Rituraj Singh's professional profile, deployed as static assets on GitHub Pages.
- **Boot_Screen**: The terminal-styled loading screen displayed on initial page load before the main content is revealed.
- **Signature_Interface**: The distinctive interactive "bootable-OS / live infrastructure dashboard" concept that unifies the site's visual identity and navigation.
- **Command_Terminal**: The interactive terminal component that accepts typed commands and can navigate the Portfolio_Site.
- **GitHub_Data_Service**: The client-side module responsible for retrieving Rituraj Singh's public GitHub statistics and repository data from the GitHub public API.
- **Architecture_Diagram**: An interactive, animated visual representation of a DevOps pipeline or cloud infrastructure topology.
- **Contact_Form**: The form component that allows visitors to send a message to Rituraj Singh.
- **Form_Service**: The third-party form-handling backend (for example, EmailJS or Formspree) that receives and delivers Contact_Form submissions.
- **Theme_Controller**: The component that manages selection and persistence of dark and light visual themes.
- **Resume_Asset**: The résumé PDF file stored in the RES folder that visitors can view or download.
- **Motion_System**: The coordinated set of animations, transitions, and micro-interactions applied across the Portfolio_Site.
- **Reduced_Motion_Preference**: The visitor's operating-system or browser setting requesting minimized non-essential animation (`prefers-reduced-motion: reduce`).
- **Section**: A distinct content region of the Portfolio_Site (for example, hero, about, skills, projects, architecture, experience, certifications, contact).
- **Visitor**: Any person viewing the Portfolio_Site in a web browser.
- **Supported_Browser**: The latest two stable major versions of Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge.

## Requirements

### Requirement 1: Signature Interactive Interface

**User Story:** As a Visitor, I want a distinctive, cohesive interactive experience, so that the portfolio feels unique and memorable rather than a generic DevOps template.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL present a Signature_Interface that applies a consistent bootable-OS / live infrastructure dashboard visual metaphor across all Sections.
2. THE Portfolio_Site SHALL retain the cyan (#00D9FF), purple (#7B2FF7), and pink (#FF006E) accent palette as the primary color identity.
3. THE Portfolio_Site SHALL apply the glassmorphism card styling and monospace terminal typography consistently across all Sections.
4. WHEN a Visitor navigates between Sections, THE Portfolio_Site SHALL maintain the Signature_Interface visual metaphor without visual style discontinuity between Sections.

### Requirement 2: Terminal-Driven Navigation

**User Story:** As a Visitor, I want to navigate the site by typing commands in the interactive terminal, so that the terminal is a real navigation tool rather than a decorative element.

#### Acceptance Criteria

1. WHEN a Visitor submits the command `help` in the Command_Terminal, THE Command_Terminal SHALL display the list of all supported commands.
2. WHEN a Visitor submits a navigation command that names an existing Section, THE Command_Terminal SHALL scroll the Portfolio_Site to that Section.
3. IF a Visitor submits a command that is not recognized, THEN THE Command_Terminal SHALL display an error message that names the unrecognized command and refers the Visitor to the `help` command.
4. WHEN a Visitor submits the command `clear`, THE Command_Terminal SHALL remove all previously displayed command output from the Command_Terminal.
5. THE Command_Terminal SHALL always display each submitted command together with its resulting output in the terminal output area in submission order.
6. WHERE the Visitor's viewport width is 768 pixels or less, THE Command_Terminal SHALL remain operable through the on-screen text input.

### Requirement 3: Boot Screen Loading Experience

**User Story:** As a Visitor, I want an engaging boot sequence on first load, so that the site establishes its identity while the page prepares.

#### Acceptance Criteria

1. WHEN the Portfolio_Site begins loading, THE Boot_Screen SHALL display the terminal-styled boot sequence.
2. WHEN the boot sequence completes, THE Boot_Screen SHALL hide itself and reveal the main content.
3. IF the boot sequence has not completed within 8 seconds of page load, THEN THE Boot_Screen SHALL hide itself and reveal the main content.
4. WHILE the Reduced_Motion_Preference is enabled, THE Boot_Screen SHALL reveal the main content within 1 second without animated progression.

### Requirement 4: Live GitHub Data Integration

**User Story:** As Rituraj Singh, I want my portfolio to display live GitHub statistics, so that visitors see current activity instead of hardcoded numbers that become stale.

#### Acceptance Criteria

1. WHEN the projects Section loads, THE GitHub_Data_Service SHALL request public profile statistics for the GitHub account `ritooraj01` from the GitHub public API.
2. WHEN the GitHub_Data_Service receives a successful response, THE Portfolio_Site SHALL display the retrieved public repository count and primary language.
3. IF the GitHub_Data_Service request fails or does not complete within 5 seconds, THEN THE Portfolio_Site SHALL display predefined fallback statistics and SHALL display the projects Section without error to the Visitor.
4. WHEN the GitHub_Data_Service retrieves repository data, THE Portfolio_Site SHALL display the featured public repositories `alb-observability-automation`, `rabbitmq-production-monitoring`, `multi-vpc-cloudwatch-centralized-monitoring`, `AWS-Cloud-Cost`, and `assistant-ai`.
5. THE GitHub_Data_Service SHALL retrieve GitHub data using only unauthenticated public API requests without embedding any secret credential or token in the delivered static assets.

### Requirement 5: Interactive Architecture Diagrams

**User Story:** As a Visitor, I want interactive and animated architecture diagrams, so that I can understand the DevOps pipelines and infrastructure as an engaging centerpiece.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display at least one CI/CD pipeline Architecture_Diagram and at least one cloud infrastructure Architecture_Diagram.
2. WHEN a Visitor points to or focuses on a node within an Architecture_Diagram, THE Architecture_Diagram SHALL visually highlight the focused node.
3. WHILE an Architecture_Diagram is within the Visitor's viewport, THE Architecture_Diagram SHALL animate flow between its nodes.
4. WHILE the Reduced_Motion_Preference is enabled, THE Architecture_Diagram SHALL display all nodes in their final state without flow animation.

### Requirement 6: Functional Contact Form

**User Story:** As a Visitor, I want to send a message directly from the site, so that I can contact Rituraj Singh without opening a separate email client.

#### Acceptance Criteria

1. THE Contact_Form SHALL provide input fields for the Visitor's name, email address, and message.
2. WHEN a Visitor submits the Contact_Form with a non-empty name, a syntactically valid email address, and a non-empty message, THE Contact_Form SHALL send the submission to the Form_Service and SHALL NOT display a validation message.
3. IF a Visitor submits the Contact_Form with an empty required field or a syntactically invalid email address, THEN THE Contact_Form SHALL display a validation message identifying each invalid field and SHALL NOT send the submission to the Form_Service.
4. WHEN the Form_Service confirms successful delivery, THE Contact_Form SHALL display a success confirmation message to the Visitor.
5. IF the Form_Service returns an error or does not respond within 10 seconds, THEN THE Contact_Form SHALL display a failure message that provides the direct email address `singh.ritooraj@gmail.com` as an alternative.
6. THE Contact_Form SHALL send submissions to the Form_Service without embedding any secret credential in the delivered static assets.

### Requirement 7: Resume Access

**User Story:** As a Visitor, I want to view and download the résumé, so that I can review Rituraj Singh's detailed background offline.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display a control that links to the Resume_Asset.
2. WHEN a Visitor activates the résumé download control, THE Portfolio_Site SHALL initiate retrieval of the Resume_Asset file that exists in the RES folder.
3. THE Portfolio_Site SHALL reference the Resume_Asset using a file path that matches the actual résumé file name present in the RES folder.
4. IF the referenced Resume_Asset path does not resolve to an existing file, THEN THE Portfolio_Site SHALL fall back to the résumé PDF file present in the RES folder so that the résumé remains retrievable.

### Requirement 8: Theme Selection and Persistence

**User Story:** As a Visitor, I want to switch between dark and light themes and have my choice remembered, so that I can view the site in my preferred appearance across visits.

#### Acceptance Criteria

1. WHEN a Visitor activates the theme toggle control, THE Theme_Controller SHALL switch the active theme between dark and light.
2. WHEN the Theme_Controller changes the active theme, THE Theme_Controller SHALL persist the selected theme in browser local storage.
3. WHEN the Portfolio_Site loads and a persisted theme exists in browser local storage, THE Theme_Controller SHALL apply the persisted theme.
4. WHEN the Portfolio_Site loads and no persisted theme exists in browser local storage, THE Theme_Controller SHALL apply the dark theme as the default.
5. WHILE either theme is active, THE Portfolio_Site SHALL render all text content at a contrast ratio of at least 4.5 to 1 against its background.

### Requirement 9: Responsive Layout

**User Story:** As a Visitor, I want the site to display correctly on any device, so that I can browse it comfortably on mobile, tablet, or desktop.

#### Acceptance Criteria

1. WHERE the Visitor's viewport width is 767 pixels or less, THE Portfolio_Site SHALL present all Sections in a single-column layout.
2. WHERE the Visitor's viewport width is 767 pixels or less, THE Portfolio_Site SHALL present navigation through a collapsible menu control.
3. THE Portfolio_Site SHALL render content without horizontal page scrolling at every viewport width at which the Portfolio_Site is displayed.
4. WHERE the Visitor's viewport width is 768 pixels or greater, THE Portfolio_Site SHALL present the hero Section in the split-screen layout.

### Requirement 10: Cross-Browser Support

**User Story:** As a Visitor, I want the site to work in my browser, so that I have a consistent experience regardless of which major browser I use.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render all Sections and support navigation in each Supported_Browser.
2. IF a browser does not support the custom cursor or canvas background effects, THEN THE Portfolio_Site SHALL display the underlying content and remain navigable.

### Requirement 11: SEO and Social Sharing Metadata

**User Story:** As Rituraj Singh, I want the site to be discoverable and to preview well when shared, so that it strengthens my professional presence.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL include a page title, a meta description, and an author meta tag in the document head.
2. THE Portfolio_Site SHALL include Open Graph metadata for title, description, type, image, and URL in the document head.
3. THE Portfolio_Site SHALL include a canonical URL referencing `https://ritooraj01.github.io`.
4. THE Portfolio_Site SHALL provide a `sitemap.xml` file and a `robots.txt` file at the site root.

### Requirement 12: Accessibility

**User Story:** As a Visitor who uses assistive technology or keyboard navigation, I want the site to be accessible, so that I can perceive and operate all content.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL provide descriptive alternative text for every informational image.
2. THE Portfolio_Site SHALL provide an accessible name for every interactive control.
3. WHEN a Visitor navigates the Portfolio_Site using the keyboard, THE Portfolio_Site SHALL make every interactive control reachable and operable through keyboard input.
4. WHEN an interactive control receives keyboard focus, THE Portfolio_Site SHALL display a visible focus indicator on that control.
5. THE Portfolio_Site SHALL define a document language in the root HTML element.

### Requirement 13: Coordinated Motion Design

**User Story:** As a Visitor, I want smooth and cohesive motion and micro-interactions, so that the site feels polished without being distracting.

#### Acceptance Criteria

1. WHEN a Section enters the Visitor's viewport during scrolling, THE Motion_System SHALL apply an entrance animation to that Section's content.
2. WHEN a Visitor points to or focuses on an interactive control, THE Motion_System SHALL apply a feedback micro-interaction to that control regardless of the Reduced_Motion_Preference, using non-motion styling cues (for example color, opacity, or outline change) while the Reduced_Motion_Preference is enabled.
3. WHILE the Reduced_Motion_Preference is enabled, THE Motion_System SHALL disable non-essential entrance and background animations and SHALL present each Section's content in its final visible state.
4. WHILE the Reduced_Motion_Preference is disabled, THE Motion_System SHALL apply entrance animations to Sections and motion micro-interactions to interactive controls.

### Requirement 14: Performance

**User Story:** As a Visitor, I want the site to load quickly and run smoothly, so that I can browse without delay or stutter.

#### Acceptance Criteria

1. WHEN the Portfolio_Site is loaded over a broadband connection, THE Portfolio_Site SHALL reach an interactive state within 3 seconds.
2. THE Portfolio_Site SHALL defer loading of below-the-fold images until they approach the Visitor's viewport.
3. WHILE a Visitor scrolls the Portfolio_Site on a desktop Supported_Browser, THE Motion_System SHALL sustain scroll and animation rendering at a minimum of 30 frames per second.

### Requirement 15: Content Sections

**User Story:** As a Visitor, I want a complete set of professional content sections, so that I can learn about Rituraj Singh's background, skills, and work.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL display a hero Section containing the name "Rituraj Singh" and the role "DevOps Engineer | Cloud Infrastructure | SRE".
2. THE Portfolio_Site SHALL display an about Section, a skills Section, a projects Section, an architecture Section, an experience Section, a certifications Section, and a contact Section.
3. THE Portfolio_Site SHALL display the contact links email `singh.ritooraj@gmail.com`, GitHub `github.com/ritooraj01`, and LinkedIn `linkedin.com/in/rituraj-singh-0001`.
4. WHEN a Visitor activates a navigation control for a Section, THE Portfolio_Site SHALL scroll to the corresponding Section.

### Requirement 16: GitHub Pages Deployment

**User Story:** As Rituraj Singh, I want the enhanced site to deploy on GitHub Pages, so that I can host it at no cost using my existing setup.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL consist only of static assets that execute without any server-side runtime.
2. THE Portfolio_Site SHALL reference all local assets using relative paths that resolve correctly when served from the GitHub Pages root of `ritooraj01.github.io`.
3. THE Portfolio_Site SHALL load all third-party dependencies over HTTPS.
