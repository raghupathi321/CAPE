
<body>
  <h1>📚 CAPE Lesson Tracking System (React)</h1>

  <p>
    This React-based frontend is part of the CAPE Lesson Tracking System, used by the 321 Education Foundation to manage, distribute, and track engagement on lesson content across schools.
  </p>

  <h2>📁 Project Structure</h2>
  <div class="folder">
    <pre>
CAPE/
├── backend/                  # Optional backend (Flask/Django/Node)
├── public/                   # Static assets
├── src/
│   ├── App.js                # Main app entry point
│   ├── index.css             # Global styles
│   └── Components/
│       ├── Analytics.js
│       ├── LessonRedirect.js
│       ├── Navbar.js
│       ├── ShortenLessonLink.js
│       ├── LessonUpload.js
│       ├── ViewLesson.js
│       ├── Chatbot.js
│       ├── Chatbot.css
│       ├── NotFound.js
│       ├── LinkGenerator.js
│       ├── SchoolManagement.js
│       └── UserManagement.js
    </pre>
  </div>

  <h2>⚙️ Components Overview</h2>
  <ul>
    <li><strong>Analytics.js</strong>: Visual dashboard for lesson click tracking and usage insights.</li>
    <li><strong>LessonRedirect.js</strong>: Parses query parameters, logs access, and redirects to Google Slide lessons.</li>
    <li><strong>Navbar.js</strong>: Navigation menu linking to dashboard, tools, etc.</li>
    <li><strong>ShortenLessonLink.js</strong>: UI to generate shareable tracking links with school/grade/week parameters.</li>
    <li><strong>LessonUpload.js</strong>: Form to upload and tag new lessons (grade, week, board, etc.).</li>
    <li><strong>ViewLesson.js</strong>: Displays all available lessons for a school or filter combination.</li>
    <li><strong>Chatbot.js</strong>: Support or FAQ chatbot interface for teachers/admins.</li>
    <li><strong>NotFound.js</strong>: Custom 404 page.</li>
    <li><strong>LinkGenerator.js</strong>: Core logic for tracking URL creation.</li>
    <li><strong>SchoolManagement.js</strong>: Admin tool to add/edit schools and their metadata.</li>
    <li><strong>UserManagement.js</strong>: Admin tool to manage teacher or content team access (if needed).</li>
  </ul>

  <h2>🚀 Getting Started</h2>
  <pre><code>
# Install dependencies
npm install

# Start the development server
npm start
  </code></pre>

  <h2>🔗 Example Lesson Link</h2>
  <pre><code>https://cape.org/lesson?s_id=ABC123&g=6&w=3&t=low</code></pre>
  <p>
    The system logs the access and redirects the user to the corresponding Google Slide while updating analytics.
  </p>

  <h2>🛠️ Technologies Used</h2>
  <ul>
    <li>React.js</li>
    <li>React Router</li>
    <li>Chart.js or Recharts (for Analytics)</li>
    <li>Google Slides (for content)</li>
  </ul>

 


 
</body>

