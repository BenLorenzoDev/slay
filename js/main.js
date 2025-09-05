// Chat functionality
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const quickButtons = document.querySelectorAll('.quick-btn');

// Response data for different topics
const responses = {
    about: {
        messages: [
            "Great question! Let me tell you about myself...",
            "I'm a passionate Full-Stack Developer with a love for creating meaningful digital experiences. My journey in tech started with curiosity and has grown into a career dedicated to solving problems through code.",
            "I specialize in modern web technologies and enjoy working on both frontend and backend challenges. When I'm not coding, you'll find me exploring new technologies, contributing to open source, or enjoying a good game of chess.",
            "I believe in writing clean, maintainable code and creating user experiences that make a difference."
        ]
    },
    superpowers: {
        messages: [
            "Ah, my superpowers! Let me share what I bring to the table... ⚡",
            "🚀 **Frontend Magic**: React, Vue.js, TypeScript, and creating pixel-perfect, responsive designs that users love",
            "⚙️ **Backend Wizardry**: Node.js, Python, PostgreSQL, MongoDB - I can architect scalable solutions that perform",
            "☁️ **Cloud Mastery**: AWS, Docker, CI/CD pipelines - I ensure smooth deployments and reliable infrastructure",
            "🎨 **Design Sense**: I bridge the gap between design and development, turning mockups into living, breathing applications",
            "🧠 **Problem Solving**: Complex algorithms? System design? I love tackling challenges that make me think!"
        ]
    },
    projects: {
        messages: [
            "I'd love to show you some of my recent work! 💼",
            "**E-Commerce Platform** 🛍️\nBuilt a full-stack marketplace with React, Node.js, and Stripe integration. Features real-time inventory, secure payments, and an admin dashboard. 50k+ transactions processed.",
            "**Task Management SaaS** 📊\nDeveloped a collaborative project management tool using Vue.js and GraphQL. Includes real-time updates, team collaboration features, and advanced analytics.",
            "**AI-Powered Chat Application** 🤖\nCreated an intelligent chatbot using Python, TensorFlow, and WebSocket for real-time communication. Handles 1000+ concurrent users.",
            "**Open Source Contributions** 🌟\nRegular contributor to several popular repositories. My PRs have helped improve developer experience for thousands of users.",
            "Want to see live demos or GitHub repos? Just ask!"
        ]
    },
    experience: {
        messages: [
            "Here's my professional journey so far! 🎯",
            "**Senior Full-Stack Developer** | TechCorp (2021-Present)\n• Led development of microservices architecture serving 2M+ users\n• Reduced API response time by 60% through optimization\n• Mentored junior developers and conducted code reviews",
            "**Full-Stack Developer** | StartupXYZ (2019-2021)\n• Built MVP from scratch that secured $2M in funding\n• Implemented CI/CD pipeline reducing deployment time by 80%\n• Worked directly with clients to gather requirements",
            "**Frontend Developer** | Digital Agency (2018-2019)\n• Developed responsive websites for 20+ clients\n• Improved site performance scores by average of 40%\n• Introduced modern development practices to the team",
            "**Education** 🎓\nBachelor's in Computer Science | Tech University\nContinuous learner through online courses and certifications"
        ]
    },
    contact: {
        messages: [
            "I'd love to connect with you! 📧",
            "Here are the best ways to reach me:",
            "📧 **Email**: your.email@example.com\n💼 **LinkedIn**: linkedin.com/in/yourprofile\n🐙 **GitHub**: github.com/yourusername\n🐦 **Twitter**: @yourhandle",
            "📱 **Phone**: Available upon request\n📍 **Location**: Open to remote opportunities worldwide",
            "Whether you have a project in mind, want to collaborate, or just want to say hi, I'm always happy to chat!",
            "Response time: Usually within 24 hours ⏰"
        ]
    },
    fun: {
        messages: [
            "Oh, you want to know the fun stuff? Here we go! 🎮",
            "🎯 **Hobbies**: Gaming (especially indie games), Chess, Photography, and Building mechanical keyboards",
            "📚 **Currently Reading**: 'Clean Architecture' by Robert C. Martin",
            "🎵 **Coding Playlist**: Lo-fi beats and synthwave - helps me get in the zone!",
            "☕ **Coffee or Tea?**: Coffee, definitely coffee. My code runs on caffeine!",
            "🎮 **Favorite Game**: Currently obsessed with Hades II",
            "🌟 **Fun Fact**: I once debugged a production issue while on a mountain hiking trip using just my phone!",
            "Want to know more? Feel free to ask anything!"
        ]
    },
    availability: {
        messages: [
            "Great question about my availability! 🚀",
            "✅ **Currently Open to Work**: Yes! I'm actively looking for exciting opportunities",
            "🌍 **Remote Friendly**: 100% - I've been successfully working remotely for years with teams across different time zones",
            "📍 **Location Flexible**: Open to remote, hybrid, or on-site positions for the right opportunity",
            "⏰ **Availability**: Can start immediately or with standard notice period",
            "💼 **Ideal Roles**: Workflow & Automation Architect, DevOps Engineer, Systems Integration Specialist, or similar positions where I can design and implement efficient automated solutions",
            "🎯 **Work Preferences**:\n• Full-time or long-term contract positions\n• Projects involving workflow optimization and automation\n• Teams that value innovation and efficiency",
            "Let's discuss how I can help transform your workflows and processes! Feel free to reach out through the 'Let's Connect' option."
        ]
    }
};

// Add typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

// Add message to chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} appear`;
    
    // Parse markdown-style bold text
    const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${formattedMessage.replace(/\n/g, '<br>')}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle quick button clicks
quickButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const action = button.getAttribute('data-action');
        const buttonText = button.textContent.trim();
        
        // Add user message
        addMessage(buttonText, true);
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Get responses for this action
        const actionResponses = responses[action];
        
        if (actionResponses) {
            // Remove typing indicator before showing messages
            setTimeout(() => {
                typingIndicator.remove();
                
                // Add bot messages with delays
                actionResponses.messages.forEach((message, index) => {
                    setTimeout(() => {
                        addMessage(message);
                    }, index * 800); // 800ms delay between messages
                });
            }, 1500); // Initial typing delay
        }
    });
});

// Handle custom messages
function handleCustomMessage(message) {
    // Simple keyword-based responses
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return ["Hello there! 👋", "How can I help you today?"];
    } else if (lowerMessage.includes('thank')) {
        return ["You're welcome!", "Happy to help! Feel free to ask anything else."];
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
        return ["Goodbye! It was great chatting with you!", "Feel free to come back anytime! 👋"];
    } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
        return ["I'd be happy to share my resume!", "You can download it from the link in the contact section, or I can email it to you directly."];
    } else if (lowerMessage.includes('hire') || lowerMessage.includes('job') || lowerMessage.includes('work')) {
        return ["I'm currently open to new opportunities!", "I'd love to discuss how I can contribute to your team. Feel free to reach out through the contact information provided."];
    } else {
        return ["That's an interesting question!", "While I don't have a specific response prepared for that, feel free to reach out to me directly through the contact section and we can discuss it in detail!"];
    }
}

// Handle send button and enter key
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        // Add user message
        addMessage(message, true);
        
        // Clear input
        chatInput.value = '';
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();
        
        // Get and display bot response
        setTimeout(() => {
            typingIndicator.remove();
            const responses = handleCustomMessage(message);
            responses.forEach((response, index) => {
                setTimeout(() => {
                    addMessage(response);
                }, index * 600);
            });
        }, 1000);
    }
}

// Add some initial animation to the buttons
document.addEventListener('DOMContentLoaded', () => {
    quickButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        setTimeout(() => {
            button.style.transition = 'all 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 1000 + (index * 100));
    });
});

// Add minimize functionality
document.querySelector('.minimize-btn').addEventListener('click', () => {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.style.transition = 'all 0.3s ease';
    
    if (chatContainer.style.transform === 'scale(0.9)') {
        chatContainer.style.transform = 'scale(1)';
    } else {
        chatContainer.style.transform = 'scale(0.9)';
    }
});