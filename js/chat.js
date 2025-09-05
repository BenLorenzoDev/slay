// Interactive Chat System - Ben Lorenzo Magbanua
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const quickButtons = document.querySelectorAll('.quick-btn');

// Chat responses with Filipino-friendly voice
const responses = {
    about: {
        messages: [
            "Hey, I'm Ben! 👋",
            "I'm a **Workflow & Automation Architect** based in the Philippines. I help founders and service-based businesses design systems that actually *work* using n8n, GHL, Airtable, and AI.",
            "I'm also one of the founders of **TambayanPH** — a Filipino hangout for automation builders. It's our little corner where we share knowledge and help each other grow.",
            "Outside of tech, I'm a full-time dad, learner, and storyteller. I love documenting systems and making automation accessible to anyone — even non-tech folks.",
            "Fun fact: I believe in the power of community. That's why I'm passionate about teaching Filipino builders how to leverage automation. Sama-sama tayong aangat! 🇵🇭"
        ]
    },
    projects: {
        messages: [
            "Let me show you some cool stuff I built! 💼",
            "**AI Messenger Assistant** 🤖\nBuilt for a fitness brand. Handles inquiries, syncs leads to CRM, and even schedules appointments. This baby processes 500+ conversations daily!",
            "**Comment Moderator AI** 💬\nAuto-replies, hides, or escalates Facebook comments using Pinecone + GHL. Saved my client 20 hours per week of manual moderation.",
            "**CRM Sync System** 🔄\nKeeps 11,000+ GHL contacts and 14,000+ opportunities synced with Airtable. Real-time, bidirectional sync with error handling.",
            "**Voice AI Agent** 📞\nHandles inbound calls using OpenAI + Vapi and routes leads via voice. It's like having a 24/7 Filipino virtual assistant!",
            "**AI Knowledgebase Uploader** 📚\nParses PDFs, call transcripts, and websites, feeding a Pinecone vector DB. Perfect for creating smart chatbots that actually know their stuff.",
            "**SMS Sales System** 📱\n100% automated SMS outreach using n8n, Instantly, and AI response logic. Converts cold leads to warm conversations."
        ]
    },
    skills: {
        messages: [
            "Here are my superpowers! ⚡",
            "**Workflow Design** 🎨\nDesigning zero-fluff automation workflows that actually solve problems, not create new ones",
            "**Integration Magic** 🔗\nGHL + Airtable + n8n syncs and logic. I make different tools talk to each other like they're best friends",
            "**AI Implementation** 🤖\nChat, Voice, SMS, Comment mod - if it can be automated with AI, I've probably built it",
            "**Vector Databases** 🧠\nUsing Pinecone + Zep for hallucination-safe agents. Because nobody wants an AI that makes stuff up!",
            "**Teaching & Mentoring** 👨‍🏫\nCoaching freelancers in the Philippines to learn n8n. Sharing is caring, diba?",
            "**API Wizardry** 🪄\nCreating API workflows and multi-channel integrations that handle thousands of records without breaking a sweat",
            "**Documentation** 📝\nSystem documentation with diagrams and structured prompts. Because future-you will thank present-you!",
            "**Scale Management** 📈\nHandling 10K+ record syncs and API batching with proper error handling. Big data? No problem!"
        ]
    },
    current: {
        messages: [
            "Here's what I've been up to lately! 🕹️",
            "**Running backend ops for WeFlex** 💪\nAn inclusive fitness brand in Australia. I handle all their automation and make sure their systems run smooth as silk.",
            "**Launching AI-powered customer support agents** 🚀\nHelping businesses implement chatbots that actually help, not frustrate customers.",
            "**Teaching at TambayanPH** 🇵🇭\nSharing n8n and automation knowledge with Filipino builders. We have weekly sessions where I break down complex workflows into bite-sized lessons.",
            "**Building internal tools** 🛠️\nCreating matchmaking systems, lead routing tools, and knowledgebase search engines for various clients.",
            "**White-label solutions** 🏷️\nDeveloping sales chatbots and moderation tools that agencies can rebrand as their own.",
            "**Supporting early-stage teams** 🌱\nHelping startups build MVP-level automations without breaking the bank.",
            "**Documentation projects** 📚\nCreating comprehensive guides and video tutorials. Knowledge hoarding is so last year!"
        ]
    },
    tambayan: {
        messages: [
            "Ah, TambayanPH! My passion project! 🇵🇭",
            "**TambayanPH** is our Filipino community for automation builders. 'Tambayan' means hangout spot - and that's exactly what we created!",
            "We're a group of Filipino freelancers, agency owners, and tech enthusiasts learning and growing together in the automation space.",
            "Check us out at https://tambayanph.com/ and follow our Facebook page at https://www.facebook.com/TambyanPH!",
            "**What we do:**\n• Weekly n8n workshops in Taglish\n• Workflow sharing sessions\n• Client project collaborations\n• Mentorship programs for beginners",
            "The best part? We help each other land international clients. When one of us wins, we all win! 🎯",
            "We believe Filipinos have incredible potential in the global automation market. We just need to support each other and level up together.",
            "Interested in joining? Hit me up! We're always looking for passionate builders who want to learn and contribute. Tara na!"
        ]
    },
    work: {
        messages: [
            "Let's work together! 🚀",
            "I'm currently **open for projects** and love working with teams who value efficiency and innovation.",
            "**What I can help you with:**\n• Workflow automation design and implementation\n• AI integration (chatbots, voice agents, SMS systems)\n• CRM and database synchronization\n• Process optimization and documentation\n• Team training on automation tools",
            "**My ideal client:**\n• Service-based businesses ready to scale\n• Agencies looking for white-label automation\n• Startups needing MVP automation\n• Teams tired of manual, repetitive tasks",
            "**How I work:**\n• Discovery call to understand your needs\n• Propose a no-fluff solution\n• Build, test, and iterate\n• Document everything\n• Train your team",
            "**Rates:** Project-based or retainer options available. I believe in fair pricing that delivers ROI.",
            "Ready to automate your way to success? Click that 'Contact Me' button up top or shoot me an email at benlorenzo.dev@gmail.com 📧",
            "PS: I also offer special rates for Filipino startups. Supportahan natin ang ating mga kababayan! 🇵🇭"
        ]
    }
};

// Add typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.innerHTML = `
        <div class="message-bubble">
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
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
    
    // Parse markdown-style formatting
    let formattedMessage = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `
        <div class="message-bubble">
            <p>${formattedMessage}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle quick button clicks
quickButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const action = button.getAttribute('data-action');
        const buttonText = button.querySelector('.btn-text').textContent;
        
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
                    }, index * 600);
                });
            }, 1200);
        }
    });
});

// Handle custom messages
function handleCustomMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greetings (including Filipino)
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
        lowerMessage.includes('kumusta') || lowerMessage.includes('musta')) {
        return [
            "Hey there! Kumusta ka? 👋", 
            "What can I help you with today? Feel free to ask me anything about automation, or click the topics above!"
        ];
    }
    
    // Thank you (including Filipino)
    else if (lowerMessage.includes('thank') || lowerMessage.includes('salamat')) {
        return [
            "Walang anuman! (You're welcome!) 😊", 
            "Happy to help! If you need anything else, just let me know!"
        ];
    }
    
    // Goodbye
    else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || 
             lowerMessage.includes('paalam')) {
        return [
            "Paalam! Thanks for dropping by! 👋", 
            "Feel free to come back anytime. Ingat ka! (Take care!)"
        ];
    }
    
    // Work/Hire
    else if (lowerMessage.includes('hire') || lowerMessage.includes('work') || 
             lowerMessage.includes('project') || lowerMessage.includes('cost')) {
        return [
            "Great! I'd love to discuss how I can help! 🚀",
            "You can reach me at benlorenzo.dev@gmail.com or click the 'Contact Me' button above.",
            "Let's set up a discovery call to understand your needs better!"
        ];
    }
    
    // n8n specific
    else if (lowerMessage.includes('n8n')) {
        return [
            "Ah, n8n! My favorite automation tool! 🛠️",
            "I've been using n8n for years and love how flexible it is. Want to learn? Join us at TambayanPH!",
            "I can help you build custom n8n workflows or train your team. Let's chat!"
        ];
    }
    
    // Filipino/Tagalog detection
    else if (lowerMessage.includes('pinoy') || lowerMessage.includes('filipino') || 
             lowerMessage.includes('tagalog')) {
        return [
            "Uy, Pinoy ka rin? Nice! 🇵🇭",
            "I love working with fellow Filipinos! Check out TambayanPH - it's our community for Filipino automation builders.",
            "Sama ka sa amin! We help each other grow and land international clients."
        ];
    }
    
    // Default response
    else {
        return [
            "That's a great question! 🤔",
            "While I don't have a specific answer ready for that, feel free to email me at benlorenzo.dev@gmail.com",
            "Or explore the topics above to learn more about what I do!"
        ];
    }
}

// Handle send button and enter key
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
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
                }, index * 500);
            });
        }, 1000);
    }
}

// Animate buttons on load
document.addEventListener('DOMContentLoaded', () => {
    quickButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        setTimeout(() => {
            button.style.transition = 'all 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 800 + (index * 100));
    });
});

// Easter egg: Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        addMessage("🎮 Konami code activated! You found the easter egg! Here's a fun fact: I'm also a gamer when I'm not building automations. Currently playing Hades II!");
        konamiCode = [];
    }
});