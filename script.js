document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const setupScreen = document.getElementById('setupScreen');
    const chatContainer = document.getElementById('chatContainer');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const startChatBtn = document.getElementById('startChatBtn');
    const userNameInput = document.getElementById('userName');
    const typingIndicator = document.getElementById('typingIndicator');
    const themeToggle = document.getElementById('themeToggle');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const resetChatBtn = document.getElementById('resetChatBtn');
    const bgOptions = document.querySelectorAll('.bg-option');
    const bgUpload = document.getElementById('bgUpload');
    
    // Variables
    let userName = '';
    const aiName = 'Rafxz-Ai';
    const aiAvatar = 'https://i.imgur.com/JnQJxZc.png';
    const apiUrl = 'https://api.siputzx.my.id/api/ai/gemini-pro?content=';
    let chatHistory = [];

    // Theme toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDark);
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
    
    // Start chat button
    startChatBtn.addEventListener('click', function() {
        userName = userNameInput.value.trim();
        if (!userName) {
            alert('Masukkan nama Anda terlebih dahulu');
            return;
        }
        
        setupScreen.style.display = 'none';
        chatContainer.style.display = 'flex';
        
        // Show greeting message
        setTimeout(() => {
            addMessage('ai', `${aiName}: Halo ${userName}! Saya ${aiName}, AI yang dikembangkan oleh Rafxz. Ada yang bisa saya bantu?`);
        }, 500);
    });
    
    // Send message on button click or Enter key
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Settings button
    settingsBtn.addEventListener('click', function() {
        settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
    });
    
    // Reset chat button
    resetChatBtn.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin mereset percakapan?')) {
            chatMessages.innerHTML = '';
            chatHistory = [];
            addMessage('ai', `${aiName}: Percakapan telah direset. Ada yang bisa saya bantu?`);
        }
    });
    
    // Background selection
    bgOptions.forEach(option => {
        option.addEventListener('click', function() {
            bgOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const bgValue = this.getAttribute('data-bg');
            document.body.style.backgroundImage = bgValue === 'none' ? '' : bgValue;
            localStorage.setItem('customBg', bgValue);
        });
    });
    
    // Load saved background
    const savedBg = localStorage.getItem('customBg');
    if (savedBg) {
        document.body.style.backgroundImage = savedBg === 'none' ? '' : savedBg;
        bgOptions.forEach(option => {
            if (option.getAttribute('data-bg') === savedBg) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }
    
    // Background upload
    bgUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const bgValue = `url(${event.target.result})`;
                document.body.style.backgroundImage = bgValue;
                localStorage.setItem('customBg', bgValue);
                
                // Update selected option
                bgOptions.forEach(opt => opt.classList.remove('selected'));
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Send message function
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage('user', message);
        userInput.value = '';
        
        // Show typing indicator
        typingIndicator.style.display = 'flex';
        
        try {
            // Call Rafxz-Ai API
            const response = await fetch(apiUrl + encodeURIComponent(message));
            
            if (!response.ok) {
                throw new Error('Gagal mendapatkan respons');
            }
            
            const data = await response.json();
            
            if (!data.status) {
                throw new Error('Respons tidak valid');
            }
            
            let aiResponse = data.data || `${aiName}: Saya tidak sepenuhnya memahami pertanyaan Anda. Bisakah Anda memberikan lebih banyak detail?`;
            
            // Ensure AI name is in response
            if (!aiResponse.startsWith(aiName)) {
                aiResponse = `${aiName}: ${aiResponse}`;
            }
            
            // Personalize with user name
            aiResponse = aiResponse.replace(/\b(kamu|Kamu|Anda|you)\b/gi, userName);

            addMessage('ai', aiResponse);
        } catch (error) {
            console.error('Error:', error);
            addMessage('ai', `${aiName}: Maaf, terjadi kesalahan. Coba lagi nanti ya!`);
        } finally {
            typingIndicator.style.display = 'none';
        }
    }
    
    // Add message to chat
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        if (text) {
            const textNode = document.createElement('div');
            textNode.textContent = text;
            messageDiv.appendChild(textNode);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add to chat history
        chatHistory.push({
            sender,
            text,
            timestamp: new Date().toISOString()
        });
    }
});